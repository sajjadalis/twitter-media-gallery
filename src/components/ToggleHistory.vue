<template>
	<button
		class="p-2"
		:class="[
			showInlineHistory == 'true'
				? 'text-white bg-red-500 hover:bg-red-600'
				: 'text-zinc-400 bg-zinc-700 hover:bg-zinc-800',
		]"
		v-tippy="
			'Toggle Search History between \'Top inline\' or \'Focus on Search input field\''
		"
	>
		<ClockIcon class="w-6 h-6" />
	</button>
</template>
<script>
import { ClockIcon } from "@heroicons/vue/outline";
export default {
	props: {
		showInlineHistory: {
			type: String,
			default: "false",
		},
	},
	components: { ClockIcon },
	setup(props) {
		console.log(props.showSidebar);
	},
};
</script>
