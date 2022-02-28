module.exports = {
	mode: "jit",
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			fontSize: {
				"2xs": ".65rem",
			},
		},
	},
	plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
};
