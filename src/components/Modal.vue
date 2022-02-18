<template>
	<transition
		enter-active-class="duration-150 ease-out"
		enter-from-class="opacity-0 scale-95"
		enter-to-class="opacity-100 scale-100"
		leave-active-class="duration-100 ease-in"
		leave-from-class="opacity-100 scale-100"
		leave-to-class="opacity-0 scale-95"
	>
		<div
			class="overlay fixed top-0 left-0 bottom-0 right-0 z-10 bg-zinc-900 w-full h-full bg-opacity-80 py-7"
			@click="close"
		>
			<div class="w-5/6 h-full mx-auto bg-black relative">
				<video
					v-if="video"
					controls
					loop
					autoplay
					preload
					disablepictureinpicture
					class="z-10 mx-auto w-full h-full"
				>
					<source :src="video.url" type="video/mp4" />
				</video>

				<div v-else class="animate-pulse w-full h-full bg-gray-200"></div>
			</div>

			<button
				class="text-gray-400 hover:text-white absolute top-0 right-0 mt-4 mr-4 z-50"
				@click="$router.back()"
			>
				<XIcon class="h-8 w-8" />
			</button>
		</div>
	</transition>
</template>
<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import getVideo from "../composeables/getVideo";
import {
	ExternalLinkIcon,
	ZoomInIcon,
	ZoomOutIcon,
	XIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	HeartIcon,
} from "@heroicons/vue/outline";

// const props = defineProps({ post, user });

const router = useRouter();
const route = useRoute();

const id = ref(route.params.id);
const video = ref(null);

onMounted(async () => {
	video.value = await getVideo(id.value);
	console.log(video.value);
});

const close = (e) => {
	let classes = e.path[0].className;
	if (typeof classes == "string" && classes.includes("overlay")) {
		router.back();
	}
};
</script>
