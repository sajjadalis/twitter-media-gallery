<template>
	<Form
		v-model:query="form.query"
		v-model:items.number="form.items"
		v-model:retweets="form.retweets"
		v-model:replies="form.replies"
		type="hashtag_history"
		:history="hashtag_history"
		:showHistory="showHistory"
		@search="getQuery()"
		@media="historyClick"
		placeholder="#hashtag / #multiple #hashtags / keyword"
	/>

	<CacheNotification
		:cache="cache"
		:cached_on="cached_on"
		@refresh="getMedia"
	/>

	<router-view
		@next="next"
		@prev="prev"
		type="search"
		:key="$route.fullPath"
	></router-view>

	<Media :media="media" :query="form.query" type="search_modal" />

	<div v-if="loading" class="spinner my-10 mx-auto"></div>

	<div
		class="my-5 w-full text-white bg-indigo-500 px-5 py-3 font-bold text-lg"
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
import { onMounted, ref, reactive } from "vue";

import Form from "../components/Form.vue";
import SearchHistory from "../components/SearchHistory.vue";
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

const hashtag_history = ref([]);
const showHistory = ref(false);

const {
	localData,
	apiCall,
	cache,
	cached_on,
	next_token,
	media,
	result_count,
	loading,
	message,
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
		media.value = [];
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

	await apiCall(`2/tweets/search/recent?${search_params}`);

	const search = {
		cached_on: new Date(),
		tweets_count: result_count.value,
		media: media.value,
	};

	localStorage.setItem("q_" + form.value.query, JSON.stringify(search));
};

const next = (val) => {
	let index = Number(val);
	index += 1;
	let tweet = media.value[index];
	router.push({
		name: "search_modal",
		params: {
			id: tweet.media_key,
			data: JSON.stringify(tweet),
			query: form.value.query,
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
		name: "search_modal",
		params: {
			id: tweet.media_key,
			data: JSON.stringify(tweet),
			query: form.value.query,
			index: index,
		},
	});
	// console.log(tweet);
};
</script>
