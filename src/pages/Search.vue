<template>
	<form @submit.prevent="getMedia()" class="flex">
		<div class="relative flex-1 mr-2">
			<input
				type="text"
				name="twt_usr"
				data-lpignore="true"
				placeholder="#hashtag / #multiple #hashtags / simple keyword"
				class="w-full focus:shadow-red-500"
				v-model="query"
			/>
			<span
				class="absolute top-0 right-0 mt-3 mr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
				@click.prevent="query = ''"
			>
				<svg
					v-if="query"
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</div>
		<div class="w-40 mr-2">
			<input
				type="number"
				class="w-full"
				placeholder="Tweets (5 to 100)"
				v-model="num_of_results"
			/>
		</div>
		<div class="w-40">
			<button
				type="submit"
				class="uppercase font-bold bg-red-500 text-white py-2 px-4 w-full"
			>
				Get Media
			</button>
		</div>
	</form>

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
import api from "../composeables/api";
import TweetsWithVideo from "../composeables/TweetsWithVideo";
import TweetsWithPhotos from "../composeables/TweetsWithPhotos";
import getVideo from "../composeables/getVideo";

export default {
	components: {
		TabsContent,
		SearchHistory,
	},
	setup() {
		const query = ref("#meme");
		const num_of_results = ref(50);
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

			let search_params = `query=${q}&max_results=${num_of_results.value}&tweet.fields=created_at&expansions=attachments.media_keys&media.fields=media_key,preview_image_url,url`;

			if (token) {
				search_params = `query=${q}&max_results=${num_of_results.value}&expansions=attachments.media_keys&tweet.fields=id,created_at,text&media.fields=media_key,preview_image_url,url&pagination_token=${token}`;
			}

			// console.log(search_params);
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

					let tweets = res.data.data;
					let media = res.data.includes.media;

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
