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
					class="hidden md:space-x-2 md:flex md:flex-row md:items-center uppercase font-bold"
				>
					<router-link class="px-3 py-2 flex flex-row items-center" to="/">
						<UserIcon class="h-5 w-5 mr-1" />User</router-link
					>
					<router-link
						class="px-3 py-2 flex flex-row items-center"
						to="/search"
					>
						<SearchIcon class="h-5 w-5 mr-1" />Search</router-link
					>
					<router-link class="px-3 py-2 flex flex-row items-center" to="/likes">
						<HeartIcon class="h-5 w-5 mr-1" />Likes</router-link
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
							<UserIcon class="h-5 w-5 mr-1" />User</router-link
						>
						<router-link
							class="px-3 py-2 flex flex-row items-center"
							to="/search"
						>
							<SearchIcon class="h-5 w-5 mr-1" />Search</router-link
						>
						<router-link
							class="px-3 py-2 flex flex-row items-center"
							to="/likes"
						>
							<HeartIcon class="h-5 w-5 mr-1" />Likes</router-link
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
import {
	MenuIcon,
	XIcon,
	UserIcon,
	HeartIcon,
	SearchIcon,
	SunIcon,
	MoonIcon,
} from "@heroicons/vue/outline";

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
