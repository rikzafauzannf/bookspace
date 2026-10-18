/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          wood: '#5C4033',
          woodHover: '#4A3328',
          terra: '#C85A32',
          paper: '#FDFBF7',
          paperDark: '#F4EBE1',
          charcoal: '#2C221E',
          muted: '#7A685D',
          border: '#E6D5C3',
          success: '#2E7D32',
          warning: '#ED6C02',
          error: '#C62828',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
