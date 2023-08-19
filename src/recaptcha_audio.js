// (async () => {
//   let settings = await chrome.storage.sync.get(null);

//   if (
//     !settings.apikey ||
//     !settings.power ||
//     !settings.reCap ||
//     settings.RsolveType !== "audio"
//   )
//     return;

//   class Time {
//     static now() {
//       return Date.now();
//     }

//     static currentDate() {
//       return new Date();
//     }

//     static sleep(ms) {
//       return new Promise((resolve) => setTimeout(resolve, ms));
//     }

//     static async randomSleep(min, max) {
//       const duration = Math.floor(Math.random() * (max - min) + min);
//       return await Time.sleep(duration);
//     }
//   }

//   function fireMouseEvents(element) {
//     if (!document.contains(element)) {
//       return;
//     }

//     for (const eventName of ["mouseover", "mousedown", "mouseup", "click"]) {
//       const eventObject = document.createEvent("MouseEvents"); //todo update
//       eventObject.initEvent(eventName, true, false);
//       element.dispatchEvent(eventObject);
//     }
//   }
//   async function getSTT(audioapi, apikey, audiourl) {
//     const apiUrl = audioapi,
//       api_key = apikey;
//     const response = await fetch(audiourl),
//       arrayBuffer = await response.arrayBuffer();
//     const mp3Blob = new Blob([arrayBuffer], { type: "audio/mp3" });
//     const formData = new FormData();
//     formData.append("audio", mp3Blob, "audio.mp3");
//     formData.append("method", "rcaudio");
//     const res = await fetch(apiUrl, {
//       method: "POST",
//       headers: { apikey: api_key },
//       body: formData,
//     });

//     const data = await res.json();
//     if (res.ok) {
//       return [data.solution, data.id];
//     } else {
//       return res.message;
//     }
//   };
//   function isSpeechFrame() {
//     return (
//       document.querySelector("#audio-instructions") !== null ||
//       document.querySelector(".rc-doscaptcha-header") !== null
//     );
//   }

//   function openImageFrame() {
//     fireMouseEvents(document.querySelector("#recaptcha-anchor"));
//   }
//   const isRecaptchaVisible = () => {
//     return document.querySelector(".recaptcha-checkbox") !== null;
//   };

//   function isWidgetFrame() {
//     return document.querySelector(".recaptcha-checkbox") !== null;
//   }

//   function isImageFrame() {
//     return document.querySelector(".rc-imageselect-instructions") !== null;
//   }

//   function isSolved() {
//     if (hasSolveError()) {
//       return false;
//     }
//     const isWidgetFrameSolved =
//       document
//         .querySelector(".recaptcha-checkbox")
//         ?.getAttribute("aria-checked") === "true";
//     const isImageFrameSolved = document.querySelector(
//       "#recaptcha-verify-button"
//     )?.disabled;
//     return isWidgetFrameSolved || isImageFrameSolved;
//   }

//   async function submitAnswer(id) {
//     fireMouseEvents(document.querySelector("#recaptcha-verify-button"));
//   }

//   function isSolved() {
//     const is_widget_frame_solved =
//       document
//         .querySelector(".recaptcha-checkbox")
//         ?.getAttribute("aria-checked") === "true";
//     const is_image_frame_solved = document.querySelector(
//       "#recaptcha-verify-button"
//     )?.disabled;
//     return is_widget_frame_solved || is_image_frame_solved;
//   }

//   function hasSolveError() {
//     return (
//       document.querySelector(".rc-doscaptcha-header")?.innerText ===
//       "Try again later"
//     );
//   }

//   async function handleWidgetFrame() {
//     if (!isRecaptchaVisible()) {
//       return;
//     }

//     if (isSolved()) {
//       return;
//     }
//     await Time.sleep(500);
//     if (settings.RautoOpen) openImageFrame();
//   }

//   async function handleImageFrame() {
//     // if (is_visible() !== true) {
//     //   return;
//     // }

//     if (isSolved()) {
//       return;
//     }
//     await Time.sleep(500);
//     fireMouseEvents(document.querySelector("#recaptcha-audio-button"));
//   }

//   async function handleSpeechFrame() {
//     if (settings.RautoSolve === false) return;

//     // if (is_visible() !== true) {
//     //   return;
//     // }

//     if (isSolved()) {
//       return;
//     }

//     if (hasSolveError()) {
//       return;
//     }

//     const downloadUrl =
//       document.querySelector(".rc-audiochallenge-tdownload-link")?.href ||
//       document.querySelector("#audio-source")?.src;

//     let lang = document.querySelector("html")?.getAttribute("lang")?.trim();
//     if (!lang || lang.length === 0) {
//       lang = "en";
//     }

//     const solveStart = Time.now();

//     const audioapi = "https://audio.nocaptchaai.com/solve";
//     const [txt, id] = await getSTT(audioapi, settings.apikey, downloadUrl);
//     if (!txt) return;

//     if (txt) {
//       console.log(txt);
//     } else {
//       console.log(txt);
//     }

//     document.querySelector("#audio-response").value = txt;

//     let delay = parseInt(1000);
//     delay = delay ? delay : 1000;
//     const delta = 1000 ? delay - (Time.now() - solveStart) : 0;
//     if (delta > 0) {
//       await Time.sleep(delta);
//     }

//     await submitAnswer(id);
//   }

//   async function checkImageFrameVisibility() {
//     const imageFrames = [
//       ...document.querySelectorAll('iframe[src*="/recaptcha/api2/bframe"]'),
//       ...document.querySelectorAll(
//         'iframe[src*="/recaptcha/enterprise/bframe"]'
//       ),
//     ];

//     return imageFrames.some(
//       (frame) => window.getComputedStyle(frame).visibility === "visible"
//     );
//   }

//   async function checkWidgetFrameVisibility() {
//     const widgetFrames = [
//       ...document.querySelectorAll('iframe[src*="/recaptcha/api2/anchor"]'),
//       ...document.querySelectorAll(
//         'iframe[src*="/recaptcha/enterprise/anchor"]'
//       ),
//     ];

//     return widgetFrames.some(
//       (frame) => window.getComputedStyle(frame).visibility === "visible"
//     );
//   }

//   while (true) {
//     await Time.sleep(1000);

//     if (isSolved()) {
//       console.log("solved");
//       break;
//     }

//     await checkImageFrameVisibility();
//     await checkWidgetFrameVisibility();

//     if (isWidgetFrame()) {
//       await handleWidgetFrame();
//     } else if (isImageFrame()) {
//       await handleImageFrame();
//     } else if (isSpeechFrame()) {
//       await handleSpeechFrame();
//     }
//   }
// })();

// console.log("recap image");

(async () => {
  const settings = await chrome.storage.sync.get(null);
  let logs = settings.logsEnabled === "true" ? true : false;
  function log(...args) {
    if (logs) {
      console.log(...args);
    }
  }

  class TimeUtil {
    static now() {
      return Date.now();
    }
    static currentDate() {
      return new Date();
    }
    static sleep(t) {
      return new Promise((e) => setTimeout(e, t));
    }

    static async randomSleep(t, e) {
      const n = Math.floor(Math.random() * (e - t) + t);
      return await Time.sleep(n);
    }
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fireMouseEvents(element) {
    if (!document.contains(element)) {
      return;
    }
    const events = ["mouseover", "mousedown", "mouseup", "click"];
    for (const eventName of events) {
      const eventObject = document.createEvent("MouseEvents");
      eventObject.initEvent(eventName, true, false);
      element.dispatchEvent(eventObject);
    }
  }

  async function getAudioResponse(audioapi, apikey, audiourl) {
    const response = await fetch(audiourl);
    const arrayBuffer = await response.arrayBuffer();
    const mp3Blob = new Blob([arrayBuffer], { type: "audio/mp3" });

    return await sendAudio(audioapi, apikey, mp3Blob);
  }

  async function sendAudio(audioapi, apikey, mp3Blob) {
    const formData = new FormData();
    formData.append("audio", mp3Blob, "audio.mp3");
    formData.append("method", "rcaudio");

    const res = await fetch(audioapi, {
      method: "POST",
      headers: { apikey: apikey },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      return [data.solution, data.id];
    } else {
      return res.message;
    }
  }
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
  const isRecaptchaVisible = () =>
    document.querySelector(".recaptcha-checkbox") !== null;
  const isWidgetFrame = isRecaptchaVisible;

  const isImageFrame = () =>
    document.querySelector(".rc-imageselect-instructions") !== null;

  const isSpeechFrame = () =>
    document.querySelector("#audio-instructions") !== null ||
    document.querySelector(".rc-doscaptcha-header") !== null;

  const isSolved = () => {
    const isWidgetFrameSolved =
      document
        .querySelector(".recaptcha-checkbox")
        ?.getAttribute("aria-checked") === "true";
    const isImageFrameSolved = document.querySelector(
      "#recaptcha-verify-button"
    )?.disabled;
    return isWidgetFrameSolved || isImageFrameSolved;
  };

  const hasSolveError = () =>
    document.querySelector(".rc-doscaptcha-header")?.innerText ===
    "Try again later";

  async function handleWidgetFrame() {
    if (!isRecaptchaVisible() || isSolved()) return;

    await sleep(500);
    if (settings.reCaptchaAutoOpen)
      fireMouseEvents(document.querySelector("#recaptcha-anchor"));
  }

  async function handleImageFrame() {
    if (isSolved()) return;

    await sleep(500);
    fireMouseEvents(document.querySelector("#recaptcha-audio-button"));
  }

  async function handleSpeechFrame() {
    if (settings.reCaptchaAutoSolve === false || isSolved() || hasSolveError())
      return;

    const downloadUrl =
      document.querySelector(".rc-audiochallenge-tdownload-link")?.href ||
      document.querySelector("#audio-source")?.src;

    let language =
      document.querySelector("html")?.getAttribute("lang")?.trim() || "en";

    const solveStart = TimeUtil.now();
    const audioapi = "https://audio.nocaptchaai.com/solve";
    const [text, id] = await getAudioResponse(
      audioapi,
      settings.APIKEY,
      downloadUrl
    );

    if (!text) return;

    document.querySelector("#audio-response").value = text;

    await sleep(settings.reCaptchaSubmitDelay * 1000);

    fireMouseEvents(document.querySelector("#recaptcha-verify-button"));
  }

  async function checkFrameVisibility(selector) {
    const frames = [
      ...document.querySelectorAll(
        `iframe[src*="/recaptcha/api2/${selector}"]`
      ),
      ...document.querySelectorAll(
        `iframe[src*="/recaptcha/enterprise/${selector}"]`
      ),
    ];

    return frames.some(
      (frame) => window.getComputedStyle(frame).visibility === "visible"
    );
  }

  while (
    settings.extensionEnabled == "true" &&
    settings.reCaptchaEnabled == "true" &&
    settings.reCaptchaSolveType == "audio" &&
    settings.PLANTYPE &&
    settings.APIKEY
  ) {
    await sleep(1000);
    await checkFrameVisibility("bframe");
    await checkFrameVisibility("anchor");

    if (document.querySelector(".rc-doscaptcha-header-text") !== null) {
      jsNotif("Rate Limited, change ip or try later", 15000);
      break;
    }

    if (isWidgetFrame() && settings.reCaptchaAutoOpen == "true") {
      await handleWidgetFrame();
    } else if (isImageFrame() && settings.reCaptchaAutoSolve == "true") {
      await handleImageFrame();
    } else if (isSpeechFrame()) {
      await handleSpeechFrame();
    }
  }
})();
