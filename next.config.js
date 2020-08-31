const withPWA = require("next-pwa");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { default: Slider } = require("rc-slider");
const isProd = process.env.NODE_ENV === "production";
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/
});

module.exports = withMDX({
  // Pick up MDX files in the /pages/ directory
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});

module.exports = withPWA({
  pwa: {
    disable: !isProd,
    dest: "public",
  },
});

module.exports = {
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
