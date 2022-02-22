<template>
	<Form
		v-model:query="form.query"
		v-model:items.number="form.items"
		v-model:retweets="form.retweets"
		v-model:replies="form.replies"
		@search="getQuery()"
	/>

	<SearchHistory
		:history="hashtag_history"
		type="hashtag_history"
		@media="historyClick"
	/>

	<CacheNotification
		:cache="cache"
		:cached_on="cached_on"
		@refresh="getMedia"
	/>

	<TabsContent
		:photos="photos"
		:videos="videos"
		:user="form.query"
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
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, reactive } from "vue";

import Form from "../components/Form.vue";
import SearchHistory from "../components/SearchHistory.vue";
import TabsContent from "../components/TabsContent.vue";
import CacheNotification from "../components/CacheNotification.vue";

import api from "../composeables/api";
import TweetsWithVideo from "../composeables/TweetsWithVideo";
import TweetsWithPhotos from "../composeables/TweetsWithPhotos";
import getVideo from "../composeables/getVideo";
import getData from "../composeables/getData";

export default {
	components: {
		Form,
		SearchHistory,
		TabsContent,
		CacheNotification,
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const form = ref({
			query: route.query.q,
			items: 100,
			retweets: false,
			replies: true,
		});
		const message = ref(null);
		const loading = ref(false);
		const hashtag_history = ref([]);

		const {
			localData,
			cache,
			cached_on,
			next_token,
			photos,
			videos,
			result_count,
		} = getData();

		onMounted(async () => {
			let history = JSON.parse(localStorage.getItem("hashtag_history"));

			if (history) {
				hashtag_history.value = history;
			}

			if (form.value.query) {
				localData(form.value.query, "search", getMedia);
			}
		});

		const historyClick = async (val) => {
			router.push({
				name: "search",
				query: { q: val },
			});
			form.value.query = val;
			localData(form.value.query, "search", getMedia);
		};

		const getQuery = async () => {
			router.push({
				name: "search",
				query: { q: form.value.query },
			});
			// await getMedia();
			localData(form.value.query, "search", getMedia);
		};

		const getMedia = async (token) => {
			cache.value = false;
			loading.value = true;

			// Display error if number of tweets are less than 5 or bigger than 100. Twitter limit
			if (form.value.items < 5 || form.value.items > 100) {
				message.value =
					"Number of results value can not be less than 5 or higher than 100";
				loading.value = false;
				return;
			}

			if (!form.value.query) {
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
				!hashtag_history.value.includes(form.value.query)
			) {
				hashtag_history.value.push(form.value.query);
				localStorage.setItem(
					"hashtag_history",
					JSON.stringify(hashtag_history.value)
				);
			}

			let q = form.value.query;
			q = q.replace(/#/g, "%23");
			q = q.replace(" ", "+");

			let exclude = " -is:retweet -is:reply";
			if (form.value.retweets && form.value.replies) {
				exclude = "";
			} else if (form.value.retweets) {
				exclude = " -is:reply";
			} else if (form.value.replies) {
				exclude = " -is:retweet";
			}

			let params = `query=${q + exclude}&max_results=${
				form.value.items
			}&tweet.fields=created_at,author_id,public_metrics&expansions=attachments.media_keys,author_id&media.fields=media_key,preview_image_url,url`;

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
						result_count.value = form.value.items;
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

					const search = reactive({});

					// Make api request for each tweet via tweet id & get videos data
					// Add each video object to videos array
					if (videoTweets.length > 0) {
						var videosProcessed = 0;
						videoTweets.forEach(async (tweet, index, array) => {
							let video = await getVideo(tweet.id);
							video.id = tweet.id;
							video.text = tweet.text;
							video.created_at = tweet.created_at;
							video.username = tweet.username;
							videos.value.push(video);

							videosProcessed++;
							if (videosProcessed === array.length) {
								search.cached_on = new Date();
								search.tweets_count = result_count.value;
								search.photos = photos.value;
								search.videos = videos.value;
								localStorage.setItem(
									"q_" + form.value.query,
									JSON.stringify(search)
								);
							}
						});
					} else {
						search.cached_on = new Date();
						search.tweets_count = result_count.value;
						search.photos = photos.value;
						search.videos = videos.value;
						localStorage.setItem(
							"q_" + form.value.query,
							JSON.stringify(search)
						);
					}

					loading.value = false;
				})
				.catch((err) => {
					error.value = err.message;
					console.log(error.value);
				});
		};

		return {
			form,
			photos,
			videos,
			loading,
			next_token,
			result_count,
			message,
			cache,
			cached_on,
			hashtag_history,
			historyClick,
			getQuery,
			getMedia,
		};
	},
};
</script>
