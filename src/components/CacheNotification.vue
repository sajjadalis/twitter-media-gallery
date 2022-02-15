<template>
	<div
		class="mt-5 w-full bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-gray-100 p-4 font-bold sm:text-sm lg:text-lg flex items-center justify-between uppercase"
		v-if="cache"
	>
		<span class="ml-2"
			>Data is being pulled from local storage. Last Cached:
			<span class="text-indigo-500 dark:text-indigo-400">{{
				cached_on
			}}</span></span
		>
		<button
			class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold uppercase px-4 py-2 flex flex-row items-center ml-3"
			@click.prevent="$emit('refresh')"
		>
			<RefreshIcon class="w-5 h-5 mr-1" />
			Refresh Data
		</button>
	</div>
</template>
<script>
import { RefreshIcon } from "@heroicons/vue/outline";
export default {
	props: ["cache", "cached_on"],
	components: { RefreshIcon },
};
</script>
