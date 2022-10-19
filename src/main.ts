import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import Particles from "vue3-particles";

const app = createApp(App);
app.use(Particles);
app.mount("#app");
