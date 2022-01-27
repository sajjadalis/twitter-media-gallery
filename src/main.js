import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import masonry from "vue-next-masonry";
import "./index.css";

createApp(App).use(router).use(masonry).mount("#app");
