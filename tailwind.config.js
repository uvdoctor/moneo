module.exports = {
  purge: {
    future: {
      purgeLayersByDefault: true
    },
    content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    ]
  },
  theme: {
    inset: {
      0: "0",
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      8: "2rem",
      10: "2.5rem",
      12: "3rem",
      16: "4rem",
      20: "5rem",
      24: "6rem",
      32: "8rem",
      40: "10rem",
      48: "12rem"
    },
    padding: theme => ({
      ...theme('spacing'),
      50: "50%"
    }),
    extend: {
      textColor: {
        green: {
          primary: "#499824",
          secondary: "#AAE441",
        },
        silver: "#F1EDED",
        default: "#4a5568"
      },
      backgroundColor: {
        silver: "#F1EDED",
        blue: "#3d86ce",
        green: "#499824"
      },
    },
  },
  variants: {},
  plugins: [],
};
