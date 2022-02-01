<template>
	<button
		@click.prevent="scrollToTop"
		class="fixed bottom-0 right-0 bg-red-500 p-2 text-white mr-5 mb-5"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M5 15l7-7 7 7"
			/>
		</svg>
	</button>
</template>
<script>
export default {
	setup() {
		const scrollToTop = () => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		};

		return { scrollToTop };
	},
};
</script>
