<template>
	<transition name="popup" type="animation">
		<div
			class="overlay fixed top-0 left-0 bottom-0 right-0 z-10 bg-gray-900 w-full h-screen bg-opacity-80"
			@click="close"
		>
			<div v-if="showText == 'true'" class="fixed top-0 w-full z-40">
				<div
					class="bg-gray-900 text-white text-sm text-center p-3 bg-opacity-70 mx-24"
				>
					{{ video.text }}
					<span class="text-yellow-300 ml-2"
						>({{ date(video.created_at) }})</span
					>
					<a
						:href="'https://twitter.com/user/status/' + video.id"
						target="_blank"
						class="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 leading-none text-xs ml-2"
						>View Tweet</a
					>
				</div>
			</div>

			<video
				controls
				loop
				autoplay
				preload
				class="z-10 w-auto mx-auto h-screen"
			>
				<source :src="video.url" type="video/mp4" />
			</video>

			<button
				class="text-gray-400 hover:text-white absolute top-0 right-0 mt-4 mr-4 z-50"
				@click="$emit('close')"
				title="Close"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8 m-auto"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<button
				:class="[showText == 'true' ? 'text-white' : 'text-gray-400']"
				class="hover:text-white absolute top-0 right-0 mt-14 mr-4 z-50"
				@click.prevent="text"
				title="Toggle Tweet Text"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
					/>
				</svg>
			</button>

			<button
				class="text-gray-400 hover:text-white absolute top-2/4 right-0 -mt-8 mr-5 z-50"
				@click="$emit('next')"
				@keyup.right="$emit('next')"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>

			<button
				class="text-gray-400 hover:text-white absolute top-2/4 left-0 -mt-8 ml-5 z-50"
				@click="$emit('prev')"
				@keyup.left="$emit('prev')"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
		</div>
	</transition>
</template>
<script>
import { onMounted, ref } from "vue";
import moment from "moment";
export default {
	props: ["video"],
	setup(props, context) {
		const showText = ref(null);

		onMounted(() => {
			let showTweetText = localStorage.getItem("show_text");
			if (showTweetText) {
				showText.value = showTweetText;
			}
		});

		const text = () => {
			if (showText.value == "true") {
				showText.value = "false";
			} else {
				showText.value = "true";
			}
			localStorage.setItem("show_text", showText.value);
		};

		const close = (e) => {
			let classes = e.path[0].className;
			if (typeof classes == "string" && classes.includes("overlay")) {
				context.emit("close");
			}
		};

		const date = (date) => {
			return moment(date, "YYYYMMDD").fromNow();
		};

		return { showText, text, close, date };
	},
};
</script>
