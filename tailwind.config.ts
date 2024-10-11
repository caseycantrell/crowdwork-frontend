/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',  // Optional: if you're using hooks
    './src/utils/**/*.{js,ts,jsx,tsx}',  // Optional: if you're using utils
    './src/styles/**/*.{css}',           // For any custom CSS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
