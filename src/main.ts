import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import Particles from "vue3-particles";
import decode from "./../plugins/decode";
import globalComponents from "./global-components";

const app = createApp(App);

app.use(globalComponents);

app.use(decode);
app.use(Particles);
app.mount("#app");
