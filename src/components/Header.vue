<template>
	<Popover class="my-7">
		<div class="relative">
			<nav
				class="relative flex items-center justify-between sm:h-10"
				aria-label="Global"
			>
				<div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
					<div class="flex items-center justify-between w-full md:w-auto">
						<a href="/" class="flex items-center">
							<img class="h-8 w-auto mr-2 sm:h-10" src="/twitter.png" />
							<span class="text-xl md:text-2xl uppercase font-bold"
								>Twitter Media Gallery</span
							>
						</a>
						<div class="-mr-2 flex items-center md:hidden">
							<PopoverButton
								class="bg-white dark:bg-zinc-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
							>
								<span class="sr-only">Open main menu</span>
								<MenuIcon class="h-6 w-6" aria-hidden="true" />
							</PopoverButton>
						</div>
					</div>
				</div>
				<div
					class="hidden md:space-x-2 md:flex md:flex-row md:items-center text-lg uppercase font-bold"
				>
					<router-link class="px-3 py-2 flex flex-row items-center" to="/">
						<svg
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
					<router-link
						class="px-3 py-2 flex flex-row items-center"
						to="/search"
					>
						<svg
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
					<router-link class="px-3 py-2 flex flex-row items-center" to="/likes">
						<svg
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
						class="relative inline-flex flex-shrink-0 h-[32px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
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
							<MoonIcon v-if="isDark" class="text-gray-100" />
							<SunIcon v-else />
						</span>
					</Switch>
				</div>
			</nav>
		</div>

		<transition
			enter-active-class="duration-150 ease-out"
			enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="duration-100 ease-in"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<PopoverPanel
				focus
				class="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
			>
				<div
					class="rounded-lg shadow-md bg-white dark:bg-zinc-800 ring-1 ring-black ring-opacity-5 overflow-hidden"
				>
					<div class="px-5 pt-4 flex items-center justify-between">
						<Switch
							v-model="isDark"
							:class="
								isDark
									? 'bg-zinc-700 border-zinc-700'
									: 'bg-slate-100 border-slate-200'
							"
							class="relative inline-flex flex-shrink-0 h-[32px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
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
								<MoonIcon v-if="isDark" class="text-gray-100" />
								<SunIcon v-else />
							</span>
						</Switch>
						<div class="-mr-2">
							<PopoverButton
								class="bg-white dark:bg-zinc-700 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
							>
								<span class="sr-only">Close main menu</span>
								<XIcon class="h-6 w-6" aria-hidden="true" />
							</PopoverButton>
						</div>
					</div>
					<div class="px-2 pt-2 pb-3 space-y-1">
						<router-link class="px-3 py-2 flex flex-row items-center" to="/">
							<svg
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
						>
							<svg
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
						>
							<svg
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
			</PopoverPanel>
		</transition>
	</Popover>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { Switch, Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { MenuIcon, XIcon, SunIcon, MoonIcon } from "@heroicons/vue/outline";

const isDark = ref(false);

onMounted(() => {
	let dark = localStorage.getItem("isDark");
	if (dark == "true") {
		document.documentElement.classList.add("dark");
		isDark.value = true;
	} else {
		document.documentElement.classList.remove("dark");
	}
});

watch(isDark, (val) => {
	if (val) {
		document.documentElement.classList.add("dark");
		localStorage.setItem("isDark", val);
	} else {
		document.documentElement.classList.remove("dark");
		localStorage.setItem("isDark", val);
	}
});
</script>
