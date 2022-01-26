<template>
	<div id="app">
		<div class="top-gradient h-3"></div>
		<div class="container">
			<div class="flex justify-between items-center">
				<h1 class="text-4xl font-bold text-left uppercase my-5 text-gray-800">
					<a href="/" class="flex flex-row items-center text-orange-600"
						><img src="/twitter.png" class="mr-2 w-10 h-10" />Twitter Media
						Gallery</a
					>
				</h1>
			</div>
			<Home />
		</div>
	</div>
</template>
<script>
import Home from "./Home.vue";
export default {
	components: {
		Home,
	},
};
</script>
