<template>
	<Form
		v-model="user"
		:num_of_results="num_of_results"
		:include="include"
		placeholder="Twitter Username"
		@search="getUser()"
	/>

	<SearchHistory :search_history="search_history" @media="historyClick" />
</template>
<script>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import Form from "../components/Form.vue";
import SearchHistory from "../components/SearchHistory.vue";
export default {
	components: {
		Form,
		SearchHistory,
	},
	setup() {
		const router = useRouter();
		const route = useRoute();
		const user = ref("BBCEarth");
		const num_of_results = ref(50);
		const include = ref({ retweets: false, replies: true });
		const search_history = ref([]);

		onMounted(async () => {
			let history = JSON.parse(localStorage.getItem("search_history"));

			if (history) {
				search_history.value = history;
			}
		});

		const historyClick = async (val) => {
			router.push({
				name: "user",
				params: { user: val },
			});
			user.value = val;
		};

		const getUser = async () => {
			router.push({
				name: "user",
				params: { user: user.value },
			});
		};

		return {
			user,
			num_of_results,
			include,
			search_history,
			historyClick,
			getUser,
		};
	},
};
</script>
