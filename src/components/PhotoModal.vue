<template>
	<transition name="popup" type="animation">
		<div
			class="overlay fixed top-0 left-0 bottom-0 right-0 z-10 bg-gray-900 w-full h-screen bg-opacity-80"
			@click="close"
		>
			<div v-if="showText == 'true'" class="absolute top-0 w-full z-40">
				<div
					class="bg-gray-900 text-white text-sm text-center p-3 bg-opacity-70 mx-24"
				>
					{{ img.text }} ({{ created_at(img.created_at) }})
				</div>
			</div>

			<img :src="img.url" class="w-auto h-full m-auto" :style="style" />

			<div class="absolute bottom-0 left-1/2 z-50 mb-2">
				<div
					class="relative bg-gray-900 py-2 px-3 rounded bg-opacity-50 leading-none"
					style="left: -50%"
				>
					<a
						:href="img.url"
						target="_blank"
						class="text-gray-300 hover:text-white inline-block mr-2"
						title="Open in New Tab"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5"
						>
							<path
								d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
							></path>
							<polyline points="15 3 21 3 21 9"></polyline>
							<line x1="10" y1="14" x2="21" y2="3"></line></svg
					></a>
					<a
						href="#"
						@click.prevent="save(img)"
						class="text-gray-300 hover:text-white inline-block mr-2"
						title="Save"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5"
						>
							<path
								d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
							></path>
							<polyline points="17 21 17 13 7 13 7 21"></polyline>
							<polyline points="7 3 7 8 15 8"></polyline></svg
					></a>
					<a
						href="#"
						@click.prevent="zoom('in')"
						class="text-gray-300 hover:text-white inline-block mr-2"
						title="Zoom In"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
							<line x1="11" y1="8" x2="11" y2="14"></line>
							<line x1="8" y1="11" x2="14" y2="11"></line></svg
					></a>
					<a
						href="#"
						@click.prevent="zoom('out')"
						class="text-gray-300 hover:text-white inline-block mr-2"
						title="Zoom Out"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
							<line x1="8" y1="11" x2="14" y2="11"></line></svg
					></a>
					<a
						href="#"
						@click.prevent="rotate('left')"
						class="text-gray-300 hover:text-white inline-block mr-2"
						title="Rotate Anti-Clockwise"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5"
						>
							<polyline points="1 4 1 10 7 10"></polyline>
							<path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg
					></a>
					<a
						href="#"
						@click.prevent="rotate('right')"
						class="text-gray-300 hover:text-white inline-block"
						title="Rotate Clockwise"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5"
						>
							<polyline points="23 4 23 10 17 10"></polyline>
							<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg
					></a>
				</div>
			</div>

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
				class="text-gray-300 hover:text-white absolute top-2/4 right-0 -mt-8 mr-5"
				@click="$emit('next')"
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
				class="text-gray-300 hover:text-white absolute top-2/4 left-0 -mt-8 ml-5"
				@click="$emit('prev')"
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
import axios from "axios";
import { onMounted, ref } from "vue";
import moment from "moment";
export default {
	props: ["img", "user"],
	setup(props, context) {
		const style = ref({});
		const rot = ref(0);
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

		const save = (val) => {
			return axios
				.get(val, {
					responseType: "blob", // important
				})
				.then((response) => {
					var index = val.lastIndexOf("/") + 1;
					var filename = props.user + "-" + val.substr(index);

					const url = window.URL.createObjectURL(new Blob([response.data]));

					const link = document.createElement("a");
					link.href = url;

					link.setAttribute("download", filename); //or any other extension
					document.body.appendChild(link);
					link.click();
				});
		};

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

		const created_at = (date) => {
			//return moment(date).format("MMMM Do YYYY, h:mm:ss a");
			return moment(date, "YYYYMMDD").fromNow();
		};

		const hello = () => {
			console.log("q pressed");
		};

		return {
			style,
			rot,
			showText,
			text,
			close,
			save,
			zoom,
			rotate,
			created_at,
			hello,
		};
	},
};
</script>
<style>
.scroll::-webkit-scrollbar {
	display: none;
}
</style>
