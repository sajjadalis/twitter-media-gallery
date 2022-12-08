import api from "./api";

const getVideo = async (tweet) => {
	let data;
	await api.get(`/extended_tweet/${tweet}`).then((res) => {
		// data = res.data;
		// check if extended objects exists containing video urls
		if (res.data.extended_entities) {
			// get array of all video variants
			let videoArr = res.data.extended_entities.media[0].video_info.variants;
			// let find only mp4 files and push them to new videos array
			let videos = [];
			videoArr.forEach((v) => {
				if (v.content_type == "video/mp4") {
					videos.push(v);
				}
			});
			// time to get video with higher bitrate
			let video_with_higher_bitrate = videos.reduce(function (prev, current) {
				return prev.bitrate > current.bitrate ? prev : current;
			});
			// console.log(video_with_higher_bitrate);
			// get video sizes
			let sizes = res.data.extended_entities.media[0].sizes;
			// create image url object
			let image = {
				image: res.data.extended_entities.media[0].media_url_https,
			};
			// create new object with each vide, sizes & image url
			let newObj = {
				...video_with_higher_bitrate,
				...sizes,
				...image,
			};
			// push newly created object to videos array
			data = newObj;
		}
	});

	return data;
};

export default getVideo;
