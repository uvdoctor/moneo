import { COLORS } from "../CONSTANTS";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice, toCurrency } from "./utils";

export const getCommonLayoutProps = (
	title: string = "",
	tickFormat: string = ",",
	autosize: boolean = true
) => {
	return {
		dragmode: "pan",
		font: { family: "'Jost', sans-serif", color: COLORS.DEFAULT, size: 15 },
		autosize: autosize,
		title: title
			? { x: 0.05, text: title, font: { size: 20 }, align: "left" }
			: false,
		yaxis: { tickformat: tickFormat, fixedrange: true, showgrid: false },
		margin: { t: title ? 40 : 0, r: title ? 10 : 0 },
	};
};

export const getCommonConfig = () => {
	return {
		responsive: true,
		editable: false,
		scrollZoom: true,
		displayModeBar: false,
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
			},
		},
	};
};

export const getCommonXAxis = (titleText: string) => {
	return {
		title: {
			visible: true,
			text: titleText,
			style: { fontSize: 15, fill: COLORS.DEFAULT },
		},
	};
};

export const getCommonYAxis = () => {
	const fsb = useFullScreenBrowser();
	return {
		label: { visible: !isMobileDevice(fsb) },
		grid: { visible: false },
		title: { visible: false },
	};
};

export const getCommonStyle = () => {
	return {
		width: "100%",
		height: "100%",
		minHeight: "450px",
		minWidth: "320px",
	};
};

export const getDarkTheme = () => {
	let { getTheme } = require("bizcharts");
	let darkTheme = getTheme("dark");
	darkTheme.background = "transparent";
	return darkTheme;
};

export const getDefaultSliderProps = () => {
	return {
		trendCfg: { data: [] },
		handlerStyle: {
			width: 20,
			height: 20,
			style: {
				fill: COLORS.DEFAULT,
				stroke: COLORS.WHITE,
			},
		},
		foregroundStyle: { fill: COLORS.GREEN },
	};
};
