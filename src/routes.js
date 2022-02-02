import { createWebHistory, createRouter } from "vue-router";
import User from "./pages/User.vue";
import Search from "./pages/Search.vue";
import Likes from "./pages/Likes.vue";

const routes = [
	{ path: "/", component: User, name: "user" },
	// { path: "/:user", component: User },
	{ path: "/search", component: Search, name: "search" },
	{ path: "/likes", component: Likes },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
