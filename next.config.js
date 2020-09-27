const withPWA = require("next-pwa");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { default: Slider } = require("rc-slider");
const isProd = process.env.NODE_ENV === "production";

module.exports = withPWA({
  pwa: {
    disable: !isProd,
    dest: "public"
  },
});

module.exports = {
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
