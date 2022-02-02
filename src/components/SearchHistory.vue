<template>
	<div v-if="search_history.length > 0" class="block mt-5 leading-10">
		<span class="mr-2 font-bold">Recent Search History:</span>
		<span class="relative" v-for="(keyword, i) in search_history" :key="i">
			<span
				class="border bg-slate-100 hover:bg-slate-200 py-1 px-2 mr-2 cursor-pointer"
				@click.prevent="$emit('media', keyword)"
				>{{ keyword }}
			</span>
			<button class="absolute top-0 right-0" @click.prevent="removeHistory(i)">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 mr-1 -mt-2 text-slate-600 hover:text-red-600"
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
export default {
	props: ["search_history"],
	emits: ["media"],
	setup(props) {
		const removeHistory = (i) => {
			props.search_history.splice(i, 1);
			localStorage.setItem(
				"search_history",
				JSON.stringify(props.search_history)
			);
		};

		const clearHistory = () => {
			let len = props.search_history.length;
			localStorage.removeItem("search_history");
			props.search_history.splice(0, len);
		};

		return { removeHistory, clearHistory };
	},
};
</script>
