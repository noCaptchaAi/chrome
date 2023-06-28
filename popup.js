document.getElementById("imagePicker").addEventListener("click", function () {
    chrome.runtime.sendMessage({ command: "ImageElementPicker" });
    console.log("imagePicker");
    window.close();
});

document.getElementById("answerPicker").addEventListener("click", function () {
    chrome.runtime.sendMessage({ command: "AnswerElementPicker" });
    console.log("answerPicker");
    window.close();
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.yourSyncStorageValue) {
        // Refresh hCaptcha iframes
        refreshhCaptchaIframes();
    }
});


function refreshhCaptchaIframes() {
    // Get all active tabs
    chrome.tabs.query({}).then((tabs) => {
        // Iterate through each tab
        tabs.forEach((tab) => {
            // Check if the tab is already loaded and has a content script injected
            if (tab.status === "complete" && tab.url.startsWith("http")) {
                // Send a message to the content script to refresh hCaptcha iframes
                chrome.tabs
                    .sendMessage(tab.id, { command: "refresh_hcaptcha" })
                    .then(() => {
                        // Optional: Handle response from content script
                    })
                    .catch((error) => {
                        console.error("Error refreshing hCaptcha iframes:", error);
                    });
            }
        });
    });
}

// refresh iframes
// function refreshIframes() {
//     chrome.tabs.executeScript({
//         code: "iframesReload();",
//     });
// }

// Handle Extension Configs

const inputElements = document.querySelectorAll(
    'input[type="checkbox"], input[type="number"],input[type="text"], select'
);

// Retrieve values from chrome.storage.sync for all input elements
function retrieveValuesFromStorage() {
    chrome.storage.sync.get(null, (result) => {
        inputElements.forEach((element) => {
            const elementId = element.id;
            const elementType =
                element.nodeName.toLowerCase() === "select"
                    ? "select"
                    : element.getAttribute("type");

            if (elementType === "checkbox") {
                element.checked = result[elementId] === "true";
            } else {
                element.value = result[elementId] || "";
            }
            console.log(elementId, result[elementId]);

        });
    });
}

// Update values in chrome.storage.sync when inputs change
function updateValuesInStorage() {
    inputElements.forEach((element) => {
        element.addEventListener("change", () => {
            const elementId = element.id;
            const elementType =
                element.nodeName.toLowerCase() === "select"
                    ? "select"
                    : element.getAttribute("type");
            const value =
                elementType === "checkbox" ? element.checked.toString() : element.value;
            const data = { [elementId]: value };

            chrome.storage.sync.set(data, () => {
                console.log(`Updated ${elementId}:`, value);
            });
            // refreshIframes();
        });
    });
}

// Call the functions to initialize and handle the storage operations
retrieveValuesFromStorage();
updateValuesInStorage();

// const inputElements = document.querySelectorAll(
//     'input[type="checkbox"], input[type="number"], select'
// );

// inputElements.forEach((element) => {
//     const elementId = element.id;
//     const elementType =
//         element.nodeName.toLowerCase() === "select"
//             ? "select"
//             : element.getAttribute("type");

//     chrome.storage.sync.get(elementId, (result) => {
//         if (elementType === "checkbox") {
//             element.checked = result[elementId] === "true";
//         } else {
//             element.value = result[elementId] || "";
//         }
//         console.log(`Retrieved key ${elementId}:`, result[elementId]);
//     });
// });

// inputElements.forEach((element) => {
//     element.addEventListener("input", () => {
//         const elementId = element.id;
//         const elementType =
//             element.nodeName.toLowerCase() === "select"
//                 ? "select"
//                 : element.getAttribute("type");
//         const value =
//             elementType === "checkbox"
//                 ? element.checked.toString()
//                 : element.value;
//         const data = { [elementId]: value };

//         chrome.storage.sync.set(data, () => {
//             console.log(`Updated ${elementId}:`, value);
//         });
//         refreshIframes();
//     });
// });

// const ExtensionPowerBtn = document.getElementById("powerButton");
// const APIKEY = document.getElementById("APIKEY");
// const SolveDelay = document.getElementById("SolveDelay");

// ExtensionPowerBtn.addEventListener("click", function () {
//     // Toggle power
//     chrome.storage.sync.get("extensionEnabled", function (data) {
//         console.log("Extension enabled:", data.extensionEnabled);
//         chrome.storage.sync.set({ extensionEnabled: !data.extensionEnabled });
//     });
// });

// modal

const openSettingsModalBtn = document.getElementById("SettingsModalOpenButton");
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("hcModal");
    const openModalBtn = document.getElementById("hcModalOpenButton");
    const closeModalBtn = document.getElementById("hcModalCloseButton");

    const openModal = () => (modal.style.display = "block");
    const closeModal = () => (modal.style.display = "none");

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("rcModal");
    const openModalBtn = document.getElementById("rcModalOpenButton");
    const closeModalBtn = document.getElementById("rcModalCloseButton");

    const openModal = () => (modal.style.display = "block");
    const closeModal = () => (modal.style.display = "none");

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("ocrModal");
    const openModalBtn = document.getElementById("ocrModalOpenButton");
    const closeModalBtn = document.getElementById("ocrModalCloseButton");

    const openModal = () => (modal.style.display = "block");
    const closeModal = () => (modal.style.display = "none");

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("settingsModal");
    const openModalBtn = document.getElementById("SettingsModalOpenButton");
    const closeModalBtn = document.getElementById("SettingsModalCloseButton");

    const openModal = () => (modal.style.display = "block");
    const closeModal = () => (modal.style.display = "none");

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
});

// balance

// let cachedBalanceData = null;

// const fetchAndDisplayData = async (url, elementId, fields) => {
//     const settings = await new Promise((resolve) => {
//         chrome.storage.sync.get(null, (data) => {
//             resolve(data);
//         });
//     });

//     const element = document.getElementById(elementId);
//     if (!element && settings.APIKEY == null) {
//         jsNotif("Please enter your API key", 2000);
//         return;
//     }

//     const response = await fetch(url, {
//         headers: {
//             apikey: settings.APIKEY,
//         },
//     });

//     const data = await response.json();

//     const c = document.getElementById("error-api");
//     if (data.error) {
//         c.style.display = "block";
//         c.style.color = "red";
//         c.style.height = "100px";
//         c.style.fontSize = "20px";
//         c.style.textAlign = "center";
//         c.innerHTML = data.message;

//         const balanceDataElement = element.querySelector(".loader");
//         if (balanceDataElement) {
//             element.removeChild(balanceDataElement);
//         }

//         return;
//     } else if (c.style.display === "block") {
//         c.style.display = "none";
//     }

//     console.log(data, "data");
//     if (data && url === endpointurl && settings.PLANTYPE == null) {
//         if (data.plan == "free") {
//             settings.PLANTYPE = "free";
//             chrome.storage.sync.set({ PLANTYPE: "free" });
//             document.getElementById("PLANTYPE").value = "free";
//         } else {
//             chrome.storage.sync.set({ PLANTYPE: "pro" });
//             document.getElementById("PLANTYPE").value = "pro";
//         }
//     }

//     const balanceDataElement = element.querySelector(".loader");
//     if (balanceDataElement) {
//         element.removeChild(balanceDataElement);
//     }

//     const newBalanceDataElement = document.createElement("div");
//     newBalanceDataElement.id = "balance-data";

//     fields.forEach((key) => {
//         const value =
//             key in data
//                 ? data[key]
//                 : data.Subscription && data.Subscription[key];
//         const div = document.createElement("div");
//         const p1 = document.createElement("p");
//         const p2 = document.createElement("p");
//         div.className = "data-item";
//         // div.textContent = `${key}: ${value}`;
//         p1.textContent = key;
//         p1.className = "data-item-key";
//         p2.textContent = value;
//         p2.className = "data-item-value";
//         newBalanceDataElement.appendChild(div);
//         div.appendChild(p1);
//         div.appendChild(p2);
//     });

//     element.appendChild(newBalanceDataElement);

//     cachedBalanceData = JSON.stringify(data);
// };

// const jsNotif = (m, d) => {
//     const t = document.createElement("div");
//     (t.style.cssText =
//         "position:fixed;top:10%;left:0;background-color:rgba(0,0,0,.8);border-radius:4px;padding:16px;color:#fff;font:calc(14px + .5vw) 'Arial',sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;z-index:9999;transition:all 1s;animation:slideIn 1s forwards"),
//         (t.innerHTML = m),
//         document.body.appendChild(t);
//     const o = document.createElement("style");
//     (o.innerHTML =
//         "@keyframes slideIn{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}@keyframes slideOut{0%{transform:translateX(0)}100%{transform:translateX(100%)}}"),
//         document.head.appendChild(o);
//     setTimeout(() => {
//         (t.style.animation = "slideOut 1s forwards"),
//             setTimeout(() => {
//                 document.body.removeChild(t);
//             }, 1e3);
//     }, d || 3e3);
// };

// const balanceFields = [
//     "Balance",
//     "expire",
//     "planName",
//     "remaining",
//     "used",
//     "wallet_usages",
// ];

// const endpointurl = "https://manage.nocaptchaai.com/api/user/get_endpoint";
// const balanceurl = "https://manage.nocaptchaai.com/balance";

// const refreshData = async () => {
//     fetchAndDisplayData(balanceurl, "balance-section", balanceFields);
//     // fetchAndDisplayData(endpointurl, "endpoint-section", ["endpoint", "free"]);
// };

// document.addEventListener("DOMContentLoaded", () => {
//     refreshData();

//     const refreshButton = document.getElementById("refresh-button");
//     refreshButton.addEventListener("click", refreshData);
// });

let cachedBalanceData = null;

const fetchAndDisplayData = async (url, elementId, fields) => {
    const settings = await new Promise((resolve) => {
        chrome.storage.sync.get(null, (data) => {
            resolve(data);
        });
    });
    const errorApiElement = document.getElementById("error-api");

    const element = document.getElementById(elementId);
    if ((element && !settings.APIKEY) || settings.APIKEY.length < 1) {
        errorApiElement.style.display = "block";
        errorApiElement.style.color = "red";
        errorApiElement.style.height = "120px";
        errorApiElement.style.fontSize = "20px";
        errorApiElement.style.textAlign = "center";
        errorApiElement.innerHTML = "Please enter APIKEY to start solving";
        return;
    }

    const response = await fetch(url, {
        headers: {
            apikey: settings.APIKEY,
        },
    });

    if (response.status === 403) {
        errorApiElement.style.display = "block";
        errorApiElement.style.color = "red";
        errorApiElement.style.height = "100px";
        errorApiElement.style.fontSize = "20px";
        errorApiElement.style.marginTop = "10px";
        errorApiElement.style.textAlign = "center";
        errorApiElement.innerHTML = "IP timeout, wait 5 minutes and try again";
        return;
    }
    const data = await response.json();

    if (response.error) {
        errorApiElement.style.display = "block";
        errorApiElement.style.color = "red";
        errorApiElement.style.height = "100px";
        errorApiElement.style.fontSize = "20px";
        errorApiElement.style.textAlign = "center";
        errorApiElement.innerHTML = data.message;

        // const balanceDataElement = element.querySelector(".loader");
        // if (balanceDataElement) {
        //     element.removeChild(balanceDataElement);
        // }

        return;
    } else {
        errorApiElement.style.display = "none";
    }

    // console.log(data, "data");
    if (data.error) {
        jsNotif(data.message, 5000);
        errorApiElement.style.display = "block";
        errorApiElement.style.color = "red";
        errorApiElement.style.height = "100px";
        errorApiElement.style.fontSize = "20px";
        errorApiElement.style.textAlign = "center";
        errorApiElement.innerHTML = data.message;
        console.log(data.message);
        return;
    } else if (data && url === endpointurl && settings.PLANTYPE == null) {
        if (data.plan === "free") {
            settings.PLANTYPE = "free";
            chrome.storage.sync.set({ PLANTYPE: "free" });
            document.getElementById("PLANTYPE").value = "free";

            console.log("free", document.getElementById("PLANTYPE").value);

            document.querySelector("#PLANTYPE option[value='free']").disabled = true;
        } else {
            chrome.storage.sync.set({ PLANTYPE: "pro" });
            document.getElementById("PLANTYPE").value = "pro";
        }
    }

    // const balanceDataElement = element.querySelector(".loader");
    // if (balanceDataElement) {
    //     element.removeChild(balanceDataElement);
    // }

    const newBalanceDataElement = document.createElement("div");
    newBalanceDataElement.id = "balance-data";

    fields.forEach((key) => {
        const value =
            key in data ? data[key] : data.Subscription && data.Subscription[key];
        const div = document.createElement("div");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        div.className = "data-item";
        p1.textContent = key;
        p1.className = "data-item-key";
        p2.textContent = value;
        p2.className = "data-item-value";
        newBalanceDataElement.appendChild(div);
        div.appendChild(p1);
        div.appendChild(p2);
    });

    const existingBalanceDataElement = element.querySelector("#balance-data");
    if (existingBalanceDataElement) {
        element.replaceChild(newBalanceDataElement, existingBalanceDataElement);
    } else {
        element.appendChild(newBalanceDataElement);
    }

    cachedBalanceData = JSON.stringify(data);
};

const jsNotif = (message, duration) => {
    const notificationElement = document.createElement("div");
    notificationElement.style.cssText =
        "position:fixed;top:10%;left:0;background-color:rgba(0,0,0,.8);border-radius:4px;padding:16px;color:#fff;font:calc(14px + .5vw) 'Arial',sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;z-index:9999;transition:all 1s;animation:slideIn 1s forwards";
    notificationElement.innerHTML = message;
    document.body.appendChild(notificationElement);

    const animationStyleElement = document.createElement("style");
    animationStyleElement.innerHTML =
        "@keyframes slideIn{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}@keyframes slideOut{0%{transform:translateX(0)}100%{transform:translateX(100%)}}";
    document.head.appendChild(animationStyleElement);

    setTimeout(() => {
        notificationElement.style.animation = "slideOut 1s forwards";
        setTimeout(() => {
            document.body.removeChild(notificationElement);
        }, 1000);
    }, duration || 3000);
};

const balanceFields = [
    "Balance",
    "planName",
    "wallet_usages",
    "used",
    "remaining",
    "nextReset",
    "expire",
];

const endpointurl = "https://manage.nocaptchaai.com/api/user/get_endpoint";
const probalurl = "https://manage.nocaptchaai.com/balance";
const freebalurl = "https://free.nocaptchaai.com/balance";

const refreshData = async () => {


    const refreshButton = document.getElementById("refresh-button");
    refreshButton.innerHTML = '<img src="/icons/s.svg" width="16px"  alt="██▒▒▒▒▒▒▒▒ 20%" /> ██▒▒▒▒▒▒▒▒  20% ';
    await sleep(150);
    refreshButton.innerHTML = '<img src="/icons/s.svg" width="16px"  alt="█████▒▒▒▒▒ 50%" /> █████▒▒▒▒▒ 50% ';
    await sleep(200);
    refreshButton.innerHTML = '<img src="/icons/s.svg" width="16px"  alt="█████████▒ 90%" /> █████████▒ 90% ';
    let plan;
    chrome.storage.sync.get(null, (settings) => {
        console.log(settings.APIKEY);
        plan = settings.PLANTYPE;
    });
    await fetchAndDisplayData(
        plan === "free" ? freebalurl : probalurl,
        "balance-section",
        balanceFields
    );
    await fetchAndDisplayData(endpointurl, "endpoint-section", [
        // "endpoint",
        "free",
    ]);

    refreshButton.innerHTML = "Refresh";
    refreshButton.style.fontSize = "16px";
    refreshButton.style.fontWeight = "bold";
};

document.addEventListener("DOMContentLoaded", () => {
    refreshData();

    const refreshButton = document.getElementById("refresh-button");
    refreshButton.addEventListener("click", refreshData);
});

// balance end
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const custom = document.getElementById("PLANTYPE");
custom.addEventListener("change", async () => {
    if (custom.value === "custom") {
        jsNotif("custom plan only available with cutsom endpoint", 2000);
        await sleep(2000);
        openSettingsModalBtn.click();
    }
});

const apikeyText = document.getElementById("apikey-text");
const apikeyInput = document.getElementById("apikey-input");
const editButton = document.getElementById("edit-button");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");

apikeyInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        saveButton.click(); // Trigger the click event of the save button
    }
});

// apikeyInput.addEventListener('mouseleave', function () {
//     saveButton.click(); // Trigger the click event of the save button
// });

const toggleEditMode = () => {
    apikeyText.style.display = "none";
    apikeyInput.style.display = "inline-block";
    editButton.style.display = "none";
    saveButton.style.display = "inline-block";
    deleteButton.style.display = "inline-block";
    apikeyInput.focus();
};

const toggleViewMode = () => {
    apikeyText.style.display = "inline-block";
    apikeyInput.style.display = "none";
    editButton.style.display = "inline-block";
    saveButton.style.display = "none";
    deleteButton.style.display = "none";
};

const saveApiKey = async () => {
    const newApiKey = apikeyInput.value;
    chrome.storage.sync.set({ APIKEY: newApiKey }, () => {
        console.log("API key saved");
    });
    refreshData();
    updateApiKeyDisplay(newApiKey);
};

const deleteApiKey = () => {
    chrome.storage.sync.remove("APIKEY", () => {
        console.log("API key removed");
    });
    apikeyText.textContent = "";
    apikeyInput.value = "";

    document.getElementById("balance-area").innerHTML = "Apikey Removed";
    saveApiKey();
    updateApiKeyDisplay("");
    // refreshData();
};

const updateApiKeyDisplay = (apikey) => {
    // const partiallyHiddenApiKey =
    //     apikey.substring(0, 5) + "*".repeat(apikey.length - 5);
    const partiallyHiddenApiKey = apikey && apikey.length >= 5
        ? apikey.substring(0, 5) + "*".repeat(apikey.length - 5)
        : apikey ? "*".repeat(apikey.length) : "";

    apikeyText.textContent = partiallyHiddenApiKey;
    toggleViewMode();
    apikeyInput.style.display = "none";
};

// Add event listeners
editButton.addEventListener("click", toggleEditMode);
saveButton.addEventListener("click", saveApiKey);
deleteButton.addEventListener("click", deleteApiKey);

// Load the API key from local sync storage
window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("APIKEY", (data) => {
        if (data.APIKEY) {
            const savedApiKey = data.APIKEY;
            updateApiKeyDisplay(savedApiKey);
            apikeyInput.value = savedApiKey;
        }
    });
});

chrome.storage.sync.get(null, (settings) => {
    console.log(settings.APIKEY);
    // print all of items in defaultConfigs
});

// Toaster

function showToast(message, color, emoji, duration) {
    let toast = document.getElementById("toast");
    toast.style.backgroundColor = color;
    toast.innerHTML = `${emoji} ${message}`;
    toast.className = "show";
    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, duration);
}

// custom Endpoint

// const customEndpointInput = document.getElementById("customEndpoint");
// customEndpointInput.addEventListener("input", handleCustomEndpointChange);

// function handleCustomEndpointChange(event) {
//     const newEndpointValue = event.target.value;

//     chrome.storage.sync
//         .set({ customEndpoint: newEndpointValue })
//         .then(() => {
//             console.log(
//                 "Custom endpoint updated in sync storage:",
//                 newEndpointValue
//             );
//         })
//         .catch((error) => {
//             console.error("Error updating sync storage:", error);
//         });
// }

const customEndpointInput = document.getElementById("customEndpoint");
customEndpointInput.addEventListener("input", handleCustomEndpointChange);

chrome.storage.sync
    .get("customEndpoint")
    .then((result) => {
        const savedEndpointValue = result.customEndpoint;
        if (savedEndpointValue) {
            customEndpointInput.value = savedEndpointValue;
        }
    })
    .catch((error) => console.error("Error retrieving value:", error));

function handleCustomEndpointChange(event) {
    const newEndpointValue = event.target.value;
    chrome.storage.sync
        .set({ customEndpoint: newEndpointValue })
        .catch((error) => console.error("Error updating value:", error));
}

// Export Settings

document.addEventListener("DOMContentLoaded", function () {
    const exp = document.getElementById("export");
    exp.addEventListener("click", function () {
        chrome.storage.sync.get(null, function (items) {
            const defaultConfigs = {
                // Global
                APIKEY: null,
                PLANTYPE: null,
                customEndpoint: null,
                hCaptchaEnabled: true,
                reCaptchaEnabled: true,
                dataDomeEnabled: true,
                ocrEnabled: true,
                ocrToastEnabled: true,
                extensionEnabled: true,
                logsEnabled: false,
                fastAnimationMode: true,
                debugMode: false,
                // hCaptcha
                hCaptchaAutoOpen: true,
                hCaptchaAutoSolve: true,
                hCaptchaGridSolveTime: 7, // seconds
                hCaptchaMultiSolveTime: 5, // seconds
                hCaptchaBoundingBoxSolveTime: 5, // seconds
                hCaptchaAlwaysSolve: true,
                englishLanguage: true,
                // reCaptcha
                reCaptchaAutoOpen: true,
                reCaptchaAutoSolve: true,
                reCaptchaAlwaysSolve: true,
                reCaptchaClickDelay: 400, // milliseconds
                reCaptchaSubmitDelay: 1, // seconds
                reCaptchaSolveType: "image", // for default audio use "audio"
            };

            // Use keys from defaultConfigs to get values from sync storage
            const settings = {};
            for (const key in defaultConfigs) {
                settings[key] = items[key] ?? defaultConfigs[key];
            }

            const data = JSON.stringify(settings, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.download = "settings.json";
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });
});

//  OCR Settings

// Get the current tab's sync storage values
chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0];
    if (tab) {
        const hostname = new URL(tab.url).hostname;

        chrome.storage.sync.get("domainData").then((sync) => {
            try {
                if (!sync.domainData) {
                    document.getElementById("domain").innerText = hostname + "\nNo data found";
                    return;
                }

                const domainData = sync.domainData[hostname] || {};
                const { ocrid, image, answer } = domainData;

                console.log(hostname, ocrid, image, answer);

                document.getElementById("domain").innerText = hostname || "NO DATA";
                document.getElementById("ocrID").innerText = ocrid || "NO DATA FOUND";
                document.getElementById("imagePickerInput").innerText = image || "NO DATA FOUND";
                document.getElementById("answerPickerInput").innerText = answer || "NO DATA FOUND";
            } catch (error) {
                console.log(error);
            }
        });
    }
});



// chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//     const tab = tabs[0];
//     if (tab) {
//         const hostname = new URL(tab.url).hostname;
//         const imgKey = hostname;
//         const ansKey = hostname;
//         const idKey = hostname;

//         chrome.storage.sync.get("domainData").then((sync) => {
//             try {
//                 const { target: img } = sync.domainData[imgKey] || {};
//                 const { target: ans } = sync.domainData[ansKey] || {};
//                 const { target: ocrid } = sync.domainData[idKey] || {};

//                 console.log(imgKey, ansKey, img, ans);

//                 document.getElementById("domain").innerText = hostname || "";
//                 document.getElementById("ocrID").innerText = ocrid || "";
//                 document.getElementById("imagePickerInput").innerText = img || "";
//                 document.getElementById("answerPickerInput").innerText = ans || "";
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     }
// });


// Store new values on change to sync storage
document.getElementById("imagePickerInput").addEventListener("input", function () {
    updateStorage('image', this.value);
});

document.getElementById("answerPickerInput").addEventListener("input", function () {
    updateStorage('answer', this.value);
});

document.getElementById("ocrID").addEventListener("input", function () {
    updateStorage('ocrid', this.value);
});

function updateStorage(field, value) {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const tab = tabs[0];
        if (tab) {
            const hostname = new URL(tab.url).hostname;

            // Get current data for the domain
            chrome.storage.sync.get('domainData', function (result) {
                let allDomainData = result.domainData || {}; // if result.domainData is undefined, initialize it to an empty object
                let domainData = allDomainData[hostname] || {}; // if there is no data for this hostname, initialize it to an empty object

                // Update the field with new value
                domainData[field] = value;

                // Save the updated data back to allDomainData
                allDomainData[hostname] = domainData;

                // Save the updated data back to storage
                chrome.storage.sync.set({ domainData: allDomainData }, function () {
                    console.log(`Updated ${field} in storage for ${hostname}`);
                    console.log(domainData);
                });
            });
        }
    });
}



// document.getElementById("imagePickerInput").addEventListener("input", function () {
//     chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//         const tab = tabs[0];
//         if (tab) {
//             const hostname = new URL(tab.url).hostname;
//             const value = this.value;
//             const type = "ImageElementPicker";
//             const key = `${hostname}-${type}`;
//             console.log("ImageElementPicker", hostname, key, value);
//             storeValueInSyncStorage(key, value, type);
//         }
//     });
// });

// document.getElementById("answerPickerInput").addEventListener("input", function () {
//     chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//         const tab = tabs[0];
//         if (tab) {
//             const hostname = new URL(tab.url).hostname;
//             const value = this.value;
//             const type = "AnswerElementPicker";
//             const key = `${hostname}-${type}`;
//             console.log("answerPickerInput", hostname, key, value);
//             storeValueInSyncStorage(key, value, type);
//         }
//     });
// });

// document.getElementById("ocrID").addEventListener("input", function () {
//     chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//         const tab = tabs[0];
//         if (tab) {
//             const hostname = new URL(tab.url).hostname;
//             const value = this.value;
//             const type = "ocrid";
//             const key = `${hostname}-${type}`;
//             console.log("ocrid", hostname, key, value);
//             storeValueInSyncStorage(key, value, type);
//         }
//     });
// });



// function storeValueInSyncStorage(target, value, type) {
//     console.log("storeValueInSyncStorage");
//     chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//         const tab = tabs[0];
//         if (tab) {
//             const hostname = new URL(tab.url).hostname;
//             chrome.storage.sync.get("domainData", function (result) {
//                 const domainData = result.domainData || {};
//                 const updatedData = { ...domainData };
//                 const newDomainData = {
//                     [target]: {
//                         target: value,
//                     },
//                 };
//                 updatedData[hostname + "-" + type] = newDomainData;
//                 console.log("hostname-type", hostname + "-" + type);
//                 chrome.storage.sync.set({ domainData: updatedData }, function () {
//                     // Print the updated data as "Saved data"
//                     console.log("updated data", type, target, value, updatedData);
//                 });
//             });
//         }
//     })

// }

function storeValueInSyncStorage(key, value, type) {
    console.log("storeValueInSyncStorage");
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const tab = tabs[0];
        if (tab) {
            const hostname = new URL(tab.url).hostname;
            chrome.storage.sync.get("domainData", function (result) {
                const domainData = result.domainData || {};
                const updatedData = { ...domainData };
                const newDomainData = {
                    "target": value,  // Adjusted here
                };
                updatedData[hostname + "-" + type] = newDomainData;
                console.log("hostname-type", hostname + "-" + type);
                chrome.storage.sync.set({ domainData: updatedData }, function () {
                    console.log("updated data", type, value, updatedData);
                });
            });
        }
    });
}

// send ocr id to element picker
document.getElementById('imagePicker').onclick = function () {
    sendMessageToContentScript();
};
document.getElementById('answerPicker').onclick = function () {
    sendMessageToContentScript();
};

function sendMessageToContentScript() {
    let ocrid = document.getElementById('ocrID')?.value;
    console.log(ocrid, "ocrid1");
    if (ocrid) {
        chrome.storage.local.set({ 'ocrID': ocrid }, function () {
            console.log(ocrid, 'ocrID is stored.');
        });
    }

};


//  export OCR JSON

document.getElementById('exportOCR').addEventListener('click', function downloadDomainData() {
    chrome.storage.sync.get('domainData', function (result) {
        let data = result.domainData || {};
        let dataStr = JSON.stringify(data);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = 'domainData.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
}
);


// import OCR JSON or merge
document.getElementById('importButton').addEventListener('click', function () {
    let modal = document.getElementById('importModal');
    modal.setAttribute('style', 'display: flex; flex-direction:column; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: rgba (0,0,0,.6); z-index: 9999; justify-content: center; align-items: center;');

    let modalContent = document.getElementById('modalContent');
    // make modal content 80 width 60 percent height
    modalContent.setAttribute('style', 'width: 90%; height: 100%; background: white; padding: 10px; border-radius: 5px;');
});



document.getElementById('closeModalButton').addEventListener('click', function () {
    let modal = document.getElementById('importModal');
    modal.style.display = "none";
});


// document.getElementById('replaceButton').addEventListener('click', function() {
//     let jsonInput = document.getElementById('jsonInput');
//     let newData = JSON.parse(jsonInput.value);
//     chrome.storage.sync.set({ domainData: newData }, function() {
//         console.log("Data replaced");
//     });
// });

// document.getElementById('mergeButton').addEventListener('click', function() {
//     let jsonInput = document.getElementById('jsonInput');
//     let newData = JSON.parse(jsonInput.value);
//     chrome.storage.sync.get('domainData', function(result) {
//         let existingData = result.domainData || {};
//         let mergedData = Object.assign({}, existingData, newData);
//         chrome.storage.sync.set({ domainData: mergedData }, function() {
//             console.log("Data merged");
//         });
//     });
// });


document.getElementById('replaceButton').addEventListener('click', function () {
    let jsonInput = document.getElementById('jsonInput');
    let feedback = document.getElementById('feedback');
    try {
        let newData = JSON.parse(jsonInput.value);
        chrome.storage.sync.set({ domainData: newData }, function () {
            feedback.innerText = "Data replaced successfully!";
            feedback.classList.add('feedback-show');
            setTimeout(function () {
                feedback.classList.remove('feedback-show');
            }, 3000);
        });
    } catch (error) {
        feedback.innerText = "Failed to replace data: " + error.message;
        feedback.classList.add('feedback-show');
        setTimeout(function () {
            feedback.classList.remove('feedback-show');
        }, 3000);
    }
});

document.getElementById('mergeButton').addEventListener('click', function () {
    let jsonInput = document.getElementById('jsonInput');
    let feedback = document.getElementById('feedback');
    try {
        let newData = JSON.parse(jsonInput.value);
        chrome.storage.sync.get('domainData', function (result) {
            let existingData = result.domainData || {};
            let mergedData = Object.assign({}, existingData, newData);
            chrome.storage.sync.set({ domainData: mergedData }, function () {
                feedback.innerText = "Data merged successfully!";
                feedback.classList.add('feedback-show');
                setTimeout(function () {
                    feedback.classList.remove('feedback-show');
                }, 3000);
            });
        });
    } catch (error) {
        feedback.innerText = "Failed to merge data: " + error.message;
        feedback.classList.add('feedback-show');
        setTimeout(function () {
            feedback.classList.remove('feedback-show');
        }, 3000);
    }
});

// ocr id list
document.getElementById('ocrIDPicker').addEventListener('click', function () {
    window.open("https://docs.nocaptchaai.com/en/image/ImageToText.html#ocrid");
});


// Check for Extension Update
const versionElement = document.getElementById("version");

async function fetchLatestRelease() {
    // const repoUrl = "https://api.github.com/repos/noCaptchaAi/chrome/releases/latest";
    const repoUrl = "https://api.github.com/repos/noCaptchaAi/chrome-extension/releases/latest";

    try {
        const response = await fetch(repoUrl);
        const data = await response.json();
        const latestVersion = data.tag_name;

        if (latestVersion && latestVersion !== versionElement.innerText) {
            versionElement.innerText = "⚡new " + latestVersion;
            versionElement.style.fontSize = ".8rem";
            versionElement.style.fontWeight = "bold";
            versionElement.href = data.html_url;
            versionElement.classList.add("glowing-text");
        }
    } catch (error) {
        console.error("Error fetching latest release:", error);
    }
}

fetchLatestRelease();
