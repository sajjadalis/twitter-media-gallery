<template>
	<Form
		v-model="user"
		:num_of_results="num_of_results"
		:include="include"
		placeholder="Twitter Username"
		@search="getUser()"
	/>

	<SearchHistory
		:history="user_history"
		type="user_history"
		@media="historyClick"
	/>

	<CacheNotification
		:cache="cache"
		:cached_on="cached_on"
		@refresh="getMedia"
	/>

	<UserCard v-if="Object.keys(userDetails).length !== 0" :user="userDetails" />

	<TabsContent
		:photos="photos"
		:videos="videos"
		:user="user"
		:result_count="result_count"
	/>

	<div v-if="loading" class="spinner my-10 mx-auto"></div>

	<div
		class="mt-5 w-full text-white bg-indigo-500 px-5 py-3 font-bold text-lg"
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
import { onMounted, reactive, ref } from "vue";

import Form from "../components/Form.vue";
import SearchHistory from "../components/SearchHistory.vue";
import UserCard from "../components/UserCard.vue";
import TabsContent from "../components/TabsContent.vue";
import CacheNotification from "../components/CacheNotification.vue";

import api from "../composeables/api";
import getUserInfo from "../composeables/getUserInfo";
import TweetsWithVideo from "../composeables/TweetsWithVideo";
import TweetsWithPhotos from "../composeables/TweetsWithPhotos";
import getVideo from "../composeables/getVideo";
import getData from "../composeables/getData";
export default {
	components: {
		Form,
		SearchHistory,
		UserCard,
		TabsContent,
		CacheNotification,
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const num_of_results = ref(100);
		const include = ref({ retweets: false, replies: true });
		const user = ref(route.query.u);
		const user_history = ref([]);
		const message = ref(null);
		const loading = ref(false);

		const {
			localData,
			cache,
			cached_on,
			next_token,
			photos,
			videos,
			userDetails,
			result_count,
		} = getData();

		onMounted(() => {
			let history = JSON.parse(localStorage.getItem("user_history"));

			if (history) {
				user_history.value = history;
			}

			if (user.value) {
				localData(user.value, "user", getMedia);
			}
		});

		const historyClick = async (val) => {
			router.push({
				name: "user",
				query: { u: val },
			});
			user.value = val;
			localData(user.value, "user", getMedia);
		};

		const getUser = async () => {
			router.push({
				name: "user",
				query: { u: user.value },
			});
			// await getMedia();
			localData(user.value, "user", getMedia);
		};

		const { userInfo, error, loadUserID } = getUserInfo();

		const getMedia = async (token) => {
			cache.value = false;
			loading.value = true;

			// Display error if number of tweets are less than 5.
			// Twitter API minimum search limit = 5
			if (num_of_results.value < 5 || num_of_results.value > 100) {
				message.value =
					"Number of results value can not be less than 5 or higher than 100";
				loading.value = false;
				return;
			}

			// Display error if user field is empty
			if (!user.value) {
				message.value = "Please set a username";
				loading.value = false;
				return;
			}

			// Make sures that next_token doesn't exist and it's not a pagination call
			// Returns UserId and other userInfo
			if (!token) {
				message.value = "";
				photos.value = [];
				videos.value = [];
				userDetails.value = {};
				result_count.value = 0;
				await loadUserID(user.value);
			}

			// Display error if user is not found
			if (!userInfo.value) {
				loading.value = false;
				message.value = "Error. User not found";
				return;
			}

			// Check user doesn't exists in search history. If true saves user value to localStorage
			if (user_history.value && !user_history.value.includes(user.value)) {
				user_history.value.push(user.value);
				localStorage.setItem(
					"user_history",
					JSON.stringify(user_history.value)
				);
			}

			// await and Set user data to display profile info
			userDetails.value = await userInfo.value;

			// Exclude replies and retweets from search
			let exclude = "exclude=retweets,replies&";
			if (include.value.retweets && include.value.replies) {
				exclude = "";
			} else if (include.value.retweets) {
				exclude = "exclude=replies&";
			} else if (include.value.replies) {
				exclude = "exclude=retweets&";
			}

			// Search Query parameters
			let params = `${exclude}max_results=${num_of_results.value}&tweet.fields=id,created_at,text,attachments&expansions=attachments.media_keys&media.fields=media_key,type,url,preview_image_url`;

			let search_params = params;

			// If pagination next_token exists then and it to the query params to load more data
			if (token) {
				search_params = `${params}&pagination_token=${token}`;
			}

			// Make API call to return user tweets via user id
			await api
				.get(`2/users/${userDetails.value.id_str}/tweets?${search_params}`)
				.then((res) => {
					// Return if reponse contains errors with error details
					if (res.data.errors) {
						message.value = res.data.errors[0].detail;
						loading.value = false;
						return;
					}

					// Return if response object doesn't have include property, which contains media
					if (!res.data.hasOwnProperty("includes")) {
						result_count.value += res.data.meta.result_count;
						next_token.value = res.data.meta.next_token;
						message.value = `No photo found in ${result_count.value} tweets. Try to increase number of tweets`;
						loading.value = false;
						return;
					}

					// If reponse have meta property then set next_token and results count
					if (res.data.hasOwnProperty("meta")) {
						result_count.value += res.data.meta.result_count;
						next_token.value = res.data.meta.next_token;
					} else {
						result_count.value = num_of_results.value;
					}

					// Set tweets text and media
					let tweets = res.data.data;
					let media = res.data.includes.media;

					// Get tweets with photo and tweet text
					let photoTweets = TweetsWithPhotos(tweets, media);
					photoTweets.forEach((tweet) => {
						photos.value.push(tweet);
					});

					// Get tweet id's which contains video and animated gif's
					let videoTweets = TweetsWithVideo(tweets, media);

					// Reactive constant for userData to save it to localStorage for cache
					const userData = reactive({});

					// If videoTweets array exists then proceed with API calls
					if (videoTweets.length > 0) {
						// Set variable to find last iteration inside loop
						var videosProcessed = 0;

						// Make api request for each tweet via tweet id & get videos data
						// Add each video object to videos array
						videoTweets.forEach(async (tweet, index, array) => {
							// Make api call via tweet id to get Video Data
							let video = await getVideo(tweet.id);

							// Save additional data to video object
							video.id = tweet.id;
							video.text = tweet.text;
							video.created_at = tweet.created_at;

							// Push returned video with additional data to video array
							videos.value.push(video);

							// Save to localStorage on last iteration
							videosProcessed++;
							if (videosProcessed === array.length) {
								userData.cached_on = new Date();
								userData.tweets_count = result_count.value;
								userData.user = userDetails.value;
								userData.photos = photos.value;
								userData.videos = videos.value;
								localStorage.setItem(
									"u_" + user.value,
									JSON.stringify(userData)
								);
							}
						});
					}

					// If no videos found then proceed with saving only Photos data to localStorage
					else {
						userData.cached_on = new Date();
						userData.tweets_count = result_count.value;
						userData.user = userDetails.value;
						userData.photos = photos.value;
						userData.videos = videos.value;
						localStorage.setItem("u_" + user.value, JSON.stringify(userData));
					}

					// Set loading to false.
					loading.value = false;
				})
				.catch((err) => {
					error.value = err.message;
					console.log(error.value);
				});
		};

		return {
			user,
			userDetails,
			num_of_results,
			photos,
			videos,
			include,
			loading,
			next_token,
			result_count,
			message,
			cache,
			cached_on,
			user_history,
			historyClick,
			getUser,
			getMedia,
		};
	},
};
</script>
