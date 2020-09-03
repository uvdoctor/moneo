module.exports = {
  purge: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        green: {
          primary: "#AAE441",
          secondary: "#96D441",
        },
        silver: {
          primary: "#F1EDED",
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
