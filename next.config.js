const lessToJS = require("less-vars-to-js");
const fs = require("fs");
const path = require("path");
const withPlugins = require("next-compose-plugins");
const withAntdLess = require("next-plugin-antd-less");

const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, "./src/styles/antd-custom.less"),
    "utf8"
  )
);

module.exports = withPlugins(
  [
    withAntdLess({
      //optional
      modifyVars: themeVariables,
      // optional
      //lessVarsFilePath: './src/styles/antd-custom.less',
      // optional
      lessVarsFilePathAppendToEndOfContent: false,
      // optional https://github.com/webpack-contrib/css-loader#object
      webpack(config) {
        return config;
      },
    }),
  ],
  {
    eslint: {
      ignoreDuringBuilds: true,
    },
    swcMinify: true,
    images: {
      domains: ['moneo.in', 'moneo.money' , 'gomoneo.com', 'goal-images104733-dev.s3.us-east-1.amazonaws.com'], 
    },
  }
);
