
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(263 85% 60%)',
					foreground: 'hsl(0 0% 100%)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(263 75% 65%)',
					foreground: 'hsl(0 0% 100%)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(263 85% 60%)',
					foreground: 'hsl(0 0% 100%)',
					primary: 'hsl(0 0% 100%)',
					'primary-foreground': 'hsl(263 85% 60%)',
					accent: 'hsl(263 75% 65%)',
					'accent-foreground': 'hsl(0 0% 100%)',
					border: 'hsl(263 75% 65%)',
					ring: 'hsl(263 70% 70%)'
				},
				purple: {
					50: 'hsl(263 100% 98%)',
					100: 'hsl(263 85% 95%)',
					200: 'hsl(263 80% 90%)',
					300: 'hsl(263 75% 80%)',
					400: 'hsl(263 70% 70%)',
					500: 'hsl(263 85% 60%)',
					600: 'hsl(263 85% 55%)',
					700: 'hsl(263 85% 45%)',
					800: 'hsl(263 85% 35%)',
					900: 'hsl(263 85% 25%)',
				},
				violet: {
					50: 'hsl(263 100% 98%)',
					100: 'hsl(263 90% 96%)',
					200: 'hsl(263 85% 92%)',
					300: 'hsl(263 80% 84%)',
					400: 'hsl(263 75% 72%)',
					500: 'hsl(263 75% 65%)',
					600: 'hsl(263 80% 58%)',
					700: 'hsl(263 85% 48%)',
					800: 'hsl(263 85% 38%)',
					900: 'hsl(263 85% 28%)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
