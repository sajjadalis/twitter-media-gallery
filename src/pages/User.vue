<template>
	<Form
		v-model="user"
		:num_of_results="num_of_results"
		:include="include"
		placeholder="Twitter Username"
		@search="getUser()"
	/>

	<SearchHistory :search_history="search_history" @media="historyClick" />

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
		const num_of_results = ref(50);
		const include = ref({ retweets: false, replies: true });
		const user = ref(route.params.user);
		const search_history = ref([]);
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
			let history = JSON.parse(localStorage.getItem("search_history"));

			if (history) {
				search_history.value = history;
			}

			if (user.value) {
				localData(user.value, getMedia);
			}
		});

		const historyClick = async (val) => {
			router.push({
				name: "user",
				params: { user: val },
			});
			user.value = val;
			localData(user.value, getMedia);
		};

		const getUser = async () => {
			router.push({
				name: "user",
				params: { user: user.value },
			});
			// await getMedia();
			localData(user.value, getMedia);
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

			if (!user.value) {
				message.value = "Please set a username";
				loading.value = false;
				return;
			}

			if (!token) {
				message.value = "";
				photos.value = [];
				videos.value = [];
				userDetails.value = {};
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

			userDetails.value = await userInfo.value;

			let exclude = "exclude=retweets,replies&";
			if (include.value.retweets && include.value.replies) {
				exclude = "";
			} else if (include.value.retweets) {
				exclude = "exclude=replies&";
			} else if (include.value.replies) {
				exclude = "exclude=retweets&";
			}

			let params = `${exclude}max_results=${num_of_results.value}&tweet.fields=id,created_at,text,attachments&expansions=attachments.media_keys&media.fields=media_key,type,url,preview_image_url`;

			let search_params = params;

			if (token) {
				search_params = `${params}&pagination_token=${token}`;
			}

			await api
				.get(`2/users/${userDetails.value.id_str}/tweets?${search_params}`)
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

					const userData = reactive({});

					// Make api request for each tweet via tweet id & get videos data
					// Add each video object to videos array
					var videosProcessed = 0;
					videoTweets.forEach(async (tweet, index, array) => {
						let video = await getVideo(tweet.id);
						video.id = tweet.id;
						video.text = tweet.text;
						video.created_at = tweet.created_at;
						videos.value.push(video);

						videosProcessed++;
						if (videosProcessed === array.length) {
							userData.cached_on = new Date();
							userData.tweets_count = result_count.value;
							userData.user = userDetails.value;
							userData.photos = photos.value;
							userData.videos = videos.value;
							localStorage.setItem(user.value, JSON.stringify(userData));
						}
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
			search_history,
			historyClick,
			getUser,
			getMedia,
		};
	},
};
</script>
