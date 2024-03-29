<template>
	<Form
		v-model:query="form.query"
		v-model:items.number="form.items"
		v-model:retweets="form.retweets"
		v-model:replies="form.replies"
		type="user_history"
		:history="user_history"
		:showHistory="showHistory"
		:showInlineHistory="showInlineHistory"
		@search="getUser()"
		@media="historyClick"
	/>

	<SearchHistory
		v-if="showInlineHistory == 'true'"
		type="user_history"
		:history="user_history"
		@media="historyClick"
	/>

	<CacheNotification
		:cache="cache"
		:cached_on="cached_on"
		@refresh="getMedia"
	/>

	<UserCard v-if="Object.keys(userDetails).length !== 0" :user="userDetails" />

	<router-view
		@next="next"
		@prev="prev"
		type="user"
		:key="$route.fullPath"
	></router-view>

	<Media
		:media="media"
		:query="form.query"
		type="user_modal"
		@toggleHistory="toggleHistory"
		:showInlineHistory="showInlineHistory"
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
import { onMounted, ref } from "vue";

import Form from "../components/Form.vue";
import SearchHistory from "../components/SearchHistory.vue";
import UserCard from "../components/UserCard.vue";
import Media from "../components/Media.vue";
import CacheNotification from "../components/CacheNotification.vue";
import getData from "../composeables/getData";

const router = useRouter();
const route = useRoute();
const form = ref({
	query: route.query.q,
	items: 100,
	retweets: false,
	replies: true,
});

const user_history = ref([]);
const showHistory = ref(false);
const showInlineHistory = ref(null);

const {
	getUserID,
	localData,
	apiCall,
	cache,
	cached_on,
	next_token,
	media,
	userDetails,
	result_count,
	loading,
	message,
} = getData();

onMounted(() => {
	let history = JSON.parse(localStorage.getItem("user_history"));

	if (history) {
		user_history.value = history;
	}

	if (form.value.query) {
		localData(form.value.query, "user", getMedia);
	}

	let showHistory = localStorage.getItem("show_history");
	if (showHistory) {
		showInlineHistory.value = showHistory;
	} else {
		showInlineHistory.value = "false";
	}
});

const toggleHistory = () => {
	if (showInlineHistory.value == "true") {
		showInlineHistory.value = "false";
	} else {
		showInlineHistory.value = "true";
	}
	localStorage.setItem("show_history", showInlineHistory.value);
};

const historyClick = async (val) => {
	router.push({
		name: "user",
		query: { q: val },
	});
	form.value.query = val;
	localData(form.value.query, "user", getMedia);
	showHistory.value = false;
};

const getUser = async () => {
	router.push({
		name: "user",
		query: { q: form.value.query },
	});
	localData(form.value.query, "user", getMedia);
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

	// Display error if user field is empty
	if (!form.value.query) {
		message.value = "Please set a username";
		loading.value = false;
		return;
	}

	// Make sures that next_token doesn't exist and it's not a pagination call
	// Returns userId and userInfo
	if (!token) {
		message.value = "";
		media.value = [];
		userDetails.value = {};
		result_count.value = 0;
		await getUserID(form.value.query);
	}

	// Display error if user is not found
	if (!userDetails.value) {
		loading.value = false;
		message.value = "Error. User not found";
		return;
	}

	// Check user doesn't exists in search history. If true saves user value to localStorage
	if (user_history.value && !user_history.value.includes(form.value.query)) {
		user_history.value.push(form.value.query);
		localStorage.setItem("user_history", JSON.stringify(user_history.value));
	}

	// Set user data to display profile info
	// userDetails.value = userInfo.value;

	// Exclude replies and retweets from search
	let exclude = "retweets,replies";
	if (form.value.retweets && form.value.replies) {
		exclude = "";
	} else if (form.value.retweets) {
		exclude = "replies";
	} else if (form.value.replies) {
		exclude = "retweets";
	}

	// Search Query parameters
	let params = `items=${form.value.items}&exclude=${exclude}`;
	let search_params = params;

	// If pagination next_token exists then and it to the query params to load more data
	if (token) {
		search_params = `${params}&pagination_token=${token}`;
	}

	await apiCall(`/tweets/${userDetails.value.id_str}?${search_params}`);

	const userData = {
		cached_on: new Date(),
		tweets_count: result_count.value,
		user: userDetails.value,
		media: media.value,
	};

	localStorage.setItem("u_" + form.value.query, JSON.stringify(userData));
};

const next = (val) => {
	let index = Number(val);

	if (media.value.length - 1 == index) {
		index = 0;
	} else {
		index += 1;
	}

	let tweet = media.value[index];
	router.push({
		name: "user_modal",
		params: {
			id: tweet.media_key,
			data: JSON.stringify(tweet),
			user: form.value.query,
			index: index,
		},
	});
};

const prev = (val) => {
	let index = Number(val);

	if (index == 0) {
		index = media.value.length - 1;
	} else {
		index -= 1;
	}

	let tweet = media.value[index];
	router.push({
		name: "user_modal",
		params: {
			id: tweet.media_key,
			data: JSON.stringify(tweet),
			user: form.value.query,
			index: index,
		},
	});
};
</script>
