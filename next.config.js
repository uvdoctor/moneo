const withPWA = require("next-pwa");
const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
const withPlugins = require('next-compose-plugins');
const fs = require('fs');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isProd = process.env.NODE_ENV === "production";

const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './src/styles/antd-custom.less'), 'utf8'));

module.exports = withPWA({
	pwa: {
		disable: !isProd,
		dest: "public",
		register: true,
	},
});

module.exports = {
	optimization: {
		minimizer: [new UglifyJsPlugin()],
	},
};

module.exports = withPlugins([
	[
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

				const builtInLoader = config.module.rules.find((rule) => {
					if (rule.oneOf) {
						return (
							rule.oneOf.find((deepRule) => {
								return deepRule.test && deepRule.test.toString().includes('/a^/');
							}) !== undefined
						);
					}
					return false;
				});

				if (typeof builtInLoader !== 'undefined') {
					config.module.rules.push({
						oneOf: [
							...builtInLoader.oneOf.filter((rule) => {
								return (rule.test && rule.test.toString().includes('/a^/')) !== true;
							})
						]
					});
				}

				config.resolve.alias['@'] = path.resolve(__dirname);
				return config;
			}
		})
	]
]);
