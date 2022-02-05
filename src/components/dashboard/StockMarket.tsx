import { useEffect, useRef } from "react";
import { Typography } from "antd";

export default function StockMarket() {
	const { Title } = Typography;
	const scriptParent = useRef(null);
	const tradingviewSettings = {
		colorTheme: "light",
		dateRange: "12M",
		exchange: "BSE",
		showChart: true,
		locale: "in",
		width: "100%",
		height: 600,
		largeChartUrl: "",
		isTransparent: false,
		showSymbolLogo: false,
		showFloatingTooltip: false,
		plotLineColorGrowing: "rgba(73, 133, 231, 1)",
		plotLineColorFalling: "rgba(73, 133, 231, 1)",
		gridLineColor: "rgba(240, 243, 250, 0)",
		scaleFontColor: "rgba(120, 123, 134, 1)",
		belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
		belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
		belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
		belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
		symbolActiveColor: "rgba(41, 98, 255, 0.12)",
	};

	useEffect(() => {
		const scriptTag = document.createElement("script");

		scriptTag.type = "text/javascript";
		scriptTag.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
		scriptTag.text = JSON.stringify(tradingviewSettings);
		scriptTag.async = true;
		/* @ts-ignore */
		scriptParent.current.appendChild(scriptTag);
	}, []);

	return (
		<>
			<Title level={5}>Stock Market</Title>
			<div ref={scriptParent}></div>
		</>
	);
}
