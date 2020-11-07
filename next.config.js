//const withPWA = require("next-pwa");
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const isProd = process.env.NODE_ENV === "production";

const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './src/styles/antd-custom.less'), 'utf8'));

/*module.exports = withPWA({
	pwa: {
		disable: !isProd,
		dest: "public",
		register: true,
	},
});*/

/*module.exports = {
	optimization: {
		minimizer: [new UglifyJsPlugin()],
	},
};*/

module.exports = withCSS(
	withLess({
		lessLoaderOptions: {
			javascriptEnabled: true,
			modifyVars: themeVariables // make your antd custom effective
		},
		webpack: (config, { isServer }) => {
			if (isServer) {
				const antStyles = /antd\/.*?\/style.*?/;
				const origExternals = [ ...config.externals ];
				config.externals = [
					(context, request, callback) => {
						if (request.match(antStyles)) return callback();
						if (typeof origExternals[0] === 'function') {
							origExternals[0](context, request, callback);
						} else {
							callback();
						}
					},
					...(typeof origExternals[0] === 'function' ? [] : origExternals)
				];

				config.module.rules.unshift({
					test: antStyles,
					use: 'null-loader'
				});
			}
			return config;
		}
	})
);
