import { datadomeSTT, simulateTyping } from "./utils";
let settings = await chrome.storage.sync.get(null);
(() => {
  if (!settings.apikey || !settings.power || !settings.datadome) return;
  function track() {
    const t = document.querySelector(".audio-captcha-track");
    if (!t) return;
    return t.src;
  }

  class DD {
    static AudioBtn() {
      const a = document.querySelector("#captcha__audio__button");
      if (!a) return false;
      return true;
    }
    static clickAudio() {
      if (!DD.AudioBtn()) {
        return;
      }
      document.querySelector("#captcha__audio__button").click();
    }
    static onAudioFrame() {
      const l = document.querySelector("#captcha__audio__button");
      if (!l) return;
      // console.log(l.classList.contains("toggled"));
      return l.classList.contains("toggled");
    }
  }
  async function handleSpeechFrame() {
    if (DD.onAudioFrame()) {
      // console.log(track());
      const audio = track();
      if (audio === previousAudio) {
        return;
      }
      previousAudio = audio;
      const audioapi = "https://beta.nocaptchaai.com/solve";
      const [text, id] = await datadomeSTT(audioapi, settings.apikey, audio);
      if (!text != "") return;

      // console.log(text, "text");
      const container = document.querySelector(
        ".audio-captcha-input-container"
      );
      const inputs = container.querySelectorAll("input");
      if (!container || !inputs) return;

      try {
        if (inputs.length === text.length) {
          // for (let i = 0; i < inputs.length; i++) {
          //   inputs[i].value = text[i];
          // }
          for (let i = 0; i < inputs.length; i++) {
            simulateTyping(inputs[i], text[i]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  let previousAudio = null;

  (async () => {
    while (true) {
      await new Promise((r) => setTimeout(r, 1000));
      if (!DD.AudioBtn()) break;

      // console.log("AudioBtn", DD.AudioBtn());

      if (DD.AudioBtn()) {
        //   console.log("click", DD.AudioBtn());
        DD.clickAudio();

        if (DD.onAudioFrame()) {
          // console.log(track());
          await handleSpeechFrame();
        }
      }
    }
  })();
})();
