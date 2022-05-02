<template>
	<button
		@click.prevent="$emit('toggleThumb')"
		:class="[
			showThumb == 'true'
				? 'text-white bg-red-500 hover:bg-red-600'
				: 'text-zinc-400 bg-zinc-700 hover:bg-zinc-800',
		]"
		class="fixed bottom-0 right-0 p-2 mr-5 mb-[7.2rem]"
		v-tippy="'Toggle Thumbnails with Original Pictures'"
	>
		<EyeIcon class="w-6 h-6" />
	</button>
</template>
<script>
import { EyeIcon } from "@heroicons/vue/outline";
export default {
	props: {
		showThumb: {
			type: String,
			default: "true",
		},
	},
	components: { EyeIcon },
};
</script>
