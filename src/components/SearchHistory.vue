<template>
	<div v-if="history.length > 0" class="block mt-5 leading-10">
		<span class="mr-2 font-bold">Recent Search History:</span>
		<span class="relative" v-for="(keyword, i) in history" :key="i">
			<span
				class="border bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-900 py-1 px-2 mr-2 cursor-pointer"
				@click.prevent="$emit('media', keyword)"
				>{{ keyword }}
			</span>
			<button
				class="absolute top-0 right-0"
				@click.prevent="removeHistory(i, keyword)"
			>
				<XCircleIcon
					class="h-4 w-4 mr-1 -mt-2 text-slate-600 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-600"
				/>
			</button>
		</span>
		<button
			class="border border-red-600 bg-red-500 hover:bg-red-600 text-white py-1 px-2 leading-snug"
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
