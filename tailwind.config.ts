import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-noto-serif-tamil)', 'Georgia', 'serif'],
        sans: ['var(--font-noto-sans-tamil)', 'system-ui', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F3EADF',
          300: '#E6D7C3',
        },
        crimson: {
          600: '#9B1C1C',
          700: '#7F1D1D',
          800: '#63171B',
          900: '#4A1215',
        },
        gold: {
          500: '#C59B27',
          600: '#A37E1B',
        }
      },
    },
  },
  plugins: [],
};

export default config;

