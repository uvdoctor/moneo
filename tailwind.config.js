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
        silver: {
          primary: "#F1EDED",
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
