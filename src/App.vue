<template>
	<div id="app">
		<div class="top-gradient h-3"></div>
		<div class="container">
			<div class="flex justify-between items-center mb-3">
				<h1 class="text-4xl font-bold text-left uppercase my-5 text-gray-800">
					<a href="/" class="flex flex-row items-center text-orange-600"
						><img src="/twitter.png" class="mr-2 w-10 h-10" />Twitter Media
						Gallery</a
					>
				</h1>
				<div class="font-bold text-lg text-gray-800 uppercase">
					<router-link class="px-3 py-2" to="/">User Timeline</router-link>
					<router-link class="px-3 py-2" to="/search">Search</router-link>
				</div>
			</div>
			<router-view />
		</div>
	</div>
</template>
