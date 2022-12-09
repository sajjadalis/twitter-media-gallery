const express = require("express");
const routes = express.Router();
const {
	userInfo,
	userMedia,
	extendedTweet,
	searchMedia,
} = require("./controllers/tweetsController");
require("dotenv").config();

routes.get("/", (req, res) => {
	res.json({
		status: "Express Server is running",
		userInfo_endpoint: "/username/{username_here}",
		userTimeline_endpoint: "/tweets/{user_id}",
		search_endpoint: "/search?q={query_string}",
	});
});
routes.get("/username/:username", userInfo);
routes.get("/tweets/:userId", userMedia);
routes.get("/extended_tweet/:id", extendedTweet);
routes.get("/search", searchMedia);

module.exports = routes;
