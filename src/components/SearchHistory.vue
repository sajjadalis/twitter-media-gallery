<template>
	<div v-if="history.length > 0" class="block mt-5 leading-10">
		<span class="mr-2 font-bold">Search History:</span>
		<span class="relative" v-for="(keyword, i) in history" :key="i">
			<span
				class="border bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 py-1 px-2 mr-2 cursor-pointer"
				@click.prevent="$emit('media', keyword)"
				>{{ keyword }}
			</span>
			<button
				class="absolute top-0 right-0"
				@click.prevent="removeHistory(i, keyword)"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 mr-1 -mt-2 hover:text-red-600"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</span>
		<button
			class="border border-red-600 bg-red-500 hover:bg-red-600 text-white py-1 px-2 leading-snug"
			@click.prevent="clearHistory"
		>
			<div class="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 mr-1"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
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
