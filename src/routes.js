import { createWebHistory, createRouter } from "vue-router";
import UserTimeline from "./pages/UserTimeline.vue";
import Search from "./pages/Search.vue";

const routes = [
	{ path: "/", component: UserTimeline },
	{ path: "/search", component: Search },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
