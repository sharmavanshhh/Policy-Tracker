/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}" // Scans all your components for class usage
  ],
  theme: {
  extend: {
    colors: {
      crimson: {
        700: '#b91c1c',
        800: '#991b1b',
      },
      silver: '#C0C0C0',
      gold: {
        400: '#FFD700',
        500: '#FFC107',
      },
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
  },
},
  plugins: [],
};
