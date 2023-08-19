(async () => {
    let selectedType = null;
    let highlightedElement = null;
    let metadataElement = null;
    let cssPathElement = null;
    let stickyElement = null;

    let settings = await chrome.storage.sync.get(null);
    let logs = settings.logsEnabled === "true" ? true : false;
    function log(...args) {
        if (logs) {
            console.log(...args);
        }
    }

    function initializePicker(type) {
        selectedType = type;
        document.body.addEventListener("mousemove", highlightElement);
        document.body.addEventListener("click", selectElement);
        document.addEventListener("keydown", handleKeyDown);

        // Create and attach the sticky element to the page
        stickyElement = createStickyElement(selectedType);
        document.body.appendChild(stickyElement);
    }

    function exitPicker() {
        document.body.removeEventListener("mousemove", highlightElement);
        document.body.removeEventListener("click", selectElement);
        document.removeEventListener("keydown", handleKeyDown);
        if (highlightedElement) {
            highlightedElement.style.outline = "";
        }
        metadataElement.style.display = "none";

        // Remove the sticky element from the page
        if (stickyElement && stickyElement.parentElement) {
            stickyElement.parentElement.removeChild(stickyElement);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Escape") {
            exitPicker();
        }
    }

    function highlightElement(event) {
        event.stopPropagation();
        event.preventDefault();

        if (highlightedElement) {
            highlightedElement.style.outline = "";
        }

        let element = event.target;
        if (!element) {
            handleError("Element is null");
            return;
        }

        highlightedElement = element;
        element.style.outline = "2px solid red";

        const metadataPadding = 10;
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        const metadataWidth = metadataElement.offsetWidth;
        const metadataHeight = metadataElement.offsetHeight;
        let metadataX = mouseX + metadataPadding;
        let metadataY = mouseY + metadataPadding;

        if (metadataX + metadataWidth > window.innerWidth) {
            metadataX = window.innerWidth - metadataWidth - metadataPadding;
        }
        if (metadataY + metadataHeight > window.innerHeight) {
            metadataY = window.innerHeight - metadataHeight - metadataPadding;
        }

        metadataElement.style.left = metadataX + "px";
        metadataElement.style.top = metadataY + "px";

        metadataElement.innerText = "";
        metadataElement.style.display = "block";
        metadataElement.appendChild(createMetadataElement("Tag", element.tagName));
        metadataElement.appendChild(
            createMetadataElement("Class", element.className)
        );
        metadataElement.appendChild(createMetadataElement("ID", element.id));
        metadataElement.appendChild(
            createMetadataElement(
                "Size",
                `${element.offsetWidth}x${element.offsetHeight}`
            )
        );
        if (element.src) {
            metadataElement.appendChild(createMetadataElement("SRC", element.src));
        }

        const cssPath = getCssPath(element);
        if (cssPath) {
            cssPathElement.textContent = cssPath;
        } else {
            handleError("CSS Path not found");
        }
        stickyElement.style.display = "block";
    }

    function createMetadataElement(label, value) {
        const labelElement = document.createElement("span");
        labelElement.textContent = label + ": ";

        const valueElement = document.createElement("span");
        valueElement.textContent = value;

        const metadataElement = document.createElement("div");
        metadataElement.appendChild(labelElement);
        metadataElement.appendChild(valueElement);

        return metadataElement;
    }

    function getCssPath(element) {
        if (!(element instanceof Element)) {
            return "";
        }

        const path = [];
        while (element != null && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            if (element.id) {
                selector += `#${element.id}`;
                path.unshift(selector);
                break;
            } else {
                let sibling = element;
                let nth = 1;
                while ((sibling = sibling.previousElementSibling)) {
                    if (sibling.nodeName.toLowerCase() === selector) {
                        nth++;
                    }
                }
                if (nth !== 1) {
                    selector += `:nth-of-type(${nth})`;
                }
            }
            path.unshift(selector);
            element = element.parentNode;
        }

        return path.join(" > ");
    }

    // function getCssPath(element) {
    //     if (!(element instanceof Element)) {
    //       return "";
    //     }

    //     const getPathSegment = (el) => {
    //       let pathSegment = '';
    //       if (el.id) {
    //         pathSegment = `[@id="${el.id}"]`;
    //       } else {
    //         let sibling = el;
    //         let index = 1;
    //         while ((sibling = sibling.previousElementSibling)) {
    //           if (sibling.nodeName === el.nodeName) {
    //             index++;
    //           }
    //         }
    //         pathSegment = `[${index}]`;
    //       }
    //       return `${el.nodeName.toLowerCase()}${pathSegment}`;
    //     };

    //     const segments = [];
    //     while (element !== null && element.nodeType === Node.ELEMENT_NODE) {
    //       segments.unshift(getPathSegment(element));
    //       element = element.parentNode;
    //     }

    //     return `/${segments.join('/')}`;
    //   }





    function createStickyElement(type) {
        const stickyElement = document.createElement("div");
        stickyElement.style.position = "fixed";
        stickyElement.style.top = "0";
        stickyElement.style.right = "0";
        stickyElement.style.width = "700px";
        stickyElement.style.borderRadius = "0 0 0 10px";
        stickyElement.style.background = "#f5f5f5";
        stickyElement.style.padding = "2px";
        stickyElement.style.zIndex = "9999";
        stickyElement.style.display = "none";

        const logoName = document.createElement("div");
        logoName.innerHTML = "<b>noCaptcha: Captcha Solver</b>";
        logoName.style.color = "#000";
        stickyElement.appendChild(logoName);

        const esc = document.createElement("div");
        esc.innerHTML = "<b>Press ESC to exit the element picker</b>";
        esc.style.color = "#000";
        stickyElement.appendChild(esc);

        const nameElement = document.createElement("div");
        nameElement.style.marginTop = "2px";
        nameElement.style.color = "#000";
        nameElement.style.fontSize = "15px";
        nameElement.textContent = type === "ImageElementPicker" ? "🖼️ Image Element Picker" : " 🅣🅔🅧🅣 Answer Element Picker";
        stickyElement.appendChild(nameElement);

        cssPathElement = document.createElement("div");
        cssPathElement.style.fontFamily = "monospace";
        cssPathElement.style.fontSize = "12px";
        cssPathElement.style.color = "red";
        stickyElement.appendChild(cssPathElement);

        return stickyElement;
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


    function selectElement(event) {
        event.stopPropagation();
        event.preventDefault();
        exitPicker();

        let element = event.target;
        if (!element) {
            handleError("Element is null");
            return;
        }

        chrome.storage.sync.get("domainData", async function (result) {
            const existingData = result.domainData || {};
            log("Existing data", existingData);

            const cssPath = getCssPath(element);
            if (cssPath) {
                const s = await chrome.storage.local.get(null);
                log("s.ocrID", s.ocrID);

                const newDomainData = {
                    [selectedType === "ImageElementPicker" ? "image" : "answer"]: cssPath
                };
                // If the domain data exists in existingData, use it, otherwise use an empty object
                const existingDomainData = existingData[window.location.hostname] || {};
                // Merge existingDomainData and newDomainData
                const updatedDomainData = { ...existingDomainData, ...newDomainData };

                // Replace the domain data in existingData with updatedDomainData
                const updatedData = { ...existingData, [window.location.hostname]: updatedDomainData };

                chrome.storage.sync.set({ domainData: updatedData }, function () {
                    log("Saved data", updatedData);
                });
            } else {
                handleError("save error: CSS Path not found");
            }
        });


        // chrome.storage.sync.get("domainData", async function (result) {
        //     const existingData = result.domainData || {};
        //     log("Existing data", existingData);

        //     const cssPath = getCssPath(element);
        //     if (cssPath) {
        //         const s = await chrome.storage.local.get(null);
        //         log("s.ocrID", s.ocrID);

        //         const newDomainData = {
        //             [selectedType === "ImageElementPicker" ? "image" : "answer"]: cssPath
        //         };
        //         const updatedData = { ...existingData };
        //         updatedData[window.location.hostname] = newDomainData;

        //         chrome.storage.sync.set({ domainData: updatedData }, function () {
        //             log("Saved data", updatedData);
        //         });

        //     } else {
        //         handleError("save error: CSS Path not found");
        //     }
        // });
    }

    chrome.runtime.onMessage.addListener((request) => {
        if (
            request.command === "ImageElementPicker" ||
            request.command === "AnswerElementPicker"
        ) {
            initializePicker(request.command);
        }
    });

    metadataElement = document.createElement("div");
    metadataElement.style.position = "fixed";
    metadataElement.style.background = "white";
    metadataElement.style.padding = "5px";
    metadataElement.style.width = "500px";
    metadataElement.style.left = "0px";
    metadataElement.style.maxWidth = "600px";
    metadataElement.style.maxHeight = "600px";
    metadataElement.style.overflow = "auto";
    metadataElement.style.color = "#000";
    metadataElement.style.border = "1px solid black";
    metadataElement.style.zIndex = "9999";
    metadataElement.style.display = "none";
    document.body.appendChild(metadataElement);

})();
