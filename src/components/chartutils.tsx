import { COLORS } from '../CONSTANTS';
import { useFullScreenBrowser } from 'react-browser-hooks';
import { isMobileDevice, toCurrency } from './utils';

export const getCommonLayoutProps = (title: string = '', tickFormat: string = ',', autosize: boolean = true) => {
	return {
		dragmode: 'pan',
		font: { family: "'Jost', sans-serif", color: COLORS.DEFAULT, size: 15 },
		autosize: autosize,
		title: title ? { x: 0.05, text: title, font: { size: 20 }, align: 'left' } : false,
		yaxis: { tickformat: tickFormat, fixedrange: true, showgrid: false },
		margin: { t: title ? 40 : 0, r: title ? 10 : 0 }
	};
};

export const getCommonTitleFormat = (titleText: string) => {
	return {
		title: {
			visible: true,
			text: titleText,
			alignTo: 'middle',
			style: { fill: COLORS.DEFAULT, fontFamily: "'Jost', sans-serif" }
		}
	};
};
export const getCommonFill = () => {
	return { fill: COLORS.DEFAULT };
};

export const getCommonMeta = (currency: string) => {
	return {
		value: {
			formatter: (v: number) => {
				return toCurrency(v, currency);
			}
		}
	};
};

export const getCommonTheme = () => {
	return {
		fontFamily: "'Jost', sans-serif",
		defaultColor: COLORS.DEFAULT
	};
};

export const getCommonXAxis = (titleText: string) => {
	return {
		title: {
			visible: true,
			text: titleText,
			style: {
				fontSize: 15,
				fill: COLORS.DEFAULT,
				fontFamily: "'Jost', sans-serif"
			}
		}
	};
};

export const getCommonYAxis = () => {
	const show = !isMobileDevice(useFullScreenBrowser());
	return {
		label: show ? {} : null,
		grid: show ? {} : null
	};
};

export const getCommonStyle = () => {
	return {
		width: '100%',
		height: '100%',
		minHeight: '450px',
		minWidth: '320px'
	};
};

export const getDarkTheme = () => {
	let { getTheme } = require('bizcharts');
	let darkTheme = getTheme('dark');
	darkTheme.background = 'transparent';
	return darkTheme;
};

export const getDefaultSliderProps = () => {
	return {
		trendCfg: { data: [] },
		handlerStyle: {
			width: 20,
			height: 20,
			fill: COLORS.DEFAULT,
			stroke: COLORS.WHITE
		},
		foregroundStyle: { fill: '#79d9ac' }
	};
};
