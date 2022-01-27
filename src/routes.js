import { createWebHistory, createRouter } from "vue-router";
import Home from "./pages/Home.vue";
import HashtagSearch from "./pages/HashtagSearch.vue";

const routes = [
	{ path: "/", component: Home },
	{ path: "/hashtags", component: HashtagSearch },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
