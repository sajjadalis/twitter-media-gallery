<template>
	<div id="app">
		<div class="dark:text-gray-50 pb-5">
			<div class="top-gradient h-3"></div>
			<div class="container">
				<Header />
				<router-view />
			</div>
		</div>
	</div>
</template>
<script setup>
import Header from "./components/Header.vue";
</script>
