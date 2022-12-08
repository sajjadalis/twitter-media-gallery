import axios from "axios";

let url = import.meta.env.VITE_URL;
let token = import.meta.env.VITE_TWITTER_TOKEN;

const api = axios.create({
	baseURL: url,
	headers: { Authorization: `Bearer ${token}` },
});

export default api;
