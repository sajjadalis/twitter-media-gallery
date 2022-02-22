<template>
	<div class="font-sans leading-tight bg-grey-lighter mt-5 mb-10">
		<div class="mx-auto bg-white dark:bg-zinc-900 overflow-hidden">
			<div class="bg-cover bg-center bg-gray-200 dark:bg-zinc-700 h-80">
				<a
					v-if="user.profile_banner_url"
					:href="user.profile_banner_url"
					target="_blank"
					><img class="object-cover w-full h-80" :src="user.profile_banner_url"
				/></a>
			</div>
			<div class="flex justify-between px-4">
				<div class="text-center sm:text-left sm:flex mb-2">
					<a
						:href="user.profile_image_url_https.replace('_normal', '')"
						target="_blank"
						><img
							class="h-32 w-32 rounded-full border-[7px] border-white dark:border-zinc-900 -mt-16 mr-4"
							:src="user.profile_image_url_https.replace('_normal', '')"
							alt=""
					/></a>
					<div class="py-2">
						<h3 class="font-bold text-2xl flex items-center leading-tight">
							{{ user.name }}
							<span v-if="user.verified" class="ml-1"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 text-blue-500 mt-1"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/></svg
							></span>
						</h3>
						<div class="inline-flex text-grey-dark sm:flex items-center">
							<a
								:href="'https://twitter.com/' + user.screen_name"
								target="_blank"
								class="hover:text-gray-500 dark:hover:text-gray-300"
								>@{{ user.screen_name }}</a
							>
						</div>
					</div>
				</div>

				<div class="text-right mt-1">
					<div
						class="py-2 flex items-center text-sm text-zinc-700 dark:text-gray-100"
					>
						<span class="mr-3">
							<strong>{{ numFormatter(user.friends_count) }}</strong> Following
						</span>
						<span class="mr-3">
							<strong>{{ numFormatter(user.followers_count) }}</strong>
							Followers
						</span>
						<span class="flex items-center mr-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4 mr-1"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
								></path>
							</svg>
							{{ numFormatter(user.statuses_count) }}
						</span>
						<span v-if="user.entities.url" class="mr-3">
							<a
								:href="user.entities.url.urls[0].expanded_url"
								class="flex items-center hover:text-gray-500 dark:hover:text-gray-300"
								target="_blank"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 mr-1"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
									></path>
									<path
										d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
									></path>
								</svg>
								{{ user.entities.url.urls[0].display_url }}</a
							>
						</span>
						<span class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 mr-1"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
								<line x1="16" y1="2" x2="16" y2="6"></line>
								<line x1="8" y1="2" x2="8" y2="6"></line>
								<line x1="3" y1="10" x2="21" y2="10"></line>
							</svg>

							{{ created_at(user.created_at) }}
						</span>
					</div>
				</div>
			</div>

			<div
				v-if="user.description"
				v-html="user.description"
				class="text-center leading-relaxed"
			></div>
		</div>
	</div>
</template>
<script>
import moment from "moment";
export default {
	props: ["user"],
	setup(props) {
		const created_at = (date) => {
			return moment(date, "dddd MMM DD hh:mm:ss ZZ YYYY").fromNow();
		};

		const numFormatter = (num) => {
			if (num > 999 && num < 1000000) {
				return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
			} else if (num > 1000000) {
				return (num / 1000000).toFixed(0) + "M"; // convert to M for number from > 1 million
			} else if (num < 900) {
				return num; // if value < 1000, nothing to do
			}
		};

		return { created_at, numFormatter };
	},
};
</script>
