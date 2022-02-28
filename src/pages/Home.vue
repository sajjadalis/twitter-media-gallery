<template>
	<Form
		v-model:query="form.query"
		v-model:items.number="form.items"
		v-model:retweets="form.retweets"
		v-model:replies="form.replies"
		@search="getUser()"
	/>

	<!-- <SearchHistory
		:history="user_history"
		type="user_history"
		@media="historyClick"
	/> -->
</template>
<script setup>
import Form from "../components/Form.vue";
import SearchHistory from "../components/SearchHistory.vue";

import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const form = ref({
	query: "",
	items: 100,
	retweets: false,
	replies: true,
});

// // const user = ref(route.query.u);
// const user_history = ref([]);

// onMounted(() => {
// 	let history = JSON.parse(localStorage.getItem("user_history"));

// 	if (history) {
// 		user_history.value = history;
// 	}
// });

// const historyClick = (val) => {
// 	router.push({
// 		name: "user",
// 		params: { username: val },
// 	});
// };

const getUser = async () => {
	router.push({
		name: "user",
		params: { username: form.value.query },
	});
};
</script>
