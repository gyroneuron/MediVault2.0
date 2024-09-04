/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./dashboard/**/*.{js,jsx,ts,tsx}"],
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
          background: '#EDEDED',
          elevated: {
            bg: '#F5F5F5',
            buttonBlue: '0D6EFD',
            buttonGray: '#EDEDED',
            label: '#000000',
            secondaryLabel: '##E0E0E0',
          },
          icon: '#0D6EFD',
        },
        gray: {
          100: "#CDCDE0",
        },
        dark: {
          text: '#ffffff',
          background: '#000000',
          icon: '#0D6EFD',
          button: '#0D6EFD',
          elevated: {
            bg: '#27272A',
            lbl: '#ffffff',
            secLbl: '#6c757d',
            terLbl: '#343a40',
            blue: '0D6EFD',
            buttonGray: '#E0E0E0'
          },
          base: {
            bg: '#000000',
            lbl: '#ffffff',
            secLbl: '#6c757d',
            terLbl: '#343a40',
          }
        },
        white: '#ffffff',
      }
    },
  },
  plugins: [],
}

