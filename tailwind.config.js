/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
      },
      colors: {
        primary: '#0D6EFD',
        light: {
          text: '#395886',
          background: 'F0F3FA',
          icon: '#687076',
        },
        gray: {
          100: "#CDCDE0",
        },
        dark: {
          text: '#ffffff',
          background: '#001524',
          icon: '#ffffff',
          button: '#0D6EFD'
        },
        white: '#ffffff',
      }
    },
  },
  plugins: [],
}

