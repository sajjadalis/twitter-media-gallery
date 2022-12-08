const express = require("express");
const routes = express.Router();
const {
	userInfo,
	userMedia,
	extendedTweet,
	searchMedia,
} = require("./controllers/tweetsController");
require("dotenv").config();

routes.get("/username/:username", userInfo);
routes.get("/tweets/:userId", userMedia);
routes.get("/extended_tweet/:id", extendedTweet);
routes.get("/search", searchMedia);

module.exports = routes;
