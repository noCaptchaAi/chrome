(async () => {
  const jsNotif = (message, delay = 5000, success = true) => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML =
      ".notif{position:fixed;top:40%;left:0;border-radius:10px;padding:20px;color:#fff;font:calc(20px + .5vw) 'Arial',sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;z-index:9999;transition:all 2s;animation:slideIn 1s forwards}" +
      ".success{background-color:rgba(0, 167, 114, 0.9)}" +
      ".failure{background-color:rgba(255, 0, 0, 0.9)}" +
      "@keyframes slideIn{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}" +
      "@keyframes slideOut{0%{transform:translateX(0)}100%{transform:translateX(100%)}";
    document.head.appendChild(styleElement);

    const notifDiv = document.createElement("div");
    notifDiv.className = "notif";
    notifDiv.innerHTML = message;
    notifDiv.style.wordBreak = "break-word";
    notifDiv.style.width = "fit-content";

    if (success) {
      notifDiv.classList.add("success");
    } else {
      notifDiv.classList.add("failure");
    }

    document.body.appendChild(notifDiv);
    setTimeout(() => {
      notifDiv.style.animation = "slideOut 2s forwards";
      setTimeout(() => {
        document.body.removeChild(notifDiv);
      }, 1000);
    }, delay);
  };



  try {

    if (
      location.search.startsWith("?APIKEY=") &&
      location.href.startsWith("https://newconfig.nocaptchaai.com")
    ) {
      const getEndpoint = "https://manage.nocaptchaai.com/api/user/get_endpoint";
      const url = new URL(window.location.href);
      console.log(url.search, "url");
      const searchParams = new URLSearchParams(url.search);
      const paramsToStore = {};

      searchParams.forEach((value, key) => {
        paramsToStore[key] = value?.length > 0 ? value.toLowerCase() : null;
        console.log(key, value);
      });

      await new Promise((resolve, reject) => {
        chrome.storage.sync.set(paramsToStore, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            console.log("Search parameters stored in Firefox sync storage.");
            resolve();
          }
        });
      });

      const settings = await new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (data) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(data);
          }
        });
      });

      if (settings.APIKEY.length === 0) {
        jsNotif("✘ empty apikey", 10000, false);
      } else {
        let result = await fetch(getEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: settings.APIKEY,
          },
        });

        result = await result.json();

        if (result.error) {
          jsNotif(result.error + "\n ✘ noCaptchaAi Extension Config failed ✘");
          // chrome.storage.sync.set({ APIKEY: "" });
        } else {
          jsNotif("✔️ noCaptchaAi Extension Config Successful ✔️");
          // handlePlan(result, searchParams, settings.PLANTYPE);
        }
      }
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      jsNotif("✘ IP timeout, wait 5 minutes and try again", 5000, false);
      throw new Error("✘ IP timeout, wait 5 minutes and try again",);
    } else {
      jsNotif(`✘${error}`, 5000, false);
    }
  }


  // try {
  //   injectCSSAndAnimations();

  //   if (
  //     location.search.startsWith("?APIKEY=") &&
  //     location.href.startsWith("https://newconfig.nocaptchaai.com")

  //   ) {
  //     const get_endpoint =
  //       "https://manage.nocaptchaai.com/api/user/get_endpoint";


  //     const url = new URL(window.location.href);
  //     console.log(url.search, "url");
  //     const searchParams = new URLSearchParams(url.search);
  //     const paramsToStore = {};

  //     searchParams.forEach((value, key) => {
  //       paramsToStore[key] = value?.length > 0 ? value.toLowerCase() : null;
  //       console.log(key, value);
  //     });

  //     chrome.storage.sync
  //       .set(paramsToStore)
  //       .then(() => {
  //         console.log("Search parameters stored in Chrome sync storage.");
  //       })
  //       .catch((error) => {
  //         console.error("Error storing search parameters:", error);
  //       });

  //     const settings = await chrome.storage.sync.get(null);

  //     if (settings.APIKEY.length === 0) {
  //       jsNotif("empty apikey");
  //     } else {
  //       let result = await fetch(get_endpoint, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           apikey: settings.APIKEY,
  //         },
  //       });

  //       result = await result.json();

  //       if (result.error) {
  //         jsNotif(result.error + "\n noCaptchaAi Extension Config failed ✘");
  //         // chrome.storage.sync.set({ APIKEY: "" });
  //       } else {
  //         jsNotif("noCaptchaAi Extension Config Successful ✔️");
  //         // handlePlan(result, searchParams, settings.PLANTYPE);
  //       }
  //     }
  //   }
  // } catch (error) {
  //   if (error == "TypeError: Failed to fetch") {
  //     jsNotif("Cloudflare blocked IP, wait 5 minutes and try again");
  //     throw new Error("Cloudflare blocked IP, wait 5 minutes and try again");
  //   } else {
  //     jsNotif(error);
  //   }
  // }

  // async function handlePlan(result, searchParams, plantype) {
  //     if (result.plan === "free") {
  //         successfulConfig("noCaptchaAi Extension \n Config Successful ✔️");
  //         refreshIframes();
  //     } else if (["daily", "unlimited", "wallet"].includes(result.plan)) {
  //         const settings = await chrome.storage.sync.get(null);
  //         if (result.custom && plantype ) {
  //             await chrome.storage.sync.set({
  //                 PLANTYPE: "custom",
  //                 customEndpoint: result.custom.includes(
  //                     searchParams.endpoint
  //                 )
  //                     ? searchParams.endpoint
  //                     : result.custom[0],
  //             });
  //             successfulConfig(
  //                 "noCaptchaAi Extension Custom plan \n Config Successful ✔️"
  //             );
  //             return;
  //         }
  //         await chrome.storage.sync.set({
  //             PLANTYPE: "pro",
  //         });
  //         successfulConfig(
  //             `noCaptchaAi Extension ${result.plan} plan \n Config Successful ✔️`
  //         );
  //     }
  // }

  function successfulConfig(message) {
    jsNotif(message);
  }

  // function refreshIframes() {
  //   const iframes = [...document.querySelectorAll("[src*=newassets]")];
  //   for (const iframe of iframes) {
  //     const url = iframe.src;
  //     iframe.src = "about:blank";
  //     setTimeout(() => {
  //       iframe.src = url;
  //     }, 10);
  //   }
  // }
})();
