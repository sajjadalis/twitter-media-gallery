import { ref } from "vue";
import api from "./api";

const getUserID = () => {
	const userId = ref(null);
	const error = ref(null);

	const loadUserID = async (user) => {
		await api
			.get(`2/users/by/username/${user}`)
			.then((res) => {
				userId.value = res.data.data.id;
				// console.log(userId.value);
			})
			.catch((err) => {
				error.value = err.message;
				console.log(error.value);
			});
	};

	return { userId, error, loadUserID };
};

export default getUserID;
