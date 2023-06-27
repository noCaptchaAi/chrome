(async () => {
  const injectCSSAndAnimations = () => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML =
      ".notif{position:fixed;top:40%;left:0;background-color:rgba(0, 167, 114, 0.9);border-radius:10px;padding:20px;color:#fff;font:calc(20px + .5vw) 'Arial',sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;z-index:9999;transition:all 2s;animation:slideIn 1s forwards}" +
      "@keyframes slideIn{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}" +
      "@keyframes slideOut{0%{transform:translateX(0)}100%{transform:translateX(100%)}";
    document.head.appendChild(styleElement);
  };

  const jsNotif = (message, delay = 5000) => {
    const notifDiv = document.createElement("div");
    notifDiv.className = "notif";
    notifDiv.innerHTML = message;
    notifDiv.style.wordBreak = "break-word";
    notifDiv.style.width = "fit-content";
    document.body.appendChild(notifDiv);
    setTimeout(() => {
      notifDiv.style.animation = "slideOut 2s forwards";
      setTimeout(() => {
        document.body.removeChild(notifDiv);
      }, 1000);
    }, delay);
  };

  try {
    injectCSSAndAnimations();

    if (
      location.search.startsWith("?APIKEY=") &&
      location.href.startsWith("https://newconfig.nocaptchaai.com")

    ) {
      const get_endpoint =
        "https://manage.nocaptchaai.com/api/user/get_endpoint";

      // old method
      // const searchParams = new URLSearchParams(window.location.search);
      // const apiKey = searchParams.get("apikey");
      // const planType = searchParams.get("plan");
      // const endpoint = searchParams.get("endpoint");

      // await chrome.storage.sync.set({
      //     APIKEY: apiKey?.length > 0 ? apiKey.toLowerCase() : null,
      //     PLANTYPE: planType?.length > 0 ? planType.toLowerCase() : null,
      //     customEndpoint: endpoint?.length > 0 ? endpoint.toLowerCase() : null,
      // });
      // end

      //   new method
      const url = new URL(window.location.href);
      console.log(url.search, "url");
      const searchParams = new URLSearchParams(url.search);
      const paramsToStore = {};

      searchParams.forEach((value, key) => {
        paramsToStore[key] = value?.length > 0 ? value.toLowerCase() : null;
        console.log(key, value);
      });

      chrome.storage.sync
        .set(paramsToStore)
        .then(() => {
          console.log("Search parameters stored in Firefox sync storage.");
        })
        .catch((error) => {
          console.error("Error storing search parameters:", error);
        });

      const settings = await chrome.storage.sync.get(null);

      if (settings.APIKEY.length === 0) {
        jsNotif("empty apikey");
      } else {
        const res = await fetch(get_endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: settings.APIKEY,
          },
        });
        const result = await res.json();

        if (result.error) {
          jsNotif(result.error + "\n noCaptchaAi Extension Config failed ✘");
          // chrome.storage.sync.set({ APIKEY: "" });
        } else {
          jsNotif("noCaptchaAi Extension Config Successful ✔️");
          // handlePlan(result, searchParams, settings.PLANTYPE);
        }
      }
    }
  } catch (error) {
    jsNotif("An error occurred: " + error.message);
  }

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
