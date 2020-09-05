module.exports = {
  purge: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        green: {
          primary: "#96D441",
          secondary: "#AAE441",
        },
        silver: "#F1EDED",
        default: "#4a5568"
      },
    },
  },
  variants: {},
  plugins: [],
};
