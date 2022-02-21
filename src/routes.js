import { createWebHistory, createRouter } from "vue-router";
import User from "./pages/User.vue";
import UserNew from "./pages/UserNew.vue";
import Search from "./pages/Search.vue";
import Likes from "./pages/Likes.vue";
import Modal from "./components/Modal.vue";

const routes = [
	{
		path: "/",
		component: User,
		name: "user",
		children: [
			{
				path: "p/:id",
				component: Modal,
				name: "modal",
			},
		],
	},
	{
		path: "/user",
		component: UserNew,
		name: "usernew",
	},
	// { path: "/:user", component: User },
	{ path: "/search", component: Search, name: "search" },
	{ path: "/likes", component: Likes },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
