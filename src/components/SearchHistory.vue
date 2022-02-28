<template>
	<div
		v-if="history.length > 0"
		class="block leading-10 w-2/3 max-h-96 overflow-y-auto scrollbar scrollbar-thumb-slate-300 scrollbar-track-slate-200 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-600 absolute top-0 bg-slate-100 dark:bg-zinc-800"
	>
		<h3 class="pl-2 py-1 font-bold">Search History</h3>
		<div class="relative" v-for="(keyword, i) in history" :key="i">
			<span
				class="border-t bg-slate-100 border-slate-200 hover:bg-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-900 py-1 px-2 mr-2 cursor-pointer block"
				@mousedown.prevent
				@click.prevent="$emit('media', keyword)"
				>{{ keyword }}
			</span>
			<button
				class="absolute top-0 right-0"
				@mousedown.prevent
				@click.prevent="removeHistory(i, keyword)"
			>
				<XCircleIcon
					class="h-4 w-4 mr-7 mt-4 text-slate-600 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-600"
				/>
			</button>
		</div>
		<button
			class="border border-red-600 bg-red-500 hover:bg-red-600 text-white py-1 px-2 leading-snug"
			@mousedown.prevent
			@click.prevent="clearHistory"
		>
			<div class="flex items-center">
				<TrashIcon class="h-4 w-4 mr-1" />
				Clear All
			</div>
		</button>
	</div>
</template>
<script>
import { XCircleIcon, TrashIcon } from "@heroicons/vue/solid";
export default {
	props: ["history", "type"],
	emits: ["media"],
	components: { XCircleIcon, TrashIcon },
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
