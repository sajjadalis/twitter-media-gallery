<template>
	<form @submit.prevent="$emit('search')" class="flex flex-col md:flex-row">
		<div class="relative md:flex-1 md:mr-2">
			<input
				type="text"
				data-lpignore="true"
				:placeholder="placeholder"
				class="w-full focus:shadow-red-500 dark:bg-zinc-800 dark:border-zinc-700"
				:value="query"
				@focus="showHistory = true"
				@blur="showHistory = false"
				@input="$emit('update:query', $event.target.value)"
			/>
			<span
				class="absolute top-0 right-0 mt-3 mr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
				@click.prevent="$emit('update:query', '')"
			>
				<XIcon v-if="query" class="h-5 w-5" />
			</span>

			<div
				v-if="history.length > 0 && showInlineHistory == 'false'"
				v-show="showHistory"
				class="absolute top-11 leading-10 w-full max-h-96 overflow-y-auto scrollbar scrollbar-thumb-slate-300 scrollbar-track-slate-200 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-600 bg-slate-100 dark:bg-zinc-800 shadow border-2 mt-[-1px] border-t-0 border-slate-200 z-10 scroll-width"
			>
				<div class="flex items-center justify-between py-2">
					<h3 class="pl-2 font-bold mr-2 leading-none">Search History</h3>
					<span
						class="border border-red-600 bg-red-500 hover:bg-red-600 text-white px-2 text-center leading-none text-xs py-1 mr-3 cursor-pointer block"
						@mousedown.prevent
						@click.prevent="clearHistory"
					>
						<div class="flex items-center leading-none">
							<TrashIcon class="h-3 w-3 mr-1" />
							Clear All
						</div>
					</span>
				</div>
				<div class="relative" v-for="(keyword, i) in history" :key="i">
					<span
						class="border-t bg-slate-100 border-slate-200 hover:bg-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-900 py-1 px-2 mr-2 cursor-pointer block"
						@mousedown.prevent
						@click.prevent="$emit('media', keyword)"
						>{{ keyword }}
					</span>
					<span
						class="absolute top-0 right-0 cursor-pointer block"
						@mousedown.prevent
						@click.prevent="removeHistory(i, keyword)"
					>
						<XCircleIcon
							class="h-4 w-4 mr-7 mt-4 text-slate-600 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-600"
						/>
					</span>
				</div>
			</div>
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
import { XCircleIcon, TrashIcon } from "@heroicons/vue/solid";
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
			default: "twitter username",
		},
		type: {
			type: String,
		},
		history: {
			type: Array,
		},
		showHistory: {
			type: Boolean,
			default: false,
		},
		showInlineHistory: {
			type: String,
			default: "false",
		},
	},
	components: {
		XIcon,
		PhotographIcon,
		XCircleIcon,
		TrashIcon,
	},
	setup(props) {
		const removeHistory = (i, keyword) => {
			props.history.splice(i, 1);
			localStorage.setItem(props.type, JSON.stringify(props.history));
			if (props.type == "user_history") {
				localStorage.removeItem("u_" + keyword);
			}

			if (props.type == "search_history") {
				localStorage.removeItem("q_" + keyword);
			}
		};

		const clearHistory = () => {
			let len = props.history.length;
			localStorage.removeItem(props.type);
			props.history.splice(0, len);
		};

		return { removeHistory, clearHistory };
	},
};
</script>
