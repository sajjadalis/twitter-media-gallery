import { ref } from "vue";
import moment from "moment";

const getData = () => {
	const cached_on = ref(null);
	const cache = ref(false);
	const photos = ref([]);
	const videos = ref([]);
	const userDetails = ref([]);
	const next_token = ref(null);
	const result_count = ref(0);

	const localData = async (query, type, callback) => {
		let data;
		if (type == "user") {
			data = JSON.parse(localStorage.getItem("u_" + query));
		}

		if (type == "search") {
			data = JSON.parse(localStorage.getItem("q_" + query));
		}

		// console.log(data);
		if (data) {
			cache.value = true;
			next_token.value = null;

			if (data.cached_on) {
				cached_on.value = moment(data.cached_on).fromNow();
			}
			if (data.tweets_count) {
				result_count.value = data.tweets_count;
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
			await callback();
		}
	};

	return {
		localData,
		cache,
		cached_on,
		next_token,
		photos,
		videos,
		userDetails,
		result_count,
	};
};

export default getData;
