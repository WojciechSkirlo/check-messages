import type { App } from "vue";
export default {
  install(app: App) {
    /**
     * This function retrun decoded string
     * @param {string} text string you want to decode
     * @returns {string}
     */
    app.config.globalProperties.$decode = (text: string) => new TextDecoder().decode(new Uint8Array(text.split("").map((r: any) => r.charCodeAt())));
  },
};
