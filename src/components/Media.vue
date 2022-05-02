<template>
	<div v-if="props.media.length" class="mt-5">
		<masonry :cols="{ default: 4, 1000: 3, 768: 2, 576: 1 }" :gutter="10">
			<div
				v-for="(tweet, i) in props.media"
				:key="i"
				class="relative bg-zinc-100 dark:bg-zinc-800 mb-3"
			>
				<div class="relative">
					<router-link
						class="relative block"
						:to="{
							name: props.type,
							params: {
								id: tweet.media_key,
								data: JSON.stringify(tweet),
								query: props.query,
								index: i,
							},
						}"
					>
						<img
							v-if="tweet.type == 'photo'"
							:src="tweet.url + thumbnails"
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
						@click.prevent="likeMedia(tweet), $emit('like', tweet)"
						class="absolute bottom-2 right-2"
					>
						<HeartIcon
							class="h-5 w-5 hover:transition-all"
							:class="[
								mediaLikes.some((e) => e.media_key === tweet.media_key)
									? 'fill-red-500 text-red-500 hover:text-red-500'
									: 'text-white hover:text-gray-300',
							]"
						/>
					</button>
				</div>

				<TweetText
					v-if="showText == 'true'"
					:img="tweet"
					:query="props.query"
				/>
			</div>
		</masonry>
	</div>

	<div
		class="mt-5 w-full text-white bg-indigo-500 text-center p-2 font-bold text-lg"
		v-if="props.result_count > 0 && !photos.length"
	>
		No photos found
	</div>

	<ToggleThumb
		v-if="media.length"
		@toggleThumb="thumb"
		:showThumb="showThumb"
	/>

	<ToggleText v-if="media.length" @toggle="text" :showText="showText" />

	<ScrollToTop v-if="media.length" />
</template>
<script setup>
import { onMounted, ref } from "vue";
import { HeartIcon } from "@heroicons/vue/outline";
import { PlayIcon } from "@heroicons/vue/solid";
import TweetText from "./TweetText.vue";
import ToggleThumb from "./ToggleThumb.vue";
import ToggleText from "./ToggleText.vue";
import ScrollToTop from "./ScrollToTop.vue";

const mediaLikes = ref([]);
const showText = ref(null);
const showThumb = ref(null);
const thumbnails = ref("?format=jpg&name=small");

const props = defineProps(["media", "query", "result_count", "type"]);

onMounted(() => {
	let media = JSON.parse(localStorage.getItem("media_likes"));
	if (media) {
		mediaLikes.value = media;
	}

	let showTweetText = localStorage.getItem("show_text");
	if (showTweetText) {
		showText.value = showTweetText;
	}

	let showThumbnails = localStorage.getItem("show_thumb");
	if (showThumbnails) {
		showThumb.value = showThumbnails;

		if (showThumbnails == "false") {
			thumbnails.value = "";
		}
	} else {
		showThumb.value = "true";
	}
});

const likeMedia = (media) => {
	if (mediaLikes.value) {
		let index;
		const likeExist = mediaLikes.value.some((e, i) => {
			if (e.media_key === media.media_key) {
				index = i;
				return true;
			}
		});
		if (likeExist) {
			mediaLikes.value.splice(index, 1);
			localStorage.setItem("media_likes", JSON.stringify(mediaLikes.value));
			return;
		}

		mediaLikes.value.push(media);
		localStorage.setItem("media_likes", JSON.stringify(mediaLikes.value));
	}

	if (!mediaLikes.value.length) {
		mediaLikes.value.push(media);
		localStorage.setItem("media_likes", JSON.stringify(mediaLikes.value));
	}
	// console.log(photoLikes.value);
};

const like = (e, type) => {
	if (type == "photo") {
		likeMedia(e);
	}

	if (type == "video") {
		likeMedia(e);
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

const thumb = () => {
	if (showThumb.value == "true") {
		showThumb.value = "false";
		thumbnails.value = "";
	} else {
		showThumb.value = "true";
		thumbnails.value = "?format=jpg&name=small";
	}
	localStorage.setItem("show_thumb", showThumb.value);
};
</script>
