import { ref } from "vue";

const mediaNav = () => {
	const imgIndex = ref(null);
	const imgShow = ref(false);
	const singleImage = ref(null);

	const nextMedia = (type, data) => {
		imgIndex.value += 1;

		if (type == "photo") {
			if (data.length == imgIndex.value) {
				imgIndex.value = 0;
				singleImage.value = data[0];
			} else {
				let image = data[imgIndex.value];
				imageShow(image, imgIndex.value);
			}
		}
		if (type == "video") {
			if (videos.value.length == imgIndex.value) {
				imgIndex.value = 0;
				singleImage.value = data[0];
			} else {
				let video = data[imgIndex.value];
				imageShow(video, imgIndex.value);
			}
		}
	};

	const prevMedia = (type, data) => {
		imgIndex.value -= 1;

		if (type == "photo") {
			if (imgIndex.value == -1) {
				imgIndex.value = data.length - 1;
				let image = data[imgIndex.value];
				imageShow(image, imgIndex.value);
			} else {
				let image = data[imgIndex.value];
				imageShow(image, imgIndex.value);
			}
		}

		if (type == "video") {
			if (imgIndex.value == -1) {
				imgIndex.value = data.length - 1;
				let video = data[imgIndex.value];
				imageShow(video, imgIndex.value);
			} else {
				let video = data[imgIndex.value];
				imageShow(video, imgIndex.value);
			}
		}
	};

	return { imgIndex, imgShow, singleImage, nextMedia, prevMedia };
};

export default mediaNav;
