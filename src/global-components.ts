import { defineAsyncComponent } from "vue";
import type { App } from "vue";

const BaseIcon = defineAsyncComponent(() => import("@/components/base/Icon.vue"));
const BaseLoader = defineAsyncComponent(() => import("@/components/base/Loader.vue"));
const BaseInputFile = defineAsyncComponent(() => import("@/components/base/InputFile.vue"));
const BaseInputSearch = defineAsyncComponent(() => import("@/components/base/InputSearch.vue"));
const BaseButton = defineAsyncComponent(() => import("@/components/base/Button.vue"));

export default function (app: App) {
  app.component("BaseIcon", BaseIcon);
  app.component("BaseLoader", BaseLoader);
  app.component("BaseInputFile", BaseInputFile);
  app.component("BaseInputSearch", BaseInputSearch);
  app.component("BaseButton", BaseButton);
}
