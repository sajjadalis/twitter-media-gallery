const express = require("express");
const userRoute = express.Router();
const fetch = require("node-fetch");
require("dotenv").config();

let access_token = process.env.TWITTER_TOKEN;

userRoute.get("/:id", async (req, res) => {
	let exclude = req.query.exclude;

	switch (exclude) {
		case "retweets,replies":
			exclude = "exclude=retweets,replies&";
			break;
		case "replies":
			exclude = "exclude=replies&";
			break;
		case "retweets":
			exclude = "exclude=retweets&";
			break;
		default:
			exclude = "";
	}

	let tweets = req.query.tweets ? req.query.tweets : "10";

	let params = `${exclude}max_results=${tweets}&tweet.fields=id,created_at,text,public_metrics,attachments,referenced_tweets&expansions=attachments.media_keys&media.fields=media_key,type,url,preview_image_url`;

	console.log(params);

	await fetch(
		`https://api.twitter.com/2/users/${req.params.id}/tweets?${params}`,
		{
			headers: {
				authorization: `Bearer ${access_token}`,
			},
		}
	)
		.then((response) => response.json())
		.then((data) => {
			res.send(data);
		});
});

module.exports = userRoute;
