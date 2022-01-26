// const moreMedia = async (token) => {
// 	loading.value = true;

// 	await api
// 		.get(
// 			`2/users/${userId.value}/tweets?${search_params}&pagination_token=${token}`
// 		)
// 		.then((res) => {
// 			if (res.data.errors) {
// 				message.value = res.data.errors[0].detail;
// 				loading.value = false;
// 				return;
// 			}
// 			if (!res.data.hasOwnProperty("includes")) {
// 				next_token.value = res.data.meta.next_token;
// 				result_count.value = res.data.meta.result_count;
// 				message.value = `No photo found in ${result_count.value} tweets. Try to increase number of tweets`;
// 				loading.value = false;
// 				return;
// 			}

// 			if (res.data.hasOwnProperty("meta")) {
// 				result_count.value += res.data.meta.result_count;
// 				next_token.value = res.data.meta.next_token;
// 				console.log(next_token.value);
// 			} else {
// 				result_count.value = num_of_results.value;
// 			}

// 			let tweets = res.data.data;
// 			let media = res.data.includes.media;

// 			media.forEach((img) => {
// 				if (img.type == "photo") {
// 					photos.value.push(img.url);
// 				}
// 			});

// 			let videoTweets = TweetsWithVideo(tweets, media);

// 			videoTweets.forEach(async (tweet) => {
// 				let video = await getVideo(tweet.id);
// 				videos.value.push(video);
// 			});

// 			loading.value = false;

// 			loading.value = false;
// 		});
// };
