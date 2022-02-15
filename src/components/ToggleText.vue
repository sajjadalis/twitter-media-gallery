<template>
	<button
		@click.prevent="$emit('toggle')"
		:class="[
			showText == 'true'
				? 'text-white bg-red-500 hover:bg-red-600'
				: 'text-zinc-400 bg-zinc-700 hover:bg-zinc-800',
		]"
		class="fixed bottom-0 right-0 p-2 mr-5 mb-[4.2rem]"
		v-tippy="'Toggle Tweet Text'"
	>
		<AnnotationIcon class="w-6 h-6" />
	</button>
</template>
<script>
import { AnnotationIcon } from "@heroicons/vue/outline";
export default {
	props: {
		showText: {
			type: String,
			default: "true",
		},
	},
	components: { AnnotationIcon },
};
</script>
