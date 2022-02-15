<template>
	<TabGroup>
		<TabList class="flex p-1 space-x-1 top-gradient mt-5">
			<Tab as="template" v-slot="{ selected }">
				<button
					:class="[
						'w-full py-2.5 text-lg font-bold uppercase leading-5 text-orange-500 focus:outline-none',
						selected
							? 'bg-white dark:bg-zinc-900 shadow'
							: 'text-orange-50 hover:text-white',
					]"
				>
					Photos <span v-if="photos.length">({{ photos.length }})</span>
				</button>
			</Tab>
			<Tab as="template" v-slot="{ selected }"
				><button
					:class="[
						'w-full py-2.5 text-lg font-bold uppercase leading-5 text-red-500 focus:outline-none',
						selected
							? 'bg-white dark:bg-zinc-900 shadow'
							: 'text-red-50 hover:text-white',
					]"
				>
					Videos <span v-if="videos.length">({{ videos.length }})</span>
				</button>
			</Tab>
		</TabList>
		<TabPanels class="mt-2">
			<TabPanel>
				<div v-if="photos.length" class="mt-5">
					<masonry :cols="{ default: 4, 1000: 3, 768: 2, 576: 1 }" :gutter="10">
						<div
							v-for="(img, i) in photos"
							:key="i"
							class="relative bg-zinc-100 dark:bg-zinc-800 mb-3"
						>
							<div class="relative">
								<a href="#" @click.prevent="mediaShow(img, i)"
									><img
										:src="img.url + '?format=jpg&name=small'"
										class="mx-auto"
									/>
								</a>
								<button
									v-if="img.url"
									@click.prevent="likePhoto(img), $emit('like', img)"
									class="absolute bottom-2 right-2"
								>
									<HeartIcon
										class="h-5 w-5 hover:transition-all"
										:class="[
											photoLikes.some((e) => e.media_key === img.media_key)
												? 'fill-red-500 text-red-500 hover:text-red-500'
												: 'text-white hover:text-gray-300',
										]"
									/>
								</button>
							</div>

							<TweetText v-if="showText == 'true'" :img="img" :user="user" />
						</div>
					</masonry>
					<PhotoModal
						v-if="showModal"
						:img="singleMedia"
						:user="user"
						@close="showModal = false"
						@next="nextMedia('photo')"
						@prev="prevMedia('photo')"
						@like="like($event, 'photo')"
						:key="'next' + mediaIndex"
					/>
				</div>

				<div
					class="mt-5 w-full text-white bg-indigo-500 text-center p-2 font-bold text-lg"
					v-if="result_count > 0 && !photos.length"
				>
					No photos found
				</div>
			</TabPanel>
			<TabPanel>
				<div v-if="videos.length" class="mt-5">
					<masonry :cols="{ default: 4, 1000: 3, 768: 2, 576: 1 }" :gutter="10">
						<div
							v-for="(video, i) in videos"
							:key="i"
							class="relative bg-zinc-100 dark:bg-zinc-800 mb-3"
						>
							<a
								href="#"
								@click.prevent="mediaShow(video, i)"
								class="relative block"
							>
								<img :src="video.image + '?format=jpg&name=small'" />

								<PlayIcon
									class="absolute top-1/2 left-1/2 mx-auto h-12 w-12 -ml-6 -mt-6 opacity-40 text-white"
								/>

								<button
									@click.prevent="likeVideo(video)"
									class="absolute bottom-2 right-2"
								>
									<HeartIcon
										class="h-5 w-5 hover:transition-all"
										:class="[
											videoLikes.some((e) => e.image === video.image)
												? 'fill-red-500 text-red-500 hover:text-red-500'
												: 'text-white hover:text-gray-300',
										]"
									/>
								</button>
							</a>
							<TweetText v-if="showText == 'true'" :img="video" :user="user" />
						</div>
					</masonry>
					<VideoModal
						v-if="showModal"
						:video="singleMedia"
						@close="showModal = false"
						@next="nextMedia('video')"
						@prev="prevMedia('video')"
						@like="like($event, 'video')"
						:key="'next' + mediaIndex"
					/>
				</div>

				<div
					class="mt-5 w-full text-white bg-indigo-500 text-center p-2 font-bold text-lg"
					v-if="result_count > 0 && !videos.length"
				>
					No videos found
				</div>
			</TabPanel>
		</TabPanels>
	</TabGroup>

	<ToggleText
		v-if="photos.length || videos.length"
		@toggle="text"
		:showText="showText"
	/>

	<ScrollToTop v-if="photos.length || videos.length" />
</template>
<script>
import { onMounted, ref } from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { HeartIcon } from "@heroicons/vue/outline";
import { PlayIcon } from "@heroicons/vue/solid";
import PhotoModal from "./PhotoModal.vue";
import VideoModal from "./VideoModal.vue";
import TweetText from "./TweetText.vue";
import ToggleText from "./ToggleText.vue";
import ScrollToTop from "./ScrollToTop.vue";
export default {
	props: ["photos", "videos", "user", "result_count"],
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
