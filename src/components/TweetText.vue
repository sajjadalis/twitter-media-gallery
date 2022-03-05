<template>
	<div class="text-xs p-2 dark:text-zinc-400 mt-0">
		<div class="break-words" v-html="textWithLinks(img.text)"></div>

		<div class="mt-2 flex items-center">
			<a
				:href="'/?q=' + (img.username ?? query)"
				target="_blank"
				class="hover:text-gray-500 dark:hover:text-gray-100 flex flex-row items-center"
				><UserIcon class="w-3 h-3 mr-1" /> {{ img.username ?? query }}</a
			>

			<a
				:href="
					'https://twitter.com/' + (img.username ?? query) + '/status/' + img.id
				"
				class="hover:text-gray-500 dark:hover:text-gray-100 flex flex-row items-center ml-2"
				target="_blank"
				><ClockIcon class="w-3 h-3 mr-1" /> {{ date(img.created_at) }}</a
			>

			<span
				v-if="img.public_metrics && img.public_metrics.like_count"
				class="flex flex-row items-center ml-2"
				><HeartIcon class="h-3 w-3 mr-1" />
				{{ img.public_metrics.like_count }}</span
			>

			<span
				v-if="img.public_metrics && img.public_metrics.retweet_count"
				class="flex flex-row items-center ml-2"
				><RefreshIcon class="h-3 w-3 mr-1" />
				{{ img.public_metrics.retweet_count }}</span
			>

			<span
				v-if="img.public_metrics && img.public_metrics.reply_count"
				class="flex flex-row items-center ml-2"
				><ChatIcon class="h-3 w-3 mr-1" />
				{{ img.public_metrics.reply_count }}</span
			>
		</div>
	</div>
</template>
<script>
import moment from "moment";
import {
	UserIcon,
	ClockIcon,
	HeartIcon,
	RefreshIcon,
	ChatIcon,
} from "@heroicons/vue/outline";
export default {
	props: ["img", "query"],
	components: { UserIcon, ClockIcon, HeartIcon, RefreshIcon, ChatIcon },
	setup() {
		const date = (date) => {
			return moment(date).fromNow();
		};

		const textWithLinks = (val) => {
			let text = val.replace(
				/#(\w+)/g,
				'<a href="/search?q=%23$1" class="hover:text-gray-500 dark:hover:text-gray-100" target="_blank">#$1</a>'
			);

			text = text.replace(
				/@(\w+)/g,
				'<a href="/?q=$1" class="hover:text-gray-500 dark:hover:text-gray-100" target="_blank">@$1</a>'
			);

			text = text.replace(
				/(\b((https?|ftp|file):\/\/|(www))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]*)/gi,
				'<a href="$1" class="hover:text-gray-500 dark:hover:text-gray-100" target="_blank">$1</a>'
			);

			return text;
		};

		return { date, textWithLinks };
	},
};
</script>
