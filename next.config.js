const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const withPlugins = require('next-compose-plugins');
const withAntdLess = require('next-plugin-antd-less');

const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './src/styles/antd-custom.less'), 'utf8'));

module.exports = withPlugins(
	[
		withAntdLess({
			//optional
			modifyVars                           : themeVariables,
			// optional
			//lessVarsFilePath: './src/styles/antd-custom.less',
			// optional
			lessVarsFilePathAppendToEndOfContent : false,
			// optional https://github.com/webpack-contrib/css-loader#object
			cssLoaderOptions                     : {},
			lessLoaderOptions: {
				lessOptions: {
					javascriptEnabled: true
				}
			},
			// Other Config Here...

			webpack(config) {
				return config;
			}
		})
	],
	{
		eslint    : {
			ignoreDuringBuilds : true
		},
		swcMinify : true,
    	rules: [
			{
				exclude: [path.resolve(__dirname, "node_modules")], // in order to ignore all modules in node_modules folder
			}
		],
    	externalsPresets: {
        	node: true // in order to ignore built-in modules like path, fs, etc. 
    	}
	}
);
