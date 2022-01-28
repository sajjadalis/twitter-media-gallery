const TweetsWithVideo = (tweets, media) => {
	let props = ["id", "text", "created_at", "username"];
	let result = tweets
		.filter(function (o1) {
			// filter out (!) items in media
			return media.some(function (o2) {
				if (
					o1.hasOwnProperty("attachments") &&
					o1.attachments.hasOwnProperty("media_keys")
				) {
					if (o2.type == "video" || o2.type == "animated_gif") {
						return o1.attachments.media_keys.includes(o2.media_key);
					}
				}
			});
		})
		.map(function (o) {
			// use reduce to make objects with only the requiblue properties
			return props.reduce(function (newo, id) {
				newo[id] = o[id];
				return newo;
			}, {});
		});
	return result;
};

export default TweetsWithVideo;
