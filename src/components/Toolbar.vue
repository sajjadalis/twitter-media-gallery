<template>
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
				@click.prevent="save(props.img.url)"
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
				@click.prevent="$emit('zoomin')"
				class="text-gray-300 hover:text-white inline-block mr-2"
				v-tippy="'Zoom In'"
			>
				<ZoomInIcon class="h-5 w-5" />
			</button>
			<button
				@click.prevent="$emit('zoomout')"
				class="text-gray-300 hover:text-white inline-block mr-2"
				v-tippy="'Zoom Out'"
			>
				<ZoomOutIcon class="h-5 w-5" />
			</button>
			<button
				@click.prevent="$emit('rotleft')"
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
				@click.prevent="$emit('rotright')"
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
</template>
<script setup>
import axios from "axios";
import {
	ExternalLinkIcon,
	ZoomInIcon,
	ZoomOutIcon,
} from "@heroicons/vue/outline";

const props = defineProps(["img"]);

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
</script>
