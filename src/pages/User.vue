<template>
	<Form
		v-model:query="form.query"
		v-model:items.number="form.items"
		v-model:retweets="form.retweets"
		v-model:replies="form.replies"
		type="user_history"
		:history="user_history"
		:showHistory="showHistory"
		@search="getUser()"
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

	<Media :media="media" :query="form.query" type="user_modal" />

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
});

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

	await apiCall(`2/users/${userDetails.value.id_str}/tweets?${search_params}`);

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
	index += 1;
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
	index -= 1;
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
