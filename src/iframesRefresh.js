// function addRefreshButton() {
//     const button = document.createElement('button');
//     button.style.position = 'fixed';
//     button.style.right = '10px';
//     button.style.top = '50%';
//     button.style.zIndex = 9999;
//     button.innerText = 'Refresh iframes';
  
//     button.onclick = () => {
//       const iframes = document.querySelectorAll('iframe');
//       iframes.forEach((iframe) => {
//         // Method 1: Reassign the src attribute
//         const originalSrc = iframe.src;
//         iframe.src = '';
//         iframe.src = originalSrc;
  
//         // Check if the iframe is successfully refreshed after a small delay
//         setTimeout(() => {
//           if (iframe.contentDocument.readyState !== 'complete') {
//             // Method 2: Remove and reinsert the iframe
//             const clone = iframe.cloneNode(true);
//             iframe.parentNode.replaceChild(clone, iframe);
  
//             setTimeout(() => {
//               if (clone.contentDocument.readyState !== 'complete') {
//                 // Method 3: Navigate to about:blank, then back to the original URL
//                 clone.src = 'about:blank';
//                 setTimeout(() => {
//                   clone.src = originalSrc;
//                 }, 500);
//               }
//             }, 500);
//           }
//         }, 500);
//       });
//     };
  
//     document.body.appendChild(button);
//   }
  
//   window.onload = () => {
//     const iframes = document.getElementsByTagName('iframe');
//     if (iframes.length > 0) {
//       addRefreshButton();
//     }
//   };
  