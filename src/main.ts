import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import Particles from "vue3-particles";
import { defineAsyncComponent } from "vue";

const app = createApp(App);

app.component(
  "BaseIcon",
  defineAsyncComponent(() => import("../src/components/base/Icon.vue"))
);

app.component(
  "BaseLoader",
  defineAsyncComponent(() => import("../src/components/base/Loader.vue"))
);

app.component(
  "BaseInputFile",
  defineAsyncComponent(() => import("../src/components/base/InputFile.vue"))
);

app.component(
  "BaseInputSearch",
  defineAsyncComponent(() => import("../src/components/base/InputSearch.vue"))
);

app.use(Particles);
app.mount("#app");
