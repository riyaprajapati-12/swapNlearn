/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-gray': '#f8f9fa',
        'light-blue': '#e0e4e8',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(40deg, rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)',
      },
      dropShadow: {
        glow: '0 0 6px rgba(255,165,0,0.8)',
      },
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
      },
      
    },
  },
  plugins: [],
}

