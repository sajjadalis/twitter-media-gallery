<template>
	<form @submit.prevent="$emit('search')" class="flex flex-col md:flex-row">
		<div class="relative md:flex-1 md:mr-2">
			<input
				type="text"
				data-lpignore="true"
				:placeholder="placeholder"
				class="w-full focus:shadow-red-500 dark:bg-zinc-800 dark:border-zinc-700"
				:value="query"
				@input="$emit('update:query', $event.target.value)"
			/>
			<span
				class="absolute top-0 right-0 mt-3 mr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
				@click.prevent="$emit('update:query', '')"
			>
				<XIcon v-if="query" class="h-5 w-5" />
			</span>
		</div>
		<div class="flex mt-6 md:mt-0 md:mx-0">
			<div class="mr-2 w-80 md:w-40">
				<input
					type="number"
					class="w-full dark:bg-zinc-800 dark:border-zinc-700"
					placeholder="Tweets (5 to 100)"
					:value="items"
					@input="$emit('update:items', $event.target.value)"
				/>
			</div>
			<div class="relative mr-2">
				<label class="absolute top-0 -mt-5 text-2xs">Retweets</label>
				<input
					type="checkbox"
					:checked="retweets"
					@input="$emit('update:retweets', $event.target.checked)"
					class="text-red-500 w-10 h-10 dark:bg-zinc-800 dark:border-zinc-700"
				/>
			</div>
			<div class="relative mr-2">
				<label class="absolute top-0 -mt-5 text-2xs">Replies</label>
				<input
					type="checkbox"
					:checked="replies"
					@change="$emit('update:replies', $event.target.checked)"
					class="text-red-500 w-10 h-10 dark:bg-zinc-800 dark:border-zinc-700"
				/>
			</div>
		</div>
		<div class="w-full md:w-40 mt-3 md:mt-0 mx-auto">
			<button
				type="submit"
				class="uppercase font-bold text-lg bg-red-500 hover:bg-red-600 text-white py-2 px-4 w-full flex flex-row items-center leading-snug"
			>
				<PhotographIcon class="h-5 w-5 mr-1" />
				Get Media
			</button>
		</div>
	</form>
</template>
<script>
import { XIcon, PhotographIcon } from "@heroicons/vue/outline";
export default {
	props: {
		query: {
			type: String,
			default: "",
			required: true,
		},
		items: {
			type: Number,
			default: 100,
			required: true,
		},
		retweets: {
			type: Boolean,
			default: false,
		},
		replies: {
			type: Boolean,
			default: true,
		},
		placeholder: {
			type: String,
			default: "Twitter Username",
		},
	},
	components: {
		XIcon,
		PhotographIcon,
	},
};
</script>
