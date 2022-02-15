<template>
	<button
		@click.prevent="scrollToTop"
		class="fixed bottom-0 right-0 bg-red-500 hover:bg-red-600 p-2 text-white mr-5 mb-5"
		v-tippy="'Back to Top'"
	>
		<ChevronUpIcon class="h-6 w-6" />
	</button>
</template>
<script>
import { ChevronUpIcon } from "@heroicons/vue/outline";
export default {
	components: {
		ChevronUpIcon,
	},
	setup() {
		const scrollToTop = () => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		};

		return { scrollToTop };
	},
};
</script>
