const fetch = require("node-fetch");
require("dotenv").config();

const token = process.env.TWITTER_TOKEN;
const config = { headers: { authorization: `Bearer ${token}` } };

const userInfo = async (req, res) => {
	await fetch(
		`https://api.twitter.com/1.1/users/show.json?screen_name=${req.params.username}`,
		config
	)
		.then((response) => response.json())
		.then(async (user) => {
			if (user.errors && user.errors.length > 0) {
				return res.status(400).json(user.errors);
			}

			res.json(user);
		});
};

const userMedia = async (req, res) => {
	let pagination_token = req.query.pagination_token
		? `&pagination_token=${req.query.pagination_token}`
		: "";
	let items = req.query.items ? req.query.items : "10";
	let exclude = req.query.exclude;
	exclude = exclude_params("user", exclude);
	let params = `${exclude}max_results=${items}&tweet.fields=id,created_at,text,public_metrics,attachments,referenced_tweets&expansions=attachments.media_keys&media.fields=media_key,type,url,preview_image_url${pagination_token}`;

	await fetch(
		`https://api.twitter.com/2/users/${req.params.userId}/tweets?${params}`,
		config
	)
		.then((response) => response.json())
		.then((data) => {
			if (data.errors && data.errors.length > 0) {
				return res.status(400).json(data.errors);
			}

			res.json(data);
		});
};

const searchMedia = async (req, res) => {
	let q = req.query.q;
	q = q.replace(/#/g, "%23");
	q = q.replace(" ", "+");

	let pagination_token = req.query.pagination_token
		? `&pagination_token=${req.query.pagination_token}`
		: "";

	let items = req.query.items ? req.query.items : "10";
	let exclude = req.query.exclude;
	exclude = exclude_params("search", exclude);

	let params = `query=${
		q + exclude
	}&max_results=${items}&tweet.fields=created_at,author_id,public_metrics&expansions=attachments.media_keys,author_id&media.fields=media_key,preview_image_url,url${pagination_token}`;

	await fetch(
		`https://api.twitter.com/2/tweets/search/recent?${params}`,
		config
	)
		.then((response) => response.json())
		.then((data) => {
			if (data.errors && data.errors.length > 0) {
				return res.status(400).json(data.errors);
			}

			res.json(data);
		});
};

const extendedTweet = async (req, res) => {
	await fetch(
		`https://api.twitter.com/1.1/statuses/show/${req.params.id}.json?tweet_mode=extended`,
		config
	)
		.then((response) => response.json())
		.then((data) => {
			if (data.errors && data.errors.length > 0) {
				return res.status(400).json(data.errors);
			}

			res.json(data);
		});
};

const exclude_params = (type, value) => {
	if (type == "user") {
		switch (value) {
			case "retweets,replies":
				value = "exclude=retweets,replies&";
				break;
			case "replies":
				value = "exclude=replies&";
				break;
			case "retweets":
				value = "exclude=retweets&";
				break;
			default:
				value = "";
		}

		return value;
	}

	if (type == "search") {
		switch (value) {
			case "retweets,replies":
				value = " -is:retweet -is:reply";
				break;
			case "replies":
				value = " -is:reply";
				break;
			case "retweets":
				value = " -is:retweet";
				break;
			default:
				value = "";
		}

		return value;
	}
};

module.exports = { userInfo, userMedia, searchMedia, extendedTweet };
