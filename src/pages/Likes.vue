<template>
	<TabsContent :photos="photoLikes" :videos="videoLikes" />

	<div class="flex flex-row items-center space-x-1">
		<button
			v-if="photoLikes.length"
			@click.prevent="clearPhotos"
			class="w-full text-white bg-red-500 hover:bg-red-600 p-3 uppercase font-bold mb-5"
		>
			Clear All Photo Likes
		</button>
		<button
			v-if="videoLikes.length"
			@click.prevent="clearVideos"
			class="w-full text-white bg-red-500 hover:bg-red-600 p-3 uppercase font-bold mb-5"
		>
			Clear All Video Likes
		</button>
	</div>
</template>

<script>
import { onMounted, ref } from "vue";
import TabsContent from "../components/TabsContent.vue";

export default {
	components: {
		TabsContent,
	},
	setup() {
		const photoLikes = ref([]);
		const videoLikes = ref([]);

		onMounted(() => {
			let photos = JSON.parse(localStorage.getItem("photo_likes"));
			if (photos) {
				photoLikes.value = photos;
			}

			let videos = JSON.parse(localStorage.getItem("video_likes"));
			if (videos) {
				videoLikes.value = videos;
			}
		});

		const clearPhotos = () => {
			if (confirm("Are you sure? All photos will be cleared on likes page.")) {
				localStorage.removeItem("photo_likes");
				photoLikes.value = [];
			}
		};

		const clearVideos = () => {
			if (confirm("Are you sure? All videos will be cleared on likes page.")) {
				localStorage.removeItem("video_likes");
				videoLikes.value = [];
			}
		};

		return {
			photoLikes,
			videoLikes,
			clearPhotos,
			clearVideos,
		};
	},
};
</script>
