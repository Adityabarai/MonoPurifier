module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	theme: {
		extend: {
			colors: {
				primary: "#3B82F6",
				secondary: "#10B981",
				accent: "#8B5CF6",

				success: "#10B981",
				warning: "#F59E0B",
				danger: "#EF4444",
				info: "#3B82F6",

				light: "#F9FAFB",
				dark: "#111827",

				background: {
					light: "#F9FAFB",
					dark: "#111827",
					primary: "#EFF6FF",
					secondary: "#ECFDF5",
				},

				text: {
					primary: "#111827",
					secondary: "#6B7280",
					muted: "#9CA3AF",
					light: "#F9FAFB",
				},

				border: {
					light: "#E5E7EB",
					DEFAULT: "#D1D5DB",
					dark: "#374151",
				},
			},

			spacing: {
				128: "32rem",
				144: "36rem",
			},

			borderRadius: {
				"4xl": "2rem",
			},

			// Animation extensions
			animation: {
				"fade-in": "fadeIn 0.5s ease-in-out",
				"slide-up": "slideUp 0.3s ease-out",
			},

			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { transform: "translateY(10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},
		},
	},
	plugins: [],
};
