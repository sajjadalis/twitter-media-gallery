import axios from "axios";

// let access_token = process.env.VUE_APP_TWITTER_TOKEN;
let access_token = import.meta.env.VITE_TWITTER_TOKEN;

const api = axios.create({
	baseURL: "https://ctvf-cors.herokuapp.com/https://api.twitter.com/",
	headers: {
		Authorization: `Bearer ${access_token}`,
	},
});

export default api;
