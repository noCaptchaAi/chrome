chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "refresh_hcaptcha") {
        // Refresh hCaptcha iframes
        refreshhCaptchaIframes();
    }
});

function refreshhCaptchaIframes() {
    // Find the hCaptcha iframes on the webpage
    const hCaptchaIframes = document.querySelectorAll(
        'iframe[src*="hcaptcha.com"]'
    );

    // Iterate through each hCaptcha iframe and reload it
    hCaptchaIframes.forEach((iframe) => {
        iframe.contentWindow.location.reload();
    });
}

function iframesReload() {
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        iframes[i].src = iframes[i].src;
    }
}
