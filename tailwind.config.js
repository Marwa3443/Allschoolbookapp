/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        islamic: {
          dark: '#1a472a',
          primary: '#2d5f3f',
          secondary: '#d4af37',
          accent: '#8b6f47',
          light: '#f5f1e8',
          beige: '#e8dcc8',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        english: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'islamic-pattern': "url('/images/islamic-pattern.svg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
