<template>
	<div id="app">
		<div class="dark:text-gray-50 pb-5">
			<div class="top-gradient h-3"></div>
			<div class="container">
				<div
					class="flex flex-col lg:flex-row justify-between items-center mb-3"
				>
					<h1 class="text-xl lg:text-4xl font-bold text-left uppercase my-5">
						<a href="/" class="flex flex-row items-center text-orange-600"
							><img src="/twitter.png" class="mr-2 w-10 h-10" />Twitter Media
							Gallery</a
						>
					</h1>
					<div
						class="font-bold text-lg dark:text-gray-100 uppercase flex flex-col lg:flex-row lg:items-center"
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

							User</router-link
						>
						<router-link
							class="px-3 py-2 flex flex-row items-center"
							to="/search"
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
						<router-link
							class="px-3 py-2 flex flex-row items-center"
							to="/likes"
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

						<Switch
							v-model="isDark"
							:class="
								isDark
									? 'bg-zinc-800 border-zinc-700'
									: 'bg-slate-100 border-slate-200'
							"
							class="ml-2 relative inline-flex flex-shrink-0 h-[32px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
						>
							<span class="sr-only">Dark mode</span>
							<span
								aria-hidden="true"
								:class="
									isDark
										? 'bg-zinc-700 translate-x-9'
										: 'translate-x-0 bg-slate-200'
								"
								class="pointer-events-none inline-block h-[28px] w-[28px] rounded-full shadow-lg transform ring-0 transition ease-in-out duration-200 p-1"
							>
								<svg
									v-if="isDark"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									focusable="false"
									viewBox="0 0 24 24"
									class="text-gray-100"
									fill="currentColor"
								>
									<path
										d="M12.1,22c-0.3,0-0.6,0-0.9,0c-5.5-0.5-9.5-5.4-9-10.9c0.4-4.8,4.2-8.6,9-9c0.4,0,0.8,0.2,1,0.5c0.2,0.3,0.2,0.8-0.1,1.1c-2,2.7-1.4,6.4,1.3,8.4c2.1,1.6,5,1.6,7.1,0c0.3-0.2,0.7-0.3,1.1-0.1c0.3,0.2,0.5,0.6,0.5,1c-0.2,2.7-1.5,5.1-3.6,6.8C16.6,21.2,14.4,22,12.1,22zM9.3,4.4c-2.9,1-5,3.6-5.2,6.8c-0.4,4.4,2.8,8.3,7.2,8.7c2.1,0.2,4.2-0.4,5.8-1.8c1.1-0.9,1.9-2.1,2.4-3.4c-2.5,0.9-5.3,0.5-7.5-1.1C9.2,11.4,8.1,7.7,9.3,4.4z"
									></path>
								</svg>
								<svg
									v-else
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
									focusable="false"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										d="M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18zM12,8c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4C16,9.8,14.2,8,12,8z"
									></path>
									<path
										d="M12,4c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,3.6,12.6,4,12,4z"
									></path>
									<path
										d="M12,24c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,23.6,12.6,24,12,24z"
									></path>
									<path
										d="M5.6,6.6c-0.3,0-0.5-0.1-0.7-0.3L3.5,4.9c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C6.2,6.5,5.9,6.6,5.6,6.6z"
									></path>
									<path
										d="M19.8,20.8c-0.3,0-0.5-0.1-0.7-0.3l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C20.3,20.7,20,20.8,19.8,20.8z"
									></path>
									<path
										d="M3,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S3.6,13,3,13z"
									></path>
									<path
										d="M23,13h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S23.6,13,23,13z"
									></path>
									<path
										d="M4.2,20.8c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C4.7,20.7,4.5,20.8,4.2,20.8z"
									></path>
									<path
										d="M18.4,6.6c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C18.9,6.5,18.6,6.6,18.4,6.6z"
									></path>
								</svg>
							</span>
						</Switch>
					</div>
				</div>
				<router-view />
			</div>
		</div>
	</div>
</template>
<script>
import { onMounted, ref, watch } from "vue";
import { Switch } from "@headlessui/vue";
export default {
	components: { Switch },
	setup() {
		const isDark = ref(false);

		onMounted(() => {
			let dark = localStorage.getItem("isDark");
			if (dark == "true") {
				document.body.classList.add("dark");
				isDark.value = true;
			} else {
				document.body.classList.remove("dark");
			}
		});

		watch(isDark, (val) => {
			if (val) {
				document.body.classList.add("dark");
				localStorage.setItem("isDark", val);
			} else {
				document.body.classList.remove("dark");
				localStorage.setItem("isDark", val);
			}
		});
		return { isDark };
	},
};
</script>
