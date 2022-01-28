import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import masonry from "vue-next-masonry";
import { plugin as VueTippy, setDefaultProps } from "vue-tippy";
import "./index.css";
import "tippy.js/dist/tippy.css"; // optional for styling

setDefaultProps({
	placement: "auto",
});

createApp(App).use(router).use(masonry).use(VueTippy).mount("#app");
