<template>
	<Form
		v-model="query"
		:num_of_results="num_of_results"
		:include="include"
		placeholder="#hashtag / #multiple #hashtags / simple keyword"
		@search="getMedia()"
	/>

	<SearchHistory
		:search_history="hashtag_history"
		@media="historyClick"
		@remove="removeHistory"
		@clear="clearHistory"
	/>

	<TabsContent
		:photos="photos"
		:videos="videos"
		:user="query"
		:result_count="result_count"
	/>

	<div v-if="loading" class="spinner my-10 mx-auto"></div>

	<div
		class="my-5 w-full text-white bg-indigo-500 px-5 py-3 font-bold text-lg"
		v-if="message"
	>
		{{ message }}
	</div>

	<div
		class="my-5 w-full text-red-500 border-4 border-red-500 text-center p-2 font-bold text-lg"
		v-if="photos.length || videos.length"
	>
		<span v-if="photos.length">{{ photos.length }} photos</span>
		<span v-if="videos.length"> & {{ videos.length }} videos</span> found in
		{{ result_count }} tweets
	</div>

	<button
		v-if="next_token"
		@click.prevent="getMedia(next_token)"
		class="w-full text-white bg-red-500 hover:bg-red-600 p-3 uppercase font-bold mb-5"
	>
		Load More
	</button>
</template>

<script>
import { onMounted, ref } from "vue";
import SearchHistory from "../components/SearchHistory.vue";
import TabsContent from "../components/TabsContent.vue";
import Form from "../components/Form.vue";
import api from "../composeables/api";
import TweetsWithVideo from "../composeables/TweetsWithVideo";
import TweetsWithPhotos from "../composeables/TweetsWithPhotos";
import getVideo from "../composeables/getVideo";

export default {
	components: {
		TabsContent,
		SearchHistory,
		Form,
	},
	setup() {
		const query = ref("#meme");
		const num_of_results = ref(50);
		const include = ref({ retweets: false, replies: true });
		const photos = ref([]);
		const videos = ref([]);
		const next_token = ref(null);
		const result_count = ref(0);
		const message = ref(null);
		const loading = ref(false);
		const hashtag_history = ref([]);

		onMounted(() => {
			let history = JSON.parse(localStorage.getItem("hashtag_history"));

			if (history) {
				hashtag_history.value = history;
			}
		});

		const historyClick = async (val) => {
			query.value = val;
			await getMedia();
		};

		const removeHistory = (i) => {
			hashtag_history.value.splice(i, 1);
			localStorage.setItem(
				"hashtag_history",
				JSON.stringify(hashtag_history.value)
			);
		};

		const clearHistory = () => {
			localStorage.removeItem("hashtag_history");
			hashtag_history.value = [];
		};

		const getMedia = async (token) => {
			loading.value = true;

			// Display error if number of tweets are less than 5.
			// Twitter API minimum search limit = 5
			if (num_of_results.value < 5) {
				message.value = "Minimum results for tweets can not be less than 5";
				loading.value = false;
				return;
			}

			if (!query.value) {
				message.value = "Please set a query";
				loading.value = false;
				return;
			}

			if (!token) {
				message.value = "";
				photos.value = [];
				videos.value = [];
				result_count.value = 0;
			}

			if (
				hashtag_history.value &&
				!hashtag_history.value.includes(query.value)
			) {
				hashtag_history.value.push(query.value);
				localStorage.setItem(
					"hashtag_history",
					JSON.stringify(hashtag_history.value)
				);
			}

			let q = query.value;
			q = q.replace(/#/g, "%23");
			q = q.replace(" ", "+");

			let exclude = " -is:retweet -is:reply";
			if (include.value.retweets && include.value.replies) {
				exclude = "";
			} else if (include.value.retweets) {
				exclude = " -is:reply";
			} else if (include.value.replies) {
				exclude = " -is:retweet";
			}

			let params = `query=${q + exclude}&max_results=${
				num_of_results.value
			}&tweet.fields=created_at,author_id&expansions=attachments.media_keys,author_id&media.fields=media_key,preview_image_url,url`;

			let search_params = params;

			if (token) {
				search_params = `${params}&pagination_token=${token}`;
			}

			await api
				.get(`2/tweets/search/recent?${search_params}`)
				.then((res) => {
					if (res.data.errors) {
						message.value = res.data.errors[0].detail;
						loading.value = false;
						return;
					}

					if (!res.data.hasOwnProperty("includes")) {
						result_count.value += res.data.meta.result_count;
						next_token.value = res.data.meta.next_token;
						message.value = `No photo/video found. Try to increase number of tweets or load more`;
						loading.value = false;
						return;
					} else {
						message.value = "";
					}

					if (res.data.hasOwnProperty("meta")) {
						result_count.value += res.data.meta.result_count;
						next_token.value = res.data.meta.next_token;
					} else {
						result_count.value = num_of_results.value;
					}

					let tweets = [];
					let media = res.data.includes.media;

					let tempTweets = res.data.data;
					let tempUsers = res.data.includes.users;

					tempTweets.forEach((x) => {
						tempUsers.forEach((y) => {
							if (x.author_id === y.id) {
								delete y.id;
								tweets.push({ ...x, ...y });
							}
						});
					});

					// Get tweets with photo and tweet text
					let photoTweets = TweetsWithPhotos(tweets, media);
					photoTweets.forEach((tweet) => {
						photos.value.push(tweet);
					});

					// Get tweet id's which contains video and animated gif's
					let videoTweets = TweetsWithVideo(tweets, media);

					// Make api request for each tweet via tweet id & get videos data
					// Add each video object to videos array
					videoTweets.forEach(async (tweet) => {
						let video = await getVideo(tweet.id);
						video.id = tweet.id;
						video.text = tweet.text;
						video.created_at = tweet.created_at;
						video.username = tweet.username;
						videos.value.push(video);
					});

					loading.value = false;
				})
				.catch((err) => {
					error.value = err.message;
					console.log(error.value);
				});
		};

		return {
			query,
			num_of_results,
			include,
			photos,
			videos,
			loading,
			next_token,
			result_count,
			message,
			getMedia,
			hashtag_history,
			historyClick,
			removeHistory,
			clearHistory,
		};
	},
};
</script>
