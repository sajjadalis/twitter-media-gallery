<template>
	<div id="app">
		<div class="top-gradient h-3"></div>
		<div class="container">
			<div class="flex flex-col lg:flex-row justify-between items-center mb-3">
				<h1
					class="text-xl lg:text-4xl font-bold text-left uppercase my-5 text-gray-800"
				>
					<a href="/" class="flex flex-row items-center text-orange-600"
						><img src="/twitter.png" class="mr-2 w-10 h-10" />Twitter Media
						Gallery</a
					>
				</h1>
				<div
					class="font-bold text-lg text-gray-800 uppercase flex flex-col lg:flex-row"
				>
					<router-link
						class="w-full px-3 py-2 flex flex-row items-center"
						to="/"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5 mr-1"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>

						User Timeline</router-link
					>
					<router-link class="px-3 py-2 flex flex-row items-center" to="/search"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5 mr-1"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
						Search</router-link
					>
					<router-link class="px-3 py-2 flex flex-row items-center" to="/likes"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-5 w-5 mr-1"
						>
							<path
								d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
							></path>
						</svg>
						Likes</router-link
					>
				</div>
			</div>
			<router-view />
		</div>
	</div>
</template>
