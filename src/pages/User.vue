<template>
	<Form
		v-model:query="form.query"
		v-model:items.number="form.items"
		v-model:retweets="form.retweets"
		v-model:replies="form.replies"
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

	<router-view @next="next" @prev="prev" :key="$route.fullPath"></router-view>

	<Media :media="media" :user="form.query" />

	<div v-if="loading" class="spinner my-10 mx-auto"></div>

	<div
		class="mt-5 w-full text-white bg-indigo-500 px-5 py-3 font-bold text-lg"
		v-if="message"
	>
		{{ message }}
	</div>

	<div
		class="my-5 w-full text-red-500 border-4 border-red-500 text-center p-2 font-bold text-lg"
		v-if="media.length"
	>
		{{ media.length }} media items found in {{ result_count }} tweets
	</div>

	<button
		v-if="next_token"
		@click.prevent="getMedia(next_token)"
		class="w-full text-white bg-red-500 hover:bg-red-600 p-3 uppercase font-bold mb-5"
	>
		Load More
	</button>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive, ref } from "vue";

import Form from "../components/Form.vue";
import SearchHistory from "../components/SearchHistory.vue";
import UserCard from "../components/UserCard.vue";
import Media from "../components/Media.vue";
import CacheNotification from "../components/CacheNotification.vue";

import api from "../composeables/api";
import getUserInfo from "../composeables/getUserInfo";
import TweetsWithMedia from "../composeables/TweetsWithMedia";
import getData from "../composeables/getData";

const router = useRouter();
const route = useRoute();
const form = ref({
	query: route.query.u,
	items: 100,
	retweets: false,
	replies: true,
});
// const user = ref(route.query.u);
const user_history = ref([]);
const message = ref(null);
const loading = ref(false);

const {
	localData,
	cache,
	cached_on,
	next_token,
	media,
	userDetails,
	result_count,
} = getData();

onMounted(() => {
	let history = JSON.parse(localStorage.getItem("user_history"));
	let users = JSON.parse(localStorage.getItem("users"));

	if (history) {
		user_history.value = history;
	}

	if (form.value.query) {
		localData(form.value.query, "user", getMedia);
	}

	console.log(route.fullPath);
});

const historyClick = async (val) => {
	router.push({
		name: "user",
		query: { u: val },
	});
	form.value.query = val;
	localData(form.value.query, "user", getMedia);
};

const getUser = async () => {
	router.push({
		name: "user",
		query: { u: form.value.query },
	});
	// await getMedia();
	localData(form.value.query, "user", getMedia);
};

const { userInfo, error, loadUserID } = getUserInfo();

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

	// Display error if user field is empty
	if (!form.value.query) {
		message.value = "Please set a username";
		loading.value = false;
		return;
	}

	// Make sures that next_token doesn't exist and it's not a pagination call
	// Returns UserId and other userInfo
	if (!token) {
		message.value = "";
		media.value = [];
		userDetails.value = {};
		result_count.value = 0;
		await loadUserID(form.value.query);
	}

	// Display error if user is not found
	if (!userInfo.value) {
		loading.value = false;
		message.value = "Error. User not found";
		return;
	}

	// Check user doesn't exists in search history. If true saves user value to localStorage
	if (user_history.value && !user_history.value.includes(form.value.query)) {
		user_history.value.push(form.value.query);
		localStorage.setItem("user_history", JSON.stringify(user_history.value));
	}

	// await and Set user data to display profile info
	userDetails.value = await userInfo.value;

	// Exclude replies and retweets from search
	let exclude = "exclude=retweets,replies&";
	if (form.value.retweets && form.value.replies) {
		exclude = "";
	} else if (form.value.retweets) {
		exclude = "exclude=replies&";
	} else if (form.value.replies) {
		exclude = "exclude=retweets&";
	}

	// Search Query parameters
	let params = `${exclude}max_results=${form.value.items}&tweet.fields=id,created_at,text,public_metrics,attachments&expansions=attachments.media_keys&media.fields=media_key,type,url,preview_image_url`;

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
				result_count.value = form.value.items;
			}

			// Set tweets text and media
			let tweets = res.data.data;
			let mediaData = res.data.includes.media;
			// console.log(tweets);

			let mediaTweets = TweetsWithMedia(tweets, mediaData);
			mediaTweets.forEach((tweet) => {
				media.value.push(tweet);
			});

			// Set loading to false.
			loading.value = false;
		})
		.finally(() => {
			const userData = {
				cached_on: new Date(),
				tweets_count: result_count.value,
				user: userDetails.value,
				media: media.value,
			};

			localStorage.setItem("u_" + form.value.query, JSON.stringify(userData));
		})
		.catch((err) => {
			error.value = err.message;
			console.log(error.value);
		});
};

const next = (val) => {
	let index = Number(val);
	index += 1;
	let tweet = media.value[index];
	router.push({
		name: "modal",
		params: {
			id: tweet.media_key,
			data: JSON.stringify(tweet),
			user: form.value.query,
			index: index,
		},
	});
	// console.log(tweet);
};

const prev = (val) => {
	let index = Number(val);
	index -= 1;
	let tweet = media.value[index];
	router.push({
		name: "modal",
		params: {
			id: tweet.media_key,
			data: JSON.stringify(tweet),
			user: form.value.query,
			index: index,
		},
	});
	// console.log(tweet);
};
</script>
