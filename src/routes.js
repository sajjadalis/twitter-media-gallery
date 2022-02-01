import { createWebHistory, createRouter } from "vue-router";
import UserTimeline from "./pages/UserTimeline.vue";
import Search from "./pages/Search.vue";
import Likes from "./pages/Likes.vue";

const routes = [
	{ path: "/", component: UserTimeline },
	{ path: "/search", component: Search },
	{ path: "/likes", component: Likes },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
