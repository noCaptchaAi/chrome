const version = "1.0";
(async () => {
    let settings = await chrome.storage.sync.get(null);
    let logs = settings.logsEnabled === "true" ? true : false;
    function log(...args) {
        if (logs) {
            console.log(...args);
        }
    }
    if (!settings.APIKEY) return;

    function isMulti() {
        return document.querySelector(".task-answers") !== null;
    }
    function isGrid() {
        return document.querySelectorAll(".task-image .image")?.length === 9;
    }
    function isBbox() {
        return document.querySelector(".bounding-box-example") !== null;
    }

    (async () => {
        if (settings.extensionEnabled === "false") return;
        if (settings.hCaptchaEnabled === "false") return;
        // utils
        const $ = (selector) => document.querySelector(selector);
        const $$ = (selector) => document.querySelectorAll(selector);

        // if (window.top === window) {
        //   if(logs) log(
        //     "auto open= ",
        //     settings.autoOpen + "auto solve= ",
        //     settings.autoSolve + "loop running in bg"
        //   );
        // }
        function isWidget() {
            const rect = document.body.getBoundingClientRect();
            if (rect?.width === 0 || rect?.height === 0) {
                return false;
            }

            return document.querySelector("div.check") !== null;
        }

        function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        function randTimer(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        function isSolved() {
            try {
                const check = document.querySelector("div.check");
                return check && check.style.display === "block";
            } catch (error) {
                console.error(error);
                return false;
            }
        }
        // function shouldRun() {
        //   return !navigator.onLine || stop || settings.apikey === undefined || "";
        // }
        const shouldRun = () => {
            return (
                !navigator.onLine ||
                stop ||
                settings.PLANTYPE == null ||
                settings.APIKEY === undefined ||
                settings.APIKEY === ""
            );
        };

        async function getBase64FromUrl(url) {
            const blob = await (await fetch(url)).blob();
            return new Promise(function (resolve) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.addEventListener("loadend", function () {
                    resolve(
                        reader.result.replace(
                            /^data:image\/(png|jpeg);base64,/,
                            ""
                        )
                    );
                });
                reader.addEventListener("error", function () {
                    log("❌ Failed to convert url to base64");
                });
            });
        }

        let lang_xhr = "";
        const searchParams = new URLSearchParams(location.hash);

        let startTime;
        let stop = false;
        // essentials
        const headers = {
            "Content-Type": "application/json",
            apikey: settings.APIKEY,
        };
        // end essentials

        const logs = settings.logsEnabled === "true";
        // start
        while (!shouldRun()) {
            await sleep(1000);

            // console.log("hCaptcha.js running");

            if (settings.hCaptchaAutoOpen === "true" && isWidget()) {
                if (isSolved()) {
                    log("found solved");
                    // if (settings.debugMode === "true") refreshIframes();
                    if (settings.hCaptchaAlwaysSolve === "false") break;
                }

                // domain refferer check

                // await sleep(1000);
                $("#checkbox")?.click();
            } else if (
                settings.hCaptchaAutoSolve === "true" &&
                $("h2.prompt-text") !== null
            ) {
                log("opening box");
                await sleep(1000); // important don't remove
                await solve();
            }
        }

        // function refreshIframes() {
        //     const iframes = document.querySelectorAll("iframe");
        //     iframes.forEach((iframe) => {
        //         iframe.src = iframe.src;
        //     });
        // }

        async function getEn() {
            if (isBbox()) {
                await sleep(200);
                document.querySelector(".display-language.button").click();
                await sleep(100);
                document
                    .querySelector(".language-selector .option:nth-child(23)")
                    .click();
            } else if (isGrid()) {
                await sleep(100);
                document
                    .querySelector(".language-selector .option:nth-child(23)")
                    .click();
            } else if (isMulti()) {
                document.querySelector(".display-language.button").click();
                await sleep(200);
                document
                    .querySelector(".language-selector .option:nth-child(23)")
                    .click();
                await sleep(200);
            }
        }

        function skip() {
            document.querySelector(".button-submit").click();
        }

        async function solve() {
            // console.log("solve ran");
            startTime = new Date();

            let previousTask = [];
            // await sleep(500);
            // if (!isMulti()) {
            if (settings.debugMode == "true" && !isBbox()) {
                document.querySelector(".button-submit").click();
                return;
            }

            if (
                settings.englishLanguage === "true" &&
                (document.documentElement.lang || navigator.language) !== "en"
            ) {
                await getEn();
            }

            log(previousTask);
            if (!previousTask != []) return;

            const { target, cells, images, example, choices } =
                await onTaskReady();

            if (!settings.hCaptchaAutoSolve === "true") {
                return;
            }

            const searchParams = new URLSearchParams(location.hash);
            const type = isMulti() ? "multi" : isBbox() ? "bbox" : "grid";
            if (logs)
                console.log(type, target, cells, images, example, choices);

            try {
                previousTask = images;
                log(previousTask);
                let response = await fetch(await getApi("solve"), {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        images,
                        target,
                        method: "hcaptcha_base64",
                        type,
                        choices: isMulti() ? choices : [],
                        sitekey: searchParams.get("sitekey"),
                        site: searchParams.get("host"),
                        ln: document.documentElement.lang || navigator.language,
                        softid: `chromeExt_V${version}`,
                    }),
                });
                if (!response.ok)
                    return new Error(
                        `Failed to fetch URL. Status code: ${response.status}`
                    );

                response = await response.json();
                const ans = response.answer;
                const msg = response.message;
                const sts = response.status;
                const newurl = response.url;
                const clicktime = randTimer(250, 350);

                log(ans, msg, sts, newurl, clicktime);
                let clicks = 0;


                if (response.error) {
                    log(msg);
                    jsNotif("⚠" + msg);
                } else if (sts === "skip") {
                    log(msg);
                    jsNotif("⚠" + " " + msg);
                } else if (sts === "new") {
                    //  ----------- IF NEW ----------- //

                    if (isMulti()) {
                        // --------- MULTI
                        // await sleep(2000);
                        // const res = await (await fetch(newurl)).json();
                        // const ans = response.answer.map((x) => x.toLowerCase());
                        const ans = response.answer;
                        console.log("multi", ans);
                        if (msg) jsNotif("⚠" + " " + msg);
                        await clickMatchingElement(ans);
                        clicks = clicks + 1;
                    } else if (isGrid()) {
                        // --------- GRID
                        // await sleep(2000);
                        const status = await (await fetch(newurl)).json();
                        if (msg) jsNotif("⚠" + " " + msg);
                        for (const index of status.solution) {
                            cells[index].click();
                            await sleep(clicktime);
                        }
                    } else if (isBbox()) {
                        // -------- BBOX
                        // jsNotif("⚠" + " " + "implementation needed");

                        const res = await (await fetch(newurl)).json();
                        const ans = res.answer;
                        if (msg) jsNotif("⚠" + " " + msg);
                        // console.log("bbox", ans);
                        if (!ans) return;
                        if (ans?.length === 2) {
                            // console.log("bbox", ans);
                            await area(ans);
                            clicks = clicks + 1;
                        }
                    }
                } else if (sts === "solved") {
                    //  ----------- IF SOLVED ----------- //
                    if (isMulti()) {
                        // --------- MULTI
                        // const res = await (await fetch(newurl)).json();
                        // const ans = response.answer.map((x) => x.toLowerCase());
                        const ans = response.answer;
                        log("multi", ans);
                        if (msg) jsNotif("⚠" + " " + msg);
                        await clickMatchingElement(ans);
                        clicks = clicks + 1;
                        log("multi hcap ~ clicks", clicks);
                    } else if (isGrid()) {
                        // --------- GRID
                        const sfl = shuffle(response?.solution);
                        if (msg) jsNotif("⚠" + " " + msg);
                        for (const index of sfl) {
                            cells[index].click();
                            await sleep(clicktime);
                        }
                    } else if (isBbox()) {
                        // ------ BBOX
                        // jsNotif("⚠" + " " + "implementation needed");
                        const res = await (await fetch(newurl)).json();
                        const ans = res.answer;
                        if (!ans) return;
                        if (msg) jsNotif("⚠" + " " + msg);
                        if (ans?.length === 2) {
                            await area(ans);
                            clicks = clicks + 1;
                        }
                    }
                } else if (sts === "falied") {
                    log(msg);
                    jsNotif("⚠" + msg);
                }

                const ET = new Date() - startTime;
                const RT = isMulti()
                    ? settings.hCaptchaMultiSolveTime * 1000 - ET
                    : isBbox()
                        ? settings.hCaptchaBoundingBoxSolveTime * 1000 - ET
                        : settings.hCaptchaGridSolveTime * 1000 - ET;

                if (RT < 0) {
                    await sleep(300);
                }
                await sleep(RT);

                // if (clicks > 0) {
                //   try {
                //     (async () => {
                //       const cvas = await c();
                //       feedback(
                //         cvas,
                //         response.target,
                //         "bbox",
                //         response.id,
                //         response.answer,
                //         apikey(),
                //         "v" + version
                //       );
                //     })();
                //   } catch (error) {
                //     console.log("feedback couldn't be sent");
                //   }
                // }

                document.querySelector(".button-submit").click();
                startTime = 0;
                previousTask = [];
            } catch (error) {
                if (error instanceof TypeError && error.message === "Failed to fetch") {
                    jsNotif("✘ IP timeout, wait 5 minutes and try again", 5000, false);
                    throw new Error("✘ IP timeout, wait 5 minutes and try again",);
                } else {
                    jsNotif(`✘${error}`, 5000, false);
                }
            }
        }
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function fireMouseEvents(element) {
            ["mouseover", "mousedown", "mouseup", "click"].forEach(
                (eventName) => {
                    if (element.fireEvent) {
                        element.fireEvent("on" + eventName);
                    } else {
                        const eventObject = document.createEvent("MouseEvents");
                        eventObject.initEvent(eventName, true, false);
                        element.dispatchEvent(eventObject);
                    }
                }
            );
        }
        async function area(data) {
            function clickOnCanvas(canvas, x, y) {
                const rect = canvas.getBoundingClientRect();
                const events = ["mouseover", "mousedown", "mouseup", "click"];
                const options = {
                    // clientX: x + 83, //rect.left
                    clientX: x + rect.left,
                    // clientY: y + 63, // rect.top
                    clientY: y + rect.top,
                    bubbles: true,
                };

                for (let i = 0; i < events.length; i++) {
                    const event = new MouseEvent(events[i], options);
                    canvas.dispatchEvent(event);
                }
            }
            const canvas = document.querySelector("canvas");
            canvas.addEventListener("mousedown", function (e) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                log("x: " + x + " y: " + y, data);
            });
            const [x, y] = data;
            clickOnCanvas(canvas, x, y);
        }

        async function getApi(v) {
            if (settings.PLANTYPE === "custom") {
                // console.log("custom endpoint", k);
                return "https://" + settings.customEndpoint + "/" + v;
            }
            return "https://" + settings.PLANTYPE + ".nocaptchaai.com/" + v;
        }

        async function clickMatchingElement(res) {
            for (const e of res) {
                const ele = [...document.querySelectorAll(".answer-text")].find(
                    (el) => el.outerText === e
                );
                // if(logs) console.log(ele?.children?.children?.outerText);
                fireMouseEvents(ele);
                // await sleep(500);
                if (
                    ![...document.querySelectorAll(".answer-example")].some(
                        (el) =>
                            el.style.backgroundColor === "rgb(116, 116, 116)"
                    )
                ) {
                    fireMouseEvents(ele);
                }
                // await sleep(500);
            }
        }

        async function sliceOG() {
            const originalCanvas = document.querySelector("canvas");
            if (!originalCanvas) return null;

            const [originalWidth, originalHeight] = [
                originalCanvas.width,
                originalCanvas.height,
            ];

            // Check if the original canvas has content
            const originalCtx = originalCanvas.getContext("2d");
            const originalImageData = originalCtx.getImageData(
                0,
                0,
                originalWidth,
                originalHeight
            );
            const allPixelsTransparentOrBlack = Array.from(
                originalImageData.data
            ).every((value, index) => index % 4 === 3 || value === 0);

            if (allPixelsTransparentOrBlack) {
                console.error("The original canvas has no valid content");
                return null;
            }

            const desiredWidth = parseInt(originalCanvas.style.width, 10);
            const desiredHeight = parseInt(originalCanvas.style.height, 10);

            // Check if the desired width and height are valid positive numbers
            if (desiredWidth <= 0 || desiredHeight <= 0) {
                console.error(
                    "Desired width and height should be positive numbers"
                );
                return null;
            }

            const scaleFactor = Math.min(
                desiredWidth / originalWidth,
                desiredHeight / originalHeight
            );
            const [outputWidth, outputHeight] = [
                originalWidth * scaleFactor,
                originalHeight * scaleFactor,
            ];

            const outputCanvas = document.createElement("canvas");
            Object.assign(outputCanvas, {
                width: outputWidth,
                height: outputHeight,
            });

            const ctx = outputCanvas.getContext("2d");
            ctx.drawImage(
                originalCanvas,
                0,
                0,
                originalWidth,
                originalHeight,
                0,
                0,
                outputWidth,
                outputHeight
            );

            return outputCanvas
                .toDataURL("image/jpeg", 0.4)
                .replace(/^data:image\/(png|jpeg);base64,/, "");
        }

        function c() {
            const canvas = document.querySelector("canvas");
            if (!canvas) return null;
            const dataUrl = canvas.toDataURL("image/jpeg", 0.1);
            if (
                !/^data:image\/(png|jpeg);base64,([A-Za-z0-9+/=])+/.test(
                    dataUrl
                )
            )
                return null;
            const imageData = dataUrl.replace(
                /^data:image\/(png|jpeg);base64,/,
                ""
            );
            const image = new Image();
            image.src = "data:image/jpeg;base64," + imageData;
            return new Promise((resolve, reject) => {
                image.onload = () => {
                    if (image.width > 0 && image.height > 0) {
                        resolve(imageData);
                    } else {
                        reject(new Error("Corrupted image"));
                    }
                };
                image.onerror = () => reject(new Error("Invalid image"));
            });
        }

        function onTaskReady(i = 500) {
            return new Promise(async (resolve) => {
                const check_interval = setInterval(async function () {
                    let targetText =
                        document.querySelector(".prompt-text")?.textContent;
                    if (!targetText) return;

                    let cells = null;
                    let images = {};
                    let example = {};
                    let choices = [];

                    if (isGrid()) {
                        cells = document.querySelectorAll(".task-image .image");
                        if (cells.length !== 9) return;

                        for (let i = 0; i < cells.length; i++) {
                            const img = cells[i];
                            if (!img) return;
                            const url =
                                img.style.background
                                    .match(/url\("(.*)"/)
                                    ?.at(1) || null;
                            if (!url || url === "") return;
                            images[i] = await getBase64FromUrl(url);
                        }
                        // if(logs) console.log("images", images);
                    } else if (isMulti()) {
                        // if(logs) console.log("multi");
                        const bg =
                            document.querySelector(".task-image .image").style
                                .background;
                        if (!bg) return;
                        let singleImg = "";
                        try {
                            singleImg =
                                (await getBase64FromUrl(
                                    bg.match(/url\("(.*)"/)?.at(1)
                                )) || "";
                        } catch (e) {
                            log(e);
                        }
                        if (!example) return;

                        Object.assign(images, {
                            [Object.keys(images).length]: singleImg,
                        });

                        log("images", images);
                        const answerTextElements =
                            document.querySelectorAll(".answer-text");
                        choices = Array.from(answerTextElements).map(
                            (el) => el.outerText
                        );
                    } else if (isBbox()) {
                        // if Bbox
                        const canvasImg = await sliceOG();
                        if (!canvasImg) return;
                        log("canvasImg", canvasImg);
                        Object.assign(images, {
                            [Object.keys(images).length]: canvasImg,
                        });

                        log("images", images);
                    }

                    clearInterval(check_interval);
                    return resolve({
                        target: targetText,
                        cells,
                        images,
                        example,
                        choices,
                    });
                }, i);
            });
        }

        // end
    })();

    const jsNotif = (m, d) => {
        const t = document.createElement("div");
        (t.style.cssText =
            "position:fixed;top:10%;left:0;background-color:rgba(0,0,0,.8);border-radius:4px;padding:16px;color:#fff;font:calc(14px + .5vw) 'Arial',sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;z-index:9999;transition:all 1s;animation:slideIn 1s forwards"),
            (t.innerHTML = m),
            document.body.appendChild(t);
        const o = document.createElement("style");
        (o.innerHTML =
            "@keyframes slideIn{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}@keyframes slideOut{0%{transform:translateX(0)}100%{transform:translateX(100%)}}"),
            document.head.appendChild(o);
        setTimeout(() => {
            (t.style.animation = "slideOut 1s forwards"),
                setTimeout(() => {
                    document.body.removeChild(t);
                }, 1e3);
        }, d || 3e3);
    };
})();
