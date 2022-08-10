<template>
	<button
		@click.prevent="$emit('toggleThumb')"
		:class="[
			showThumb == 'true'
				? 'text-white bg-red-500 hover:bg-red-600'
				: 'text-zinc-400 bg-zinc-700 hover:bg-zinc-800',
		]"
		class="p-2"
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
