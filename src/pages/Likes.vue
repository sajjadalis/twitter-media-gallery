<template>
	<!-- <div class="flex flex-row items-center space-x-1">
		<button
			v-if="mediaLikes.length"
			@click.prevent="clearPhotos"
			class="w-full text-white bg-red-500 hover:bg-red-600 p-3 uppercase font-bold mb-5"
		>
			Clear All Photos
		</button>
		<button
			v-if="videoLikes.length"
			@click.prevent="clearVideos"
			class="w-full text-white bg-red-500 hover:bg-red-600 p-3 uppercase font-bold mb-5"
		>
			Clear All Videos
		</button>
	</div> -->

	<router-view
		@next="next"
		@prev="prev"
		type="likes"
		:key="$route.fullPath"
	></router-view>

	<Media :media="media" type="likes_modal" />

	<div class="-mt-6"></div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import Media from "../components/Media.vue";

const router = useRouter();
const media = ref([]);

onMounted(() => {
	let mediaLikes = JSON.parse(localStorage.getItem("media_likes"));
	if (mediaLikes) {
		media.value = mediaLikes;
	}
});

const next = (val) => {
	let index = Number(val);

	if (media.value.length - 1 == index) {
		index = 0;
	} else {
		index += 1;
	}

	let tweet = media.value[index];
	router.push({
		name: "likes_modal",
		params: {
			id: tweet.media_key,
			data: JSON.stringify(tweet),
			index: index,
		},
	});
};

const prev = (val) => {
	let index = Number(val);

	if (index == 0) {
		index = media.value.length - 1;
	} else {
		index -= 1;
	}

	let tweet = media.value[index];
	router.push({
		name: "likes_modal",
		params: {
			id: tweet.media_key,
			data: JSON.stringify(tweet),
			index: index,
		},
	});
	// console.log(tweet);
};

// const clearPhotos = () => {
// 	if (confirm("Are you sure? All photos will be cleared on likes page.")) {
// 		localStorage.removeItem("photo_likes");
// 		mediaLikes.value = [];
// 	}
// };

// const clearVideos = () => {
// 	if (confirm("Are you sure? All videos will be cleared on likes page.")) {
// 		localStorage.removeItem("video_likes");
// 		videoLikes.value = [];
// 	}
// };
</script>
