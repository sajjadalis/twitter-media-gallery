const TweetsWithMedia = (tweets, media) => {
	let TweetWithMedia = [];
	tweets.filter(function (o1) {
		// filter out (!) items in media
		return media.some(function (o2) {
			if (
				o1.hasOwnProperty("attachments") &&
				o1.attachments.hasOwnProperty("media_keys")
			) {
				if (o1.attachments.media_keys.includes(o2.media_key)) {
					let merged = { ...o1, ...o2 };
					TweetWithMedia.push(merged);
					// return merged;
				}
			}
		});
	});

	return TweetWithMedia;
};

export default TweetsWithMedia;
