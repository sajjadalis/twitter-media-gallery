const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

let access_token = process.env.TWITTER_TOKEN;

const api = axios.create({
	baseURL: "https://api.twitter.com/",
	headers: {
		Authorization:
			"Bearer AAAAAAAAAAAAAAAAAAAAALGYOAEAAAAARPkH3daFKBtyeS6jXu%2F2%2FNZhGxw%3DhBp6ZhlRhwirtPtpMbxmcUe8VpOUv15C69Q4fytV62ICKz61Cs",
	},
});

module.exports = api;
