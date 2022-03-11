<template>
	<div
		class="fixed top-0 left-0 bottom-0 right-0 z-10 w-full h-full bg-opacity-80 py-7 text-center"
	>
		<div
			class="overlay bg-zinc-900 absolute top-0 left-0 bottom-0 right-0 w-full h-full bg-opacity-80 -z-10"
			@click="close"
		></div>
		<div
			v-if="data && data.type == 'photo'"
			class="inline-block mx-auto -mt-7 z-20"
		>
			<img :src="data.url" :style="style" class="w-auto h-screen m-auto" />
			<Toolbar
				:img="data"
				:user="route.params.user"
				@rotleft="rotate('left')"
				@rotright="rotate('right')"
				@zoomin="zoom('in')"
				@zoomout="zoom('out')"
			/>
		</div>

		<div v-else class="w-5/6 h-full mx-auto bg-black relative z-50">
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
			@click="
				router.push({
					name: props.type,
					query: { q: route.params.query },
				})
			"
		>
			<XIcon class="h-8 w-8" />
		</button>

		<button
			class="text-gray-300 hover:text-white absolute top-2/4 right-0 -mt-8 mr-5"
			@click="nav('next')"
		>
			<ChevronRightIcon class="h-8 w-8" />
		</button>

		<button
			class="text-gray-300 hover:text-white absolute top-2/4 left-0 -mt-8 ml-5"
			@click="nav('prev')"
		>
			<ChevronLeftIcon class="h-8 w-8" />
		</button>
	</div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { onKeyStroke, onClickOutside } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import getVideo from "../composeables/getVideo";
import Toolbar from "../components/Toolbar.vue";
import {
	XIcon,
	ChevronRightIcon,
	ChevronLeftIcon,
} from "@heroicons/vue/outline";

// const props = defineProps({ post, user });

const router = useRouter();
const route = useRoute();

const data = ref(route.params.data);
const video = ref(null);

const emits = defineEmits(["next", "prev"]);
const props = defineProps(["type"]);

const nav = (val) => {
	if (val == "next") {
		emits("next", route.params.index);
	}

	if (val == "prev") {
		emits("prev", route.params.index);
	}
};

onKeyStroke("ArrowRight", (e) => {
	e.preventDefault();
	console.log("next media");
	emits("next", route.params.index);
});

onKeyStroke("ArrowLeft", (e) => {
	e.preventDefault();
	console.log("prev media");
	emits("prev", route.params.index);
});

const close = () => {
	let endpoint = { name: props.type };
	if (route.params && route.params.query) {
		endpoint.query = { q: route.params.query };
	}
	router.push(endpoint);
};

onKeyStroke("Escape", (e) => {
	e.preventDefault();
	console.log("close");
	close();
});

onMounted(async () => {
	if (data.value) {
		data.value = JSON.parse(data.value);
		if (data.value.type != "photo") {
			video.value = await getVideo(data.value.id);
		}
	} else {
		router.push({
			name: "user",
		});
	}
});

const style = ref({});

const zoom = (val) => {
	if (val == "in") {
		style.value = {
			transform: "scale(1.5)",
			transition: "transform 0.25s ease",
		};
	}
	if (val == "out") {
		style.value = {
			transform: "scale(1)",
			transition: "transform 0.25s ease",
		};
	}
};

const rot = ref(0);

const rotate = (val) => {
	if (val == "right") {
		rot.value += 90;
	} else if (val == "left") {
		rot.value += -90;
	}

	style.value = {
		transform: "rotate(" + rot.value + "deg)",
		transition: "transform 0.25s ease",
	};
};
</script>
