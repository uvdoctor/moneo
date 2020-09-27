const withPWA = require("next-pwa");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { default: Slider } = require("rc-slider");

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV !== "production",
    dest: "public"
  },
});

module.exports = {
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
