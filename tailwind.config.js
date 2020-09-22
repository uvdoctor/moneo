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
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover']
  },
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
      backgroundColor: {
        silver: "#F1EDED",
      },
    },
  },
  variants: {},
  plugins: [],
};
