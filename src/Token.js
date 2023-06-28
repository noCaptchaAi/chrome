console.log("token rq from 5");

let count = 0;
let lastReq;
(async () => {
    const searchParams = new URLSearchParams(location.hash);
    const isWidget = searchParams.get("#frame") === "checkbox";
    const endpoint = "https://token.nocaptchaai.com/token";
    // const endpoint = "http://127.0.0.1:8077/token";
    const headers = {
        "Content-Type": "application/json",
        apikey: "test1-c4971e46-8d7f-cebd-1683-e0e4c6ff27dc",
    };
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", onXHR);
        open.apply(this, arguments);
    };

    async function onXHR() {
        if (this.responseType === "" && this.responseText) {
            const responseURL = this.responseURL;
            if (
                responseURL.startsWith("https://hcaptcha.com/checksiteconfig")
            ) {
                let req = JSON.parse(this.responseText)?.c.req;
                if (lastReq && lastReq == req) {
                    return;
                }
                lastReq = req;
                console.log("req:", req);
                await sendReq(req);
            }
        }
    }

    async function solveHC(url) {
        console.log("solveHC ran");
        //todo improve

        const res = await fetch(url, { headers });
        const data = await res.json();
        console.log("data", data);
        if (data.success) {
            window.parent.postMessage(
                JSON.stringify({
                    source: "hcaptcha",
                    label: "challenge-closed",
                    id: searchParams.get("id"),
                    contents: {
                        event: "challenge-passed",
                        response: data.token,
                        expiration: 120,
                    },
                }),
                "*"
            );
        }
    }

    if (isWidget) {
        console.log(isWidget);
        return;
    }

    async function sendReq(rq) {
        console.log("count", count);
        if (count >= 1) return;

        try {
            // await sleep(2000);
            console.log("tok ran");
            const response = await fetch(endpoint, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    sitekey: searchParams.get("sitekey"),
                    url: searchParams.get("host"),
                    type: "hcaptcha",
                    proxy: {},
                    rqdata: rq,
                    useragent: navigator.userAgent,
                }),
            });
            const data = await response.json();
            if (data.status === "created") {
                await solveHC(data.url);
            }
        } catch (error) {
            console.error("Fetch error:", error.message);
        }
        count++;
    }
})();
