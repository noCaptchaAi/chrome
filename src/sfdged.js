// function escapeCssSelector(selector) {
//     return selector.replace(/[!"#$%&'()*+,./:;<=>?@[\]^`{|}~]/g, '\\$&');
// }

// var csspath = 'input#15:form:captchaPanel:captchaImagePanel:captchaInput:topWrapper:inputWrapper:input';
// console.log(escapeCssSelector(csspath));
// console.log(document.querySelector(escapeCssSelector(csspath)));

function escapeCssSelector(selector) {
    return selector.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
  }
  var csspath = 'input#15:form:captchaPanel:captchaImagePanel:captchaInput:topWrapper:inputWrapper:input';
console.log(escapeCssSelector(csspath));
console.log(document.querySelector(escapeCssSelector(csspath)));
