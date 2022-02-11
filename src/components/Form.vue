<template>
	<form @submit.prevent="$emit('search')" class="flex flex-col lg:flex-row">
		<div class="relative lg:flex-1 lg:mr-2">
			<input
				type="text"
				data-lpignore="true"
				:placeholder="placeholder"
				class="w-full focus:shadow-red-500 dark:bg-zinc-800 dark:border-zinc-700"
				:value="query"
				@input="$emit('update:query', $event.target.value)"
			/>
			<span
				class="absolute top-0 right-0 mt-3 mr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
				@click.prevent="$emit('update:query', '')"
			>
				<svg
					v-if="query"
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</div>
		<div class="flex mt-6 lg:mt-0 lg:mx-0">
			<div class="mr-2 w-80 lg:w-40">
				<input
					type="number"
					class="w-full dark:bg-zinc-800 dark:border-zinc-700"
					placeholder="Tweets (5 to 100)"
					:value="items"
					@input="$emit('update:items', $event.target.value)"
				/>
			</div>
			<div class="relative mr-2">
				<label class="absolute top-0 -mt-5 text-2xs">Retweets</label>
				<input
					type="checkbox"
					:checked="retweets"
					@input="$emit('update:retweets', $event.target.checked)"
					class="text-red-500 w-10 h-10 dark:bg-zinc-800 dark:border-zinc-700"
				/>
			</div>
			<div class="relative mr-2">
				<label class="absolute top-0 -mt-5 text-2xs">Replies</label>
				<input
					type="checkbox"
					:checked="replies"
					@change="$emit('update:replies', $event.target.checked)"
					class="text-red-500 w-10 h-10 dark:bg-zinc-800 dark:border-zinc-700"
				/>
			</div>
		</div>
		<div class="w-full lg:w-40 mt-3 lg:mt-0 mx-auto">
			<button
				type="submit"
				class="uppercase font-bold text-lg bg-red-500 hover:bg-red-600 text-white py-2 px-4 w-full flex flex-row items-center leading-snug"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 mr-1"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
						clip-rule="evenodd"
					/>
				</svg>
				Get Media
			</button>
		</div>
	</form>
</template>
<script>
export default {
	props: {
		query: {
			type: String,
			default: "",
			required: true,
		},
		items: {
			type: Number,
			default: 100,
			required: true,
		},
		retweets: {
			type: Boolean,
			default: false,
		},
		replies: {
			type: Boolean,
			default: true,
		},
		placeholder: {
			type: String,
			default: "Twitter Username",
		},
	},
};
</script>
