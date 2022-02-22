import { ref } from "vue";
import moment from "moment";
import api from "./api";
import TweetsWithMedia from "./TweetsWithMedia";

const getData = () => {
	const cached_on = ref(null);
	const cache = ref(false);
	const media = ref([]);
	const userDetails = ref({});
	const next_token = ref(null);
	const result_count = ref(0);
	const error = ref(null);
	const message = ref(null);
	const loading = ref(false);

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
			if (data.media) {
				media.value = data.media;
			}
		} else {
			await callback();
		}
	};

	const getUserID = async (user) => {
		await api
			.get(`1.1/users/show.json?screen_name=${user}`)
			.then((res) => {
				userDetails.value = res.data;
			})
			.catch((err) => {
				if (err.message) {
					message.value = err.message;
					console.log(message.value);
					loading.value = false;
				}
			});
	};

	const apiCall = async (query) => {
		await api
			.get(query)
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

				let mediaData = res.data.includes.media;
				// console.log(res.data);

				let tweets;
				if (
					res.data.hasOwnProperty("includes") &&
					res.data.includes.hasOwnProperty("users")
				) {
					tweets = [];

					let tempTweets = res.data.data;
					let tempUsers = res.data.includes.users;

					tempTweets.forEach((x) => {
						tempUsers.forEach((y) => {
							if (x.author_id === y.id) {
								delete y.id;
								tweets.push({ ...x, ...y });
							}
						});
					});
				} else {
					tweets = res.data.data;
				}

				let mediaTweets = TweetsWithMedia(tweets, mediaData);
				mediaTweets.forEach((tweet) => {
					media.value.push(tweet);
				});

				// Set loading to false.
				loading.value = false;
			})
			.catch((err) => {
				message.value = err.message;
				console.log(message.value);
			});
	};

	return {
		getUserID,
		localData,
		apiCall,
		cache,
		cached_on,
		next_token,
		media,
		userDetails,
		result_count,
		error,
		message,
		loading,
	};
};

export default getData;
