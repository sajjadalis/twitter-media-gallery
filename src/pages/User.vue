<template>
	<Form
		v-model="user"
		:num_of_results="num_of_results"
		:include="include"
		placeholder="Twitter Username"
		@search="getUser()"
	/>

	<SearchHistory :search_history="search_history" @media="historyClick" />

	<div
		class="mt-5 w-full bg-slate-100 text-slate-800 p-2 font-bold text-lg flex items-center justify-between uppercase"
		v-if="cache"
	>
		<span>Data is being loaded from local storage cache</span>
		<button
			class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold uppercase px-3 py-1 flex flex-row items-center ml-3"
			@click.prevent="getUser()"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 mr-1"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
					clip-rule="evenodd"
				/>
			</svg>
			Refresh Data
		</button>
	</div>

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
import api from "../composeables/api";
import getUserInfo from "../composeables/getUserInfo";
import TweetsWithVideo from "../composeables/TweetsWithVideo";
import TweetsWithPhotos from "../composeables/TweetsWithPhotos";
import getVideo from "../composeables/getVideo";
export default {
	components: {
		Form,
		SearchHistory,
		UserCard,
		TabsContent,
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const num_of_results = ref(50);
		const include = ref({ retweets: false, replies: true });
		const user = ref(route.params.user);
		const search_history = ref([]);
		const photos = ref([]);
		const videos = ref([]);
		const userDetails = ref([]);
		const next_token = ref(null);
		const result_count = ref(0);
		const message = ref(null);
		const cache = ref(false);
		const loading = ref(false);

		const localData = async (username) => {
			let data = JSON.parse(localStorage.getItem(username));
			console.log(data);

			if (data) {
				cache.value = true;
				next_token.value = null;
				if (data.tweets) {
					result_count.value = data.tweets;
				}
				if (data.user) {
					userDetails.value = data.user;
				}
				if (data.photos) {
					photos.value = data.photos;
				}
				if (data.videos) {
					videos.value = data.videos;
				}
			} else {
				await getMedia();
			}
		};

		onMounted(() => {
			let history = JSON.parse(localStorage.getItem("search_history"));

			if (history) {
				search_history.value = history;
			}

			if (user.value) {
				localData(user.value);
			}
		});

		const historyClick = async (val) => {
			router.push({
				name: "user",
				params: { user: val },
			});
			user.value = val;
			localData(user.value);
		};

		const getUser = async () => {
			router.push({
				name: "user",
				params: { user: user.value },
			});
			await getMedia();
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
							userData.tweets = result_count.value;
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
			// .then(() => {
			// 	console.log(videos.value);
			// 	let userData = { photos: photos.value, videos: videos.value };
			// 	// userData.photos = ;
			// 	// userData.videos = ;
			// 	localStorage.setItem(user.value, JSON.stringify(userData));
			// 	let items = JSON.parse(localStorage.getItem(user.value));
			// 	console.log(items);
			// });
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
			search_history,
			historyClick,
			getUser,
			getMedia,
		};
	},
};
</script>
