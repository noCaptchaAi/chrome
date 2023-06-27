// (async () => {

//     console.log("ProBot loaded");
//     const settings = await chrome.storage.sync.get(null);


//     window.addEventListener("urlchange", function (event) {
//         if (isChannel(event.url)) {
//             init("urlchange");
//         }
//     });

//     if (isChannel(location.pathname)) {
//         const timer = setInterval(function () {
//             const element = document.querySelector("ol[data-list-id=chat-messages]");
//             if (!document.contains(element)) {
//                 return;
//             }
//             init("main");
//             clearInterval(timer);
//         }, 500);
//     }

//     function init(value) {
//         const css =
//             "text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue; font-size: 40px;";
//         console.log("%c" + value, css);
//         const observer = new MutationObserver(async function (mutations, observer) {
//             // for (const mutation of mutations) {}
//             // for (const node of mutation.addedNodes) {}
//             const mutation = mutations.at(-1);
//             if (mutation.addedNodes.length === 0) {
//                 return;
//             }
//             const node = [...mutation.addedNodes].at(-1);
//             if (!node.innerHTML.includes("ProBot")) {
//                 return;
//             }
//             const image = document.querySelector('a[href*="captcha.png"]');
//             if (image) {
//                 request(await getBase64FromUrl(image.href));
//             }
//         });
//         observer.observe(document.querySelector("ol[data-list-id=chat-messages]"), {
//             childList: true,
//         });
//     }

//     function request(image) {
//         const xhr = new XMLHttpRequest();

//         xhr.open("POST", getApi("solve"), true);
//         xhr.setRequestHeader("Content-Type", "application/json");
//         xhr.setRequestHeader("apikey", settings.APIKEY);
//         xhr.responseType = "json";

//         xhr.onload = function () {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 const data = xhr.response;
//                 const token = getToken();
//                 const channelId = location.href.split("/").pop();

//                 const messageXhr = new XMLHttpRequest();
//                 messageXhr.open("POST", `https://discord.com/api/v9/channels/${channelId}/messages`, true);
//                 messageXhr.setRequestHeader("Content-Type", "application/json");
//                 messageXhr.setRequestHeader("authorization", token);
//                 messageXhr.send(JSON.stringify({
//                     content: data.solution,
//                 }));
//             } else {
//                 console.log('Request failed.  Returned status of ', xhr.status);
//             }
//         };

//         xhr.send(JSON.stringify({
//             method: "ocr",
//             image,
//             softid: "PBot_userjs",
//         }));
//     }


//     function isChannel(path) {
//         return /\/channels\/\d+\/\d+/.test(path);
//     }

//     const sleeep = (ms) => new Promise((r) => setTimeout(r, ms));


// function getToken() {
//     return (webpackChunkdiscord_app.push([
//         [""],
//         {},
//         (e) => {
//             m = [];
//             for (let c in e.c) m.push(e.c[c]);
//         },
//     ]),
//         m)
//         .find((m) => m?.exports?.default?.getToken !== void 0)
//         .exports.default.getToken();
// }
// function getApi(v) {
//     return "https://" + settings.PLANTYPE + ".nocaptchaai.com/" + v;
// }

//     async function getBase64FromUrl(url) {
//         const blob = await (await fetch(url)).blob();
//         return new Promise(function (resolve, reject) {
//             const reader = new FileReader();
//             reader.readAsDataURL(blob);
//             reader.addEventListener("loadend", function () {
//                 resolve(reader.result.replace(/^data:image\/(png|jpeg);base64,/, ""));
//             });
//             reader.addEventListener("error", function () {
//                 reject("❌ Failed to convert url to base64");
//             });
//         });
//     }
// })()




//==================================================================================

// (async () => {
//     const LOG_PREFIX = "ProBot";
//     const CHANNEL_ID_REGEX = /\/channels\/\d+\/\d+/;
//     const CHAT_MESSAGES_SELECTOR = "ol[data-list-id=chat-messages]";
//     const CAPTCHA_IMAGE_SELECTOR = 'a[href*="captcha.png"]';

//     console.log(`${LOG_PREFIX} loaded`);
//     const settings = await chrome.storage.sync.get(null);

//     window.addEventListener("urlchange", event => {
//         if (isChannel(event.url)) {
//             setupObserver("urlchange");
//         }
//     });

//     if (isChannel(location.pathname)) {
//         const timerId = setInterval(() => {
//             const chatMessagesElement = document.querySelector(CHAT_MESSAGES_SELECTOR);
//             if (!chatMessagesElement) {
//                 return;
//             }

//             setupObserver("main");
//             clearInterval(timerId);
//         }, 500);
//     }

//     function setupObserver(eventName) {
//         console.log(`%c${eventName}`, "text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue; font-size: 40px;");

//         new MutationObserver(async mutations => {
//             const mutation = mutations[mutations.length - 1];
//             if (!mutation.addedNodes.length) {
//                 return;
//             }

//             const lastAddedNode = mutation.addedNodes[mutation.addedNodes.length - 1];
//             if (!lastAddedNode.innerHTML.includes(LOG_PREFIX)) {
//                 return;
//             }

//             const captchaImageElement = document.querySelector(CAPTCHA_IMAGE_SELECTOR);
//             if (captchaImageElement) {
//                 const base64Image = await getBase64FromUrl(captchaImageElement.href);
//                 request(base64Image);
//             }
//         }).observe(document.querySelector(CHAT_MESSAGES_SELECTOR), { childList: true });
//     }

//     function request(image) {
//         const xhr = new XMLHttpRequest();
//         xhr.open("POST", getApiUrl("solve"), true);
//         xhr.setRequestHeader("Content-Type", "application/json");
//         xhr.setRequestHeader("apikey", settings.APIKEY);
//         xhr.responseType = "json";

//         xhr.onload = () => {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 sendSolution(xhr.response);
//             } else {
//                 console.log('Request failed. Returned status of', xhr.status);
//             }
//         };

//         xhr.send(JSON.stringify({ method: "ocr", image, softid: "PBot_userjs" }));
//     }

//     function sendSolution(data) {
//         const token = getToken();
//         const channelId = location.href.split("/").pop();

//         const messageXhr = new XMLHttpRequest();
//         messageXhr.open("POST", `https://discord.com/api/v9/channels/${channelId}/messages`, true);
//         messageXhr.setRequestHeader("Content-Type", "application/json");
//         messageXhr.setRequestHeader("authorization", token);
//         messageXhr.send(JSON.stringify({ content: data.solution }));
//     }

//     function isChannel(path) {
//         return CHANNEL_ID_REGEX.test(path);
//     }

//     // function getToken() {
//     //     const pageGlobalObject = window.wrappedJSObject;
//     //     console.log(pageGlobalObject?.webpackChunkdiscord_app, "global object");
//     //     return pageGlobalObject?.webpackChunkdiscord_app?.find((m) => m?.exports?.default?.getToken !== void 0)?.exports?.default?.getToken();
//     // }

//     chrome.runtime.sendMessage({ action: "getToken" }).then((response) => {
//         const token = response;
//         // Use the token as needed
//         console.log(token);
//     }).catch((error) => {
//         // Handle any errors that occur while getting the token
//         console.error(error);
//     });


//     // function getToken() {
//     //     const pageGlobalObject = window.wrappedJSObject;
//     //     console.log(pageGlobalObject?.webpackChunkdiscord_app, "global object");
//     //     return (pageGlobalObject?.webpackChunkdiscord_app.push([
//     //         [""],
//     //         {},
//     //         (e) => {
//     //             m = [];
//     //             for (let c in e.c) m.push(e.c[c]);
//     //         },
//     //     ]),
//     //         m)
//     //         .find((m) => m?.exports?.default?.getToken !== void 0)
//     //         .exports.default.getToken();
//     // }

//     function getApi(v) {
//         return "https://" + settings.PLANTYPE + ".nocaptchaai.com/" + v;
//     }

//     function getApiUrl(path) {
//         return `https://${settings.PLANTYPE}.nocaptchaai.com/${path}`;
//     }

//     async function getBase64FromUrl(url) {
//         const blob = await (await fetch(url)).blob();
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(blob);
//             reader.onloadend = () => resolve(reader.result.replace(/^data:image\/(png|jpeg);base64,/, ""));
//             reader.onerror = () => reject("❌ Failed to convert url to base64");
//         });
//     }
// })();



///

// function getToken() {
//     // Inject a script to grab the token
//     var injectedScript = function () {
//         function getTheToken() {
//             return (webpackChunkdiscord_app.push([
//                 [""],
//                 {},
//                 (e) => {
//                     m = [];
//                     for (let c in e.c) m.push(e.c[c]);
//                 },
//             ]),
//                 m)
//                 .find((m) => m?.exports?.default?.getToken !== void 0)
//                 .exports.default.getToken();
//         }

//         // Send the token to the extension
//         window.postMessage({
//             type: 'FROM_PAGE',
//             token: getTheToken()
//         }, "*");
//     };

//     var script = document.createElement('script');
//     script.textContent = '(' + injectedScript.toString() + ')()';
//     (document.head || document.documentElement).appendChild(script);
//     script.remove();

//     // Listen for the token
//     let token = null;
//     window.addEventListener('message', function (event) {
//         if (event.data.type && event.data.type === 'FROM_PAGE') {
//             token = event.data.token;
//         }
//     });

//     return token;
// }


// 


// const LOG_PREFIX = "ProBot";
// const CHANNEL_ID_REGEX = /\/channels\/\d+\/\d+/;
// const CHAT_MESSAGES_SELECTOR = "ol[data-list-id=chat-messages]";
// const CAPTCHA_IMAGE_SELECTOR = 'a[href*="captcha.png"]';
// const TOKEN = localStorage.getItem('token');
// const settings = await chrome.storge.sync.get(null);
// console.log(`${LOG_PREFIX} loaded`);

// window.addEventListener("urlchange", event => {
//     if (isChannel(event.url)) {
//         setupObserver("urlchange");
//     }
// });

// if (isChannel(location.pathname)) {
//     const timerId = setInterval(function () {
//         const chatMessagesElement = document.querySelector(CHAT_MESSAGES_SELECTOR);
//         if (!document.contains(chatMessagesElement)) {
//             return;
//         }
//         setupObserver('main');
//         clearInterval(timerId);
//     }, 500);
// }

// function setupObserver(eventName) {
//     console.log(`%c${eventName}`, "text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue; font-size: 40px;");

//     const observer = new MutationObserver(async function (mutations, observer) {
//         const mutation = mutations.pop();
//         if (mutation.addedNodes.length === 0) {
//             return;
//         }

//         const lastAddedNode = [...mutation.addedNodes].pop();
//         if (!lastAddedNode.innerHTML.includes(LOG_PREFIX)) {
//             return;
//         }

//         const captchaImageElement = document.querySelector(CAPTCHA_IMAGE_SELECTOR);
//         if (document.contains(captchaImageElement)) {
//             const base64Image = await getBase64FromUrl(captchaImageElement.href);
//             request(base64Image);
//         }
//     });
//     observer.observe(document.querySelector(CHAT_MESSAGES_SELECTOR), { childList: true });
// }

// function sendSolution(data) {
//     const channelId = location.href.split("/").pop();

//     const messageXhr = new XMLHttpRequest();
//     messageXhr.open("POST", `https://discord.com/api/v9/channels/${channelId}/messages`, true);
//     messageXhr.setRequestHeader("Content-Type", "application/json");
//     messageXhr.setRequestHeader("authorization", TOKEN);
//     messageXhr.send(JSON.stringify({ content: data.solution }));
// }

// function isChannel(path) {
//     return CHANNEL_ID_REGEX.test(path);
// }

// async function request(image) {
//     return await fetch(getApiUrl("solve"), {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "apikey": settings.APIKEY
//         },
//         body: JSON.stringify({
//             method: "ocr",
//             image,
//             softid: "PBot_userjs"
//         })
//     })
//         .then(response => response.json())
//         .then(sendSolution)
//         .catch(function () {
//             console.log('Request failed. Returned status of ', xhr.status)
//         })

// }

// function getApiUrl(path) {
//     return `https://${settings.PLANTYPE}.nocaptchaai.com/${path}`;
// }

// async function getBase64FromUrl(url) {
//     const blob = await (await fetch(url)).blob();
//     return new Promise(function (resolve, reject) {
//         const reader = new FileReader();
//         reader.readAsDataURL(blob);
//         reader.addEventListener("loadend", function () {
//             resolve(reader.result.replace(/^data:image\/(png|jpeg);base64,/, ""));
//         });
//         reader.addEventListener("error", function () {
//             reject("❌ Failed to convert url to base64");
//         });
//     });
// }


(async function (storage) {
    const LOG_PREFIX = "ProBot";
    const CHANNEL_ID_REGEX = /\/channels\/\d+\/\d+/;
    const CHAT_MESSAGES_SELECTOR = "ol[data-list-id=chat-messages]";
    const CAPTCHA_IMAGE_SELECTOR = 'a[href*="captcha.png"]';
    const TOKEN = localStorage.getItem('token');

    console.log("token", TOKEN);
    const settings = await storage.get(null);
    console.log(`${LOG_PREFIX} loaded`);

    window.addEventListener("urlchange", event => {
        if (isChannel(event.url)) {
            setupObserver("urlchange");
        }
    });

    if (isChannel(location.pathname)) {
        const timerId = setInterval(function () {
            const chatMessagesElement = document.querySelector(CHAT_MESSAGES_SELECTOR);
            if (!document.contains(chatMessagesElement)) {
                return;
            }
            setupObserver('main');
            clearInterval(timerId);
        }, 500);
    }

    function setupObserver(eventName) {
        console.log(`%c${eventName}`, "text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue; font-size: 40px;");

        const observer = new MutationObserver(async function (mutations, observer) {
            const mutation = mutations.pop();
            if (mutation.addedNodes.length === 0) {
                return;
            }

            const lastAddedNode = [...mutation.addedNodes].pop();
            if (!lastAddedNode.innerHTML.includes(LOG_PREFIX)) {
                return;
            }

            const captchaImageElement = document.querySelector(CAPTCHA_IMAGE_SELECTOR);
            if (document.contains(captchaImageElement)) {
                const base64Image = await getBase64FromUrl(captchaImageElement.href);
                request(base64Image);
            }
        });
        observer.observe(document.querySelector(CHAT_MESSAGES_SELECTOR), { childList: true });
    }

    function sendSolution(data) {
        const channelId = location.href.split("/").pop();

        const messageXhr = new XMLHttpRequest();
        messageXhr.open("POST", `https://discord.com/api/v9/channels/${channelId}/messages`, true);
        messageXhr.setRequestHeader("Content-Type", "application/json");
        messageXhr.setRequestHeader("authorization", TOKEN);
        messageXhr.send(JSON.stringify({ content: data.solution }));
    }

    function isChannel(path) {
        return CHANNEL_ID_REGEX.test(path);
    }

    async function request(image) {
        return await fetch(getApiUrl("solve"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": settings.APIKEY
            },
            body: JSON.stringify({
                method: "ocr",
                image,
                softid: "PBot_userjs"
            })
        })
            .then(response => response.json())
            .then(sendSolution)
            .catch(function () {
                console.log('Request failed. Returned status of ', xhr.status)
            })

    }

    function getApiUrl(path) {
        return `https://${settings.PLANTYPE}.nocaptchaai.com/${path}`;
    }

    async function getBase64FromUrl(url) {
        const blob = await (await fetch(url)).blob();
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.addEventListener("loadend", function () {
                resolve(reader.result.replace(/^data:image\/(png|jpeg);base64,/, ""));
            });
            reader.addEventListener("error", function () {
                reject("❌ Failed to convert url to base64");
            });
        });
    }
})(chrome.storage.sync);