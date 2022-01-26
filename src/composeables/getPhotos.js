import { ref } from "vue";
import api from "./api";

const getPhotos = (id, num_of_results) => {
	const photos = ref([]);
	const error = ref(null);

	let search_params = `max_results=${num_of_results}&tweet.fields=attachments&expansions=attachments.media_keys&media.fields=media_key,type,url,preview_image_url`;

	const loadPhotos = async () => {
		await api
			.get(`2/users/${id}/tweets?${search_params}`)
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				error.value = err.message;
				console.log(error.value);
			});
	};

	return { photos, error, loadPhotos };
};

export default getPhotos;
