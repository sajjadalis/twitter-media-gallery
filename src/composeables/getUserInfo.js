import { ref } from "vue";
import api from "./api";

const getUserInfo = () => {
	const userInfo = ref(null);
	const error = ref(null);

	const loadUserID = async (user) => {
		await api
			.get(`1.1/users/show.json?screen_name=${user}`)
			.then((res) => {
				userInfo.value = res.data;
				console.log(userInfo.value);
			})
			.catch((err) => {
				error.value = err.message;
				console.log(error.value);
			});
	};

	return { userInfo, error, loadUserID };
};

export default getUserInfo;
