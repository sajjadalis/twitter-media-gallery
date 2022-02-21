<template>
	<div v-if="media.length" class="mt-5">
		<masonry :cols="{ default: 4, 1000: 3, 768: 2, 576: 1 }" :gutter="10">
			<div
				v-for="(tweet, i) in media"
				:key="i"
				class="relative bg-zinc-100 dark:bg-zinc-800 mb-3"
			>
				<div class="relative">
					<router-link
						class="relative block"
						:to="{
							name: 'modal',
							params: {
								id: tweet.media_key,
								data: JSON.stringify(tweet),
								user: user,
								index: i,
							},
						}"
					>
						<img
							v-if="tweet.type == 'photo'"
							:src="tweet.url + '?format=jpg&name=small'"
							class="mx-auto" />
						<img
							v-else
							:src="tweet.preview_image_url + '?format=jpg&name=small'"
							class="mx-auto" />
						<PlayIcon
							v-if="tweet.type != 'photo'"
							class="absolute top-1/2 left-1/2 mx-auto h-16 w-16 -ml-8 -mt-8 opacity-50 text-white"
					/></router-link>

					<button
						v-if="tweet.url"
						@click.prevent="likePhoto(tweet), $emit('like', tweet)"
						class="absolute bottom-2 right-2"
					>
						<HeartIcon
							class="h-5 w-5 hover:transition-all"
							:class="[
								photoLikes.some((e) => e.media_key === tweet.media_key)
									? 'fill-red-500 text-red-500 hover:text-red-500'
									: 'text-white hover:text-gray-300',
							]"
						/>
					</button>
				</div>

				<TweetText v-if="showText == 'true'" :img="tweet" :user="user" />
			</div>
		</masonry>
	</div>

	<div
		class="mt-5 w-full text-white bg-indigo-500 text-center p-2 font-bold text-lg"
		v-if="result_count > 0 && !photos.length"
	>
		No photos found
	</div>

	<ToggleText v-if="media.length" @toggle="text" :showText="showText" />

	<ScrollToTop v-if="media.length" />
</template>
<script>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { HeartIcon } from "@heroicons/vue/outline";
import { PlayIcon } from "@heroicons/vue/solid";
import PhotoModal from "./PhotoModal.vue";
import VideoModal from "./VideoModal.vue";
import TweetText from "./TweetText.vue";
import ToggleText from "./ToggleText.vue";
import ScrollToTop from "./ScrollToTop.vue";
export default {
	props: ["media", "user", "result_count"],
	components: {
		TabGroup,
		TabList,
		Tab,
		TabPanels,
		TabPanel,
		PhotoModal,
		VideoModal,
		TweetText,
		ToggleText,
		ScrollToTop,
		HeartIcon,
		PlayIcon,
	},
	setup(props) {
		const mediaIndex = ref(null);
		const showModal = ref(false);
		const singleMedia = ref(null);
		const photoLikes = ref([]);
		const videoLikes = ref([]);
		const showText = ref(null);

		const router = useRouter();
		const route = useRoute();

		const open = (post) => {
			router.push({
				name: "modal", //use name for router push
				params: { data: JSON.stringify(post) },
			});
		};

		const mediaShow = (media, index) => {
			mediaIndex.value = index;
			showModal.value = true;
			singleMedia.value = media;
		};

		const nextMedia = (type) => {
			mediaIndex.value += 1;

			if (type == "photo") {
				if (props.photos.length == mediaIndex.value) {
					mediaIndex.value = 0;
					singleMedia.value = props.photos[0];
				} else {
					let image = props.photos[mediaIndex.value];
					mediaShow(image, mediaIndex.value);
				}
			}
			if (type == "video") {
				if (props.videos.length == mediaIndex.value) {
					mediaIndex.value = 0;
					singleMedia.value = props.videos[0];
				} else {
					let video = props.videos[mediaIndex.value];
					mediaShow(video, mediaIndex.value);
				}
			}
		};

		const prevMedia = (type) => {
			mediaIndex.value -= 1;

			if (type == "photo") {
				if (mediaIndex.value == -1) {
					mediaIndex.value = props.photos.length - 1;
					let image = props.photos[mediaIndex.value];
					mediaShow(image, mediaIndex.value);
				} else {
					let image = props.photos[mediaIndex.value];
					mediaShow(image, mediaIndex.value);
				}
			}

			if (type == "video") {
				if (mediaIndex.value == -1) {
					mediaIndex.value = props.videos.length - 1;
					let video = props.videos[mediaIndex.value];
					mediaShow(video, mediaIndex.value);
				} else {
					let video = props.videos[mediaIndex.value];
					mediaShow(video, mediaIndex.value);
				}
			}
		};

		onMounted(() => {
			let photos = JSON.parse(localStorage.getItem("photo_likes"));
			if (photos) {
				photoLikes.value = photos;
			}

			let videos = JSON.parse(localStorage.getItem("video_likes"));
			if (videos) {
				videoLikes.value = videos;
			}

			let showTweetText = localStorage.getItem("show_text");
			if (showTweetText) {
				showText.value = showTweetText;
			}
		});

		const likePhoto = (photo) => {
			if (photoLikes.value) {
				let index;
				const likeExist = photoLikes.value.some((e, i) => {
					if (e.media_key === photo.media_key) {
						index = i;
						return true;
					}
				});
				if (likeExist) {
					photoLikes.value.splice(index, 1);
					localStorage.setItem("photo_likes", JSON.stringify(photoLikes.value));
					return;
				}

				photoLikes.value.push(photo);
				localStorage.setItem("photo_likes", JSON.stringify(photoLikes.value));
			}

			if (!photoLikes.value.length) {
				photoLikes.value.push(photo);
				localStorage.setItem("photo_likes", JSON.stringify(photoLikes.value));
			}
			// console.log(photoLikes.value);
		};

		const likeVideo = (video) => {
			if (videoLikes.value) {
				let index;
				const likeExist = videoLikes.value.some((e, i) => {
					if (e.id === video.id) {
						index = i;
						return true;
					}
				});
				if (likeExist) {
					videoLikes.value.splice(index, 1);
					localStorage.setItem("video_likes", JSON.stringify(videoLikes.value));
					return;
				}

				videoLikes.value.push(video);
				localStorage.setItem("video_likes", JSON.stringify(videoLikes.value));
			}

			if (!videoLikes.value.length) {
				videoLikes.value.push(video);
				localStorage.setItem("video_likes", JSON.stringify(videoLikes.value));
			}
			// console.log(videoLikes.value);
		};

		const like = (e, type) => {
			if (type == "photo") {
				likePhoto(e);
			}

			if (type == "video") {
				likeVideo(e);
			}
		};

		const text = () => {
			if (showText.value == "true") {
				showText.value = "false";
			} else {
				showText.value = "true";
			}
			localStorage.setItem("show_text", showText.value);
		};

		return {
			open,
			mediaShow,
			nextMedia,
			prevMedia,
			likePhoto,
			likeVideo,
			mediaIndex,
			showModal,
			singleMedia,
			photoLikes,
			videoLikes,
			showText,
			like,
			text,
		};
	},
};
</script>
