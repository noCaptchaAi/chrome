(async () => {
  // console.log('OCR.js loaded');
  let settings = await chrome.storage.sync.get(null);

  if (settings.extensionEnabled != "true") return;
  if (settings.ocrEnabled != "true") return;
  let logs = settings.logsEnabled === "true" ? true : false;
  function log(arg) {
    if (logs) {
      console.log(arg);
    }
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if (settings.domainData == undefined) {
    log("domainData not found");
    settings.domainData = {};
  }

  function jsNotif(m, d) {
    if (settings.ocrToastEnabled == "false") return;
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
  }
  async function isIMGANS(imgEle, ansEle) {
    return (
      document.querySelector(imgEle) != null &&
      document.querySelector(ansEle) != null
    );
  }

  let img;
  let ans;
  let ocrid;

  try {
    const hostname = window.location.hostname;
    img = settings.domainData[hostname]?.image;
    ans = settings.domainData[hostname]?.answer;
    ocrid = settings.domainData[hostname]?.ocrid;
    // log(img, ans);
  } catch (error) {
    log("OCR data not found");
  }

  let isSolved = false;
  let breakLoop = false;

  while (breakLoop == false) {
    await sleep(1000);
    if (settings.APIKEY == undefined || isSolved) return;

    const i = document.querySelector(img);
    const a = document.querySelector(ans);

    if (i != null && a != null && (await isIMGANS(img, ans))) {
      // log('domainData found');
      log("image:", i, "answer", a);
      // log(settings.domainData);
      await getAnswer(i.src, ans).then(async (solution) => {
        if (!solution) {
          breakLoop = true;
          jsNotif("solution error, check console", 2000);
        }
        log(solution);
        await solveCaptcha(solution);
      });
    }
  }

  async function getAnswer(img, ans) {
    // log('fetch');
    try {
      // log(img, ans);
      const base64Image = await toBase64Image(img);
      log(await base64Image);

      // const mtcapPlaceholderImage = (await base64Image).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // const regexPattern = new RegExp(`^${mtcapPlaceholderImage}$`);

      // if (regexPattern.test(await base64Image)) {
      //   log("mt cap placeholder image detected");
      //   return;
      // }
      let req = await fetch(
        `https://${settings.PLANTYPE}.nocaptchaai.com/solve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: settings.APIKEY,
          },
          body: JSON.stringify({
            method: "ocr",
            id: ocrid,
            image: base64Image,
          }),
        }
      );

      if (req.status == 404 || !req.ok) {
        const h = await req.json();
        jsNotif(`✘ Error:- ${h.message}`, 10000);
        throw new Error("✘ Error: " + h.message);
      }
      res = await req.json();
      log(res, "res");
      // jsNotif(res.solution, 4000);
      return res.solution;
    } catch (error) {
      jsNotif("error send task, check console");
      log(error);
    }
  }

  async function solveCaptcha(solution) {
    if (solution) {
      try {
        log(ans);
        clickElement(document.querySelector(ans));
        await simulateTyping(document.querySelector(ans), solution);

        // document.querySelector(ans).value = res.solution;
        isSolved = true;
        log("answer typed" + solution);
        jsNotif(`answer typed:- ${solution}`, 2000);
      } catch (error) {
        jsNotif("error typing answer, check console");
        log(error);
      }
    }
  }

  async function toBase64Image(url) {
    // Regex to test for data URLs and to extract the image format
    const dataUrlRegex = /^data:image\/([a-zA-Z+]+);base64,/;
    const match = dataUrlRegex.exec(url);

    // If it's a data URL, check the image type and convert if necessary.
    if (match) {
      const imgType = match[1];
      if (imgType !== "jpeg" && imgType !== "png") {
        const img = new Image();
        img.src = url;
        log(img, "img");
        await new Promise((resolve) => (img.onload = resolve));
        return convertImageToBase64(img, "image/png");
      }
      // remove the data URL prefix
      return url.replace(dataUrlRegex, "");
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const contentType = response.headers.get("content-type");
      const isJpgOrPng =
        contentType === "image/jpeg" || contentType === "image/png";

      if (!isJpgOrPng) {
        const img = new Image();
        const imgLoaded = new Promise((resolve) => {
          img.onload = resolve;
        });
        img.src = URL.createObjectURL(blob);
        await imgLoaded;

        URL.revokeObjectURL(img.src); // Clean up
        return convertImageToBase64(img, "image/png");
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // remove the data URL prefix
          let base64Image = reader.result.replace(dataUrlRegex, "");
          log(base64Image, "base64Image");
          resolve(base64Image);
        };
        reader.onerror = () => {
          reject(new Error("Failed to read the blob as data URL."));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        jsNotif("✘ IP timeout, wait 5 minutes and try again", 5000, false);
        throw new Error("✘ IP timeout, wait 5 minutes and try again");
      } else {
        jsNotif(`✘${error}`, 5000, false);
      }
      throw error;
    }
  }

  // Helper function to convert an Image object to a base64 string
  function convertImageToBase64(img, outputFormat) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    // Clear the canvas with a white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0);
    // return the base64 string without the data URL prefix
    log(
      canvas
        .toDataURL(outputFormat)
        .replace(/^data:image\/(png|jpeg);base64,/, "")
    );
    return canvas
      .toDataURL(outputFormat)
      .replace(/^data:image\/(png|jpeg);base64,/, "");
  }

  // async function toBase64Image(url) {
  //   // If it looks like a base64 string, check the image type and convert if necessary.
  //   if (/^data:image\/[a-zA-Z+]+;base64,/.test(url)) {
  //     const typeMatch = url.match(/\/(.*?)\;/);
  //     if (typeMatch && typeMatch.length >= 2) {
  //       const imgType = typeMatch[1];
  //       if (imgType !== 'jpeg' && imgType !== 'png') {
  //         const img = new Image();
  //         img.src = url;
  //         await new Promise(resolve => img.onload = resolve);
  //         return convertImageToBase64(img, 'image/png');
  //       }
  //     }
  //     return url;
  //   }

  //   try {
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  //     const contentType = response.headers.get('content-type');
  //     const isJpgOrPng = contentType === 'image/jpeg' || contentType === 'image/png';

  //     if (!isJpgOrPng) {
  //       const img = new Image();
  //       const imgLoaded = new Promise((resolve) => {
  //         img.onload = resolve;
  //       });
  //       img.src = URL.createObjectURL(blob);
  //       await imgLoaded;

  //       URL.revokeObjectURL(img.src); // Clean up
  //       return convertImageToBase64(img, 'image/png');
  //     }

  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         let base64Image = reader.result.replace(/^data:image\/.*;base64,/, '');
  //         resolve(base64Image);
  //       };
  //       reader.onerror = () => {
  //         reject(new Error('Failed to read the blob as data URL.'));
  //       };
  //       reader.readAsDataURL(blob);
  //     });
  //   } catch (error) {
  //     jsNotif("Failed to fetch the image.", 3000);
  //     console.error('Failed to fetch the image.', error);
  //     throw error;
  //   }
  // }

  // // Helper function to convert an Image object to a base64 string
  // function convertImageToBase64(img, outputFormat) {
  //   const canvas = document.createElement('canvas');
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   const ctx = canvas.getContext('2d');

  //   // Clear the canvas with a white background
  //   ctx.fillStyle = '#FFFFFF';
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);

  //   ctx.drawImage(img, 0, 0);
  //   return canvas.toDataURL(outputFormat);
  // }

  // async function toBase64Image(url) {
  //   // If it looks like a base64 string, return it as is.
  //   if (/^[A-Za-z0-9+/=,\s]*$/.test(url)) {
  //     return url;
  //   }

  //   try {
  //     const response = await fetch(url);
  //     const blob = await response.blob();

  //     // Determine the MIME type of the image
  //     const contentType = response.headers.get('content-type');
  //     const isJpgOrPng = contentType === 'image/jpeg' || contentType === 'image/png';

  //     if (!isJpgOrPng) {
  //       const img = new Image();
  //       const imgLoaded = new Promise((resolve) => {
  //         img.onload = resolve;
  //       });
  //       img.src = URL.createObjectURL(blob);
  //       await imgLoaded;

  //       const canvas = document.createElement('canvas');
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       const ctx = canvas.getContext('2d');

  //       // Clear the canvas with a white background
  //       ctx.fillStyle = '#FFFFFF';
  //       ctx.fillRect(0, 0, canvas.width, canvas.height);

  //       ctx.drawImage(img, 0, 0);
  //       URL.revokeObjectURL(img.src); // Clean up

  //       return canvas.toDataURL('image/jpeg');
  //     }

  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         let base64Image = reader.result.replace(/^data:image\/.*;base64,/, '');
  //         resolve(base64Image);
  //       };
  //       reader.onerror = () => {
  //         reject(new Error('Failed to read the blob as data URL.'));
  //       };
  //       reader.readAsDataURL(blob);
  //     });
  //   } catch (error) {
  //     console.error('Failed to fetch the image.', error);
  //     throw error;
  //   }
  // }

  // async function getImageAsBase64(imgUrl) {
  //   try {
  //     // Try to get the image from the URL
  //     return await toBase64Image(imgUrl);
  //   } catch (error) {
  //     jsNotif("Failed to get image from URL", 3000);
  //     log('Failed to get image from URL:', error);

  //     // If that fails, find the first image with the specified URL and capture a screenshot of it
  //     const images = Array.from(document.getElementsByTagName('img'));
  //     const targetImage = images.find(image => image.src === imgUrl);
  //     if (targetImage) {
  //       const rect = targetImage.getBoundingClientRect();
  //       const screenshotUrl = await chrome.runtime.sendMessage({
  //         rect: {
  //           top: Math.round(rect.top),
  //           left: Math.round(rect.left),
  //           width: Math.round(rect.width),
  //           height: Math.round(rect.height)
  //         }
  //       });
  //       // Convert the screenshot URL to base64 without the Data URL prefix
  //       return screenshotUrl.replace(/^data:image\/(png|jpeg);base64,/, '');
  //     } else {
  //       jsNotif('Failed to find image, check css selector', 3000);
  //       log('Failed to find image, check css selector');
  //       // throw new Error('Could not retrieve image');
  //     }
  //   }
  // }

  async function simulateTyping(input, value) {
    function fireEvent(element, eventConstructor, eventOptions) {
      const event = new eventConstructor(eventOptions);
      element.dispatchEvent(event);
    }

    function fireMouseEvents(element) {
      ["mouseover", "mousedown", "mouseup", "click"].forEach((eventName) => {
        fireEvent(element, MouseEvent, {
          bubbles: true,
          cancelable: true,
          view: window,
          type: eventName,
        });
      });
    }

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    fireMouseEvents(input);

    fireEvent(input, FocusEvent, {
      bubbles: true,
      cancelable: true,
      type: "focus",
    });

    const keydownEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      view: window,
      key: value,
      code: `Digit${value}`,
      location: 0,
    });

    const keypressEvent = new KeyboardEvent("keypress", {
      bubbles: true,
      cancelable: true,
      view: window,
      key: value,
      code: `Digit${value}`,
      location: 0,
    });

    const keyupEvent = new KeyboardEvent("keyup", {
      bubbles: true,
      cancelable: true,
      view: window,
      key: value,
      code: `Digit${value}`,
      location: 0,
    });

    input.dispatchEvent(keydownEvent);
    await sleep(Math.random() * 100 + 50); // Add a random delay to simulate typing

    try {
      input.dispatchEvent(keypressEvent);
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    } catch (error) {
      jsNotif("could not set answer. Check your css selector");
    }

    await sleep(Math.random() * 100 + 50); // Add a random delay to simulate key release
    input.dispatchEvent(keyupEvent);
  }

  function clickElement(element) {
    if (element && typeof element.dispatchEvent === "function") {
      const focusEvent = new FocusEvent("focus", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(focusEvent);

      const mouseDownEvent = new MouseEvent("mousedown", {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      });
      element.dispatchEvent(mouseDownEvent);

      const mouseUpEvent = new MouseEvent("mouseup", {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 0,
      });
      element.dispatchEvent(mouseUpEvent);

      for (const eventName of ["mouseover", "mousedown", "mouseup", "click"]) {
        const eventObject = new MouseEvent(eventName, {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        element.dispatchEvent(eventObject);
      }
    } else {
      console.error("Invalid element or dispatchEvent is not available.");
    }
  }

  // async function toBase64Image(url) {
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64Image = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
  //       resolve(base64Image);
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // }
})();
