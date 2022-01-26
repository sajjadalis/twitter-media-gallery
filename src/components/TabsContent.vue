<template>
	<TabGroup>
		<TabList class="flex p-1 space-x-1 top-gradient mt-5">
			<Tab as="template" v-slot="{ selected }">
				<button
					:class="[
						'w-full py-2.5 text-lg font-bold uppercase leading-5 text-orange-500 focus:outline-none',
						selected ? 'bg-white shadow' : 'text-orange-50 hover:text-white',
					]"
				>
					Photos <span v-if="photos.length">({{ photos.length }})</span>
				</button>
			</Tab>
			<Tab as="template" v-slot="{ selected }"
				><button
					:class="[
						'w-full py-2.5 text-lg font-bold uppercase leading-5 text-red-500 focus:outline-none',
						selected ? 'bg-white shadow' : 'text-red-50 hover:text-white',
					]"
				>
					Videos <span v-if="videos.length">({{ videos.length }})</span>
				</button>
			</Tab>
		</TabList>
		<TabPanels class="mt-2">
			<TabPanel>
				<div v-if="photos.length" class="mt-5">
					<masonry :cols="4" :gutter="10">
						<div v-for="(img, i) in photos" :key="i">
							<a href="#" @click.prevent="mediaShow(img, i)"
								><img class="item" :src="img.url"
							/></a>
						</div>
					</masonry>
					<PhotoModal
						v-if="showModal"
						:img="singleMedia"
						:user="user"
						@close="showModal = false"
						@next="nextMedia('photo')"
						@prev="prevMedia('photo')"
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
					<masonry :cols="4" :gutter="8">
						<div v-for="(video, i) in videos" :key="i">
							<a
								href="#"
								@click.prevent="mediaShow(video, i)"
								class="relative block mb-2"
								><img :src="video.image" />
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="absolute top-1/2 left-1/2 mx-auto h-12 w-12 -ml-6 -mt-6 opacity-40 text-white"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
										clip-rule="evenodd"
									/>
								</svg>
							</a>
						</div>
					</masonry>
					<VideoModal
						v-if="showModal"
						:video="singleMedia"
						@close="showModal = false"
						@next="nextMedia('video')"
						@prev="prevMedia('video')"
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
</template>
<script>
import { ref } from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import PhotoModal from "./PhotoModal.vue";
import VideoModal from "./VideoModal.vue";
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
	},
	setup(props) {
		const mediaIndex = ref(null);
		const showModal = ref(false);
		const singleMedia = ref(null);
		const artplayer = ref(true);

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

		return {
			mediaShow,
			nextMedia,
			prevMedia,
			mediaIndex,
			showModal,
			singleMedia,
			artplayer,
		};
	},
};
</script>
