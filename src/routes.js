import { createWebHistory, createRouter } from "vue-router";
import User from "./pages/User.vue";
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
				name: "user_modal",
			},
		],
	},
	{
		path: "/search",
		component: Search,
		name: "search",
		children: [
			{
				path: "p/:id",
				component: Modal,
				name: "search_modal",
			},
		],
	},
	{
		path: "/likes",
		component: Likes,
		name: "likes",
		children: [
			{
				path: "p/:id",
				component: Modal,
				name: "likes_modal",
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
