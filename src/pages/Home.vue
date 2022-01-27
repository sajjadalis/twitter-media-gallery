<template>
	<form @submit.prevent="getMedia()" class="flex">
		<div class="relative flex-1 mr-2">
			<input
				type="text"
				name="twt_usr"
				data-lpignore="true"
				placeholder="Twitter Username"
				class="w-full focus:shadow-red-500"
				v-model="user"
			/>
			<span
				class="absolute top-0 right-0 mt-3 mr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
				@click.prevent="user = ''"
			>
				<svg
					v-if="user"
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
		<div class="relative mr-2">
			<label class="absolute top-0 -mt-5 text-2xs">Retweets</label>
			<input
				type="checkbox"
				v-model="include.retweets"
				class="text-red-500 w-10 h-10"
			/>
		</div>
		<div class="relative mr-2">
			<label class="absolute top-0 -mt-5 text-2xs">Replies</label>
			<input
				type="checkbox"
				v-model="include.replies"
				class="text-red-500 w-10 h-10"
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
		:search_history="search_history"
		@media="historyClick"
		@remove="removeHistory"
		@clear="clearHistory"
	/>

	<UserCard />

	<TabsContent
		:photos="photos"
		:videos="videos"
		:user="user"
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
import getUserID from "../composeables/getUserID";
import TweetsWithVideo from "../composeables/TweetsWithVideo";
import TweetsWithPhotos from "../composeables/TweetsWithPhotos";
import getVideo from "../composeables/getVideo";
import UserCard from "../components/UserCard.vue";

export default {
	components: {
		TabsContent,
		SearchHistory,
		UserCard,
	},
	setup() {
		const user = ref("BBCEarth");
		const num_of_results = ref(50);
		const photos = ref([]);
		const videos = ref([]);
		const include = ref({});
		const next_token = ref(null);
		const result_count = ref(0);
		const message = ref(null);
		const loading = ref(false);
		const search_history = ref([]);

		onMounted(() => {
			let history = JSON.parse(localStorage.getItem("search_history"));

			if (history) {
				search_history.value = history;
			}
		});

		const historyClick = async (val) => {
			user.value = val;
			await getMedia();
		};

		const removeHistory = (i) => {
			search_history.value.splice(i, 1);
			localStorage.setItem(
				"search_history",
				JSON.stringify(search_history.value)
			);
		};

		const clearHistory = () => {
			localStorage.removeItem("search_history");
			search_history.value = [];
		};

		const { userId, error, loadUserID } = getUserID();

		const getMedia = async (token) => {
			loading.value = true;

			// Display error if number of tweets are less than 5.
			// Twitter API minimum search limit = 5
			if (num_of_results.value < 5) {
				message.value = "Minimum results for tweets can not be less than 5";
				loading.value = false;
				return;
			}

			if (!user.value) {
				message.value = "Please set a username";
				loading.value = false;
				return;
			}

			if (!token) {
				message.value = "";
				photos.value = [];
				videos.value = [];
				result_count.value = 0;
				await loadUserID(user.value);
			}

			if (search_history.value && !search_history.value.includes(user.value)) {
				search_history.value.push(user.value);
				localStorage.setItem(
					"search_history",
					JSON.stringify(search_history.value)
				);
			}

			let exclude = "exclude=retweets,replies&";
			if (include.value.retweets && include.value.replies) {
				exclude = "";
			} else if (include.value.retweets) {
				exclude = "exclude=replies&";
			} else if (include.value.replies) {
				exclude = "exclude=retweets&";
			}

			let search_params = `${exclude}max_results=${num_of_results.value}&tweet.fields=id,created_at,text,attachments&expansions=attachments.media_keys&media.fields=media_key,type,url,preview_image_url`;

			if (token) {
				search_params = `${exclude}max_results=${num_of_results.value}&tweet.fields=attachments&expansions=attachments.media_keys&media.fields=media_key,type,url,preview_image_url&pagination_token=${token}`;
			}

			await api
				.get(`2/users/${userId.value}/tweets?${search_params}`)
				.then((res) => {
					if (res.data.errors) {
						message.value = res.data.errors[0].detail;
						loading.value = false;
						return;
					}

					if (!res.data.hasOwnProperty("includes")) {
						result_count.value += res.data.meta.result_count;
						next_token.value = res.data.meta.next_token;
						message.value = `No photo found in ${result_count.value} tweets. Try to increase number of tweets`;
						loading.value = false;
						return;
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
			user,
			num_of_results,
			photos,
			videos,
			include,
			loading,
			next_token,
			result_count,
			message,
			getMedia,
			search_history,
			historyClick,
			removeHistory,
			clearHistory,
		};
	},
};
</script>
