declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    BaseButton: typeof import("./components/base/Button.vue")["default"];
    BaseIcon: typeof import("./components/base/Icon.vue")["default"];
    BaseInputFile: typeof import("./components/base/InputFile.vue")["default"];
    BaseInputSearch: typeof import("./components/base/InputSearch.vue")["default"];
    BaseLoader: typeof import("./components/base/Loader.vue")["default"];
  }
}

export const BaseButton: typeof import("./components/base/Button.vue")["default"];
export const BaseIcon: typeof import("./components/base/Icon.vue")["default"];
export const BaseInputFile: typeof import("./components/base/InputFile.vue")["default"];
export const BaseInputSearch: typeof import("./components/base/InputSearch.vue")["default"];
export const BaseLoader: typeof import("./components/base/Loader.vue")["default"];
