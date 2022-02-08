<template>
	<transition name="popup" type="animation">
		<div
			class="overlay fixed top-0 left-0 bottom-0 right-0 z-10 bg-zinc-900 w-full h-screen bg-opacity-80"
			@click="close"
		>
			<div v-if="showText == 'true'" class="fixed top-0 w-full z-40">
				<div
					class="bg-zinc-900 text-white text-sm text-center p-3 bg-opacity-70 mx-24"
				>
					<a
						v-if="video.username"
						:href="'https://twitter.com/' + video.username"
						target="_blank"
						class="hover:text-yellow-400 font-bold"
						>@{{ video.username }}:</a
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
				disablepictureinpicture
				class="z-10 w-auto mx-auto h-screen"
			>
				<source :src="video.url" type="video/mp4" />
			</video>

			<button
				class="text-gray-400 hover:text-white absolute top-0 right-0 mt-4 mr-4 z-50"
				@click="$emit('close')"
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
				v-tippy="'Toggle Tweet Text'"
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
				class="hover:text-white absolute top-0 right-0 mt-24 mr-4 z-50"
				@click="like"
				v-tippy="'Like'"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-8 w-8 text-gray-400"
					:class="[
						videoLikes.some((e) => e.image === video.image) || liked
							? 'fill-red-500 text-red-500 hover:text-red-500'
							: 'hover:text-white',
					]"
				>
					<path
						d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
					></path>
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
		const videoLikes = ref([]);
		const liked = ref(false);

		onMounted(() => {
			let showTweetText = localStorage.getItem("show_text");
			if (showTweetText) {
				showText.value = showTweetText;
			}

			let videos = JSON.parse(localStorage.getItem("video_likes"));
			if (videos) {
				videoLikes.value = videos;
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
			return moment(date).fromNow();
		};

		const like = () => {
			context.emit("like", props.video);
			liked.value = !liked.value;
		};

		return { showText, text, close, date, videoLikes, liked, like };
	},
};
</script>
