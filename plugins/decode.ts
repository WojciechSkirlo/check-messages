import type { App } from "vue";
declare module "vue" {
  interface ComponentCustomProperties {
    /**
     * This function retrun decoded string
     * @param {string} text string you want to decode
     * @returns {string} returns decoded string
     */
    $decode: (text: string) => string;
  }
}

export default {
  install(app: App) {
    app.config.globalProperties.$decode = (text: string) => new TextDecoder().decode(new Uint8Array(text.split("").map((r: any) => r.charCodeAt())));
  },
};
