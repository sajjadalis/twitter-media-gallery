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
			class="overlay fixed top-0 left-0 bottom-0 right-0 z-10 bg-zinc-900 w-full h-screen bg-opacity-80"
			@click="close"
		>
			<img
				:src="img.url"
				class="w-auto h-full m-auto object-cover"
				:style="style"
			/>

			<div class="absolute bottom-0 left-1/2 z-50 mb-2">
				<div
					class="relative bg-zinc-900 py-2 px-3 rounded bg-opacity-50 leading-none"
					style="left: -50%"
				>
					<a
						:href="img.url"
						target="_blank"
						class="text-gray-300 hover:text-white inline-block mr-2"
						v-tippy="'Open in New Tab'"
						><ExternalLinkIcon class="h-5 w-5"
					/></a>
					<button
						@click.prevent="save(img.url)"
						class="text-gray-300 hover:text-white inline-block mr-2"
						v-tippy="'Save Photo'"
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
							class="h-5 w-5"
						>
							<path
								d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
							></path>
							<polyline points="17 21 17 13 7 13 7 21"></polyline>
							<polyline points="7 3 7 8 15 8"></polyline>
						</svg>
					</button>
					<button
						@click.prevent="zoom('in')"
						class="text-gray-300 hover:text-white inline-block mr-2"
						v-tippy="'Zoom In'"
					>
						<ZoomInIcon class="h-5 w-5" />
					</button>
					<button
						@click.prevent="zoom('out')"
						class="text-gray-300 hover:text-white inline-block mr-2"
						v-tippy="'Zoom Out'"
					>
						<ZoomOutIcon class="h-5 w-5" />
					</button>
					<button
						@click.prevent="rotate('left')"
						class="text-gray-300 hover:text-white inline-block mr-2"
						v-tippy="'Rotate Anti-Clockwise'"
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
							class="h-5 w-5"
						>
							<polyline points="1 4 1 10 7 10"></polyline>
							<path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
						</svg>
					</button>
					<button
						@click.prevent="rotate('right')"
						class="text-gray-300 hover:text-white inline-block"
						v-tippy="'Rotate Clockwise'"
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
							class="h-5 w-5"
						>
							<polyline points="23 4 23 10 17 10"></polyline>
							<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
						</svg>
					</button>
				</div>
			</div>

			<button
				class="text-gray-400 hover:text-white absolute top-0 right-0 mt-4 mr-4 z-50"
				@click="$emit('close')"
			>
				<XIcon class="h-8 w-8" />
			</button>

			<button
				class="hover:text-white absolute top-0 right-0 mt-16 mr-4 z-50"
				@click="like"
				v-tippy="'Like'"
			>
				<HeartIcon
					class="h-8 w-8 text-gray-400"
					:class="[
						photoLikes.some((e) => e.media_key === img.media_key) || liked
							? 'fill-red-500 text-red-500 hover:text-red-500'
							: 'hover:text-white',
					]"
				/>
			</button>

			<button
				class="text-gray-300 hover:text-white absolute top-2/4 right-0 -mt-8 mr-5"
				@click="$emit('next')"
			>
				<ChevronRightIcon class="h-8 w-8" />
			</button>

			<button
				class="text-gray-300 hover:text-white absolute top-2/4 left-0 -mt-8 ml-5"
				@click="$emit('prev')"
			>
				<ChevronLeftIcon class="h-8 w-8" />
			</button>
		</div>
	</transition>
</template>
<script>
import axios from "axios";
import { onMounted, ref } from "vue";
import {
	ExternalLinkIcon,
	ZoomInIcon,
	ZoomOutIcon,
	XIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	HeartIcon,
} from "@heroicons/vue/outline";
import moment from "moment";
export default {
	props: ["img", "user"],
	components: {
		ExternalLinkIcon,
		ZoomInIcon,
		ZoomOutIcon,
		XIcon,
		ChevronLeftIcon,
		ChevronRightIcon,
		HeartIcon,
	},
	setup(props, context) {
		const style = ref({});
		const rot = ref(0);
		const photoLikes = ref([]);
		const liked = ref(false);

		onMounted(() => {
			let photos = JSON.parse(localStorage.getItem("photo_likes"));
			if (photos) {
				photoLikes.value = photos;
			}
		});

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

		const date = (date) => {
			return moment(date).fromNow();
		};

		const like = () => {
			context.emit("like", props.img);
			liked.value = !liked.value;
		};

		return {
			style,
			rot,
			photoLikes,
			close,
			save,
			zoom,
			rotate,
			date,
			like,
			liked,
		};
	},
};
</script>
<style>
.scroll::-webkit-scrollbar {
	display: none;
}
</style>
