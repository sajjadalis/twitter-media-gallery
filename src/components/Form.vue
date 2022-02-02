<template>
	<form @submit.prevent="$emit('search')" class="flex flex-col lg:flex-row">
		<div class="relative lg:flex-1 lg:mr-2">
			<input
				type="text"
				data-lpignore="true"
				:placeholder="placeholder"
				class="w-full focus:shadow-red-500"
				v-model="message"
			/>
			<span
				class="absolute top-0 right-0 mt-3 mr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
				@click.prevent="message = ''"
			>
				<svg
					v-if="message"
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
					class="w-full"
					placeholder="Tweets (5 to 100)"
					v-model="num_of_results"
				/>
			</div>
			<div class="relative mr-2">
				<label class="absolute top-0 -mt-5 text-2xs">Retweets</label>
				<input
					type="checkbox"
					v-model="include.retweets"
					class="text-red-500 w-10 h-10"
				/>
			</div>
			<div class="relative mr-2">
				<label class="absolute top-0 -mt-5 text-2xs">Replies</label>
				<input
					type="checkbox"
					v-model="include.replies"
					class="text-red-500 w-10 h-10"
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
import { computed } from "vue";
export default {
	props: {
		modelValue: String,
		num_of_results: Number,
		include: Object,
		placeholder: String,
	},
	setup(props, { emit }) {
		const message = computed({
			get: () => props.modelValue,
			set: (value) => emit("update:modelValue", value),
		});

		return {
			message,
		};
	},
};
</script>
