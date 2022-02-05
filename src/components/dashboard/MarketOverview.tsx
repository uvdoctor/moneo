import { useEffect, useRef } from "react";
import { Typography } from "antd";

export default function MarketOverview() {
	const { Title } = Typography;
	const scriptParent = useRef(null);
	const tradingviewSettings = {
		colorTheme: "light",
		dateRange: "12M",
		showChart: true,
		locale: "in",
		width: "100%",
		height: 600,
		largeChartUrl: "",
		isTransparent: false,
		showSymbolLogo: true,
		showFloatingTooltip: false,
		plotLineColorGrowing: "rgba(41, 98, 255, 1)",
		plotLineColorFalling: "rgba(41, 98, 255, 1)",
		gridLineColor: "rgba(240, 243, 250, 0)",
		scaleFontColor: "rgba(120, 123, 134, 1)",
		belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
		belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
		belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
		belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
		symbolActiveColor: "rgba(41, 98, 255, 0.12)",
		tabs: [
			{
				title: "Indices",
				symbols: [
					{
						s: "FOREXCOM:SPXUSD",
						d: "S&P 500",
					},
					{
						s: "FOREXCOM:NSXUSD",
						d: "US 100",
					},
					{
						s: "FOREXCOM:DJI",
						d: "Dow 30",
					},
					{
						s: "INDEX:NKY",
						d: "Nikkei 225",
					},
					{
						s: "INDEX:DEU40",
						d: "DAX Index",
					},
					{
						s: "FOREXCOM:UKXGBP",
						d: "UK 100",
					},
				],
				originalTitle: "Indices",
			},
			{
				title: "Futures",
				symbols: [
					{
						s: "CME_MINI:ES1!",
						d: "S&P 500",
					},
					{
						s: "CME:6E1!",
						d: "Euro",
					},
					{
						s: "COMEX:GC1!",
						d: "Gold",
					},
					{
						s: "NYMEX:CL1!",
						d: "Crude Oil",
					},
					{
						s: "NYMEX:NG1!",
						d: "Natural Gas",
					},
					{
						s: "CBOT:ZC1!",
						d: "Corn",
					},
				],
				originalTitle: "Futures",
			},
			{
				title: "Bonds",
				symbols: [
					{
						s: "CME:GE1!",
						d: "Eurodollar",
					},
					{
						s: "CBOT:ZB1!",
						d: "T-Bond",
					},
					{
						s: "CBOT:UB1!",
						d: "Ultra T-Bond",
					},
					{
						s: "EUREX:FGBL1!",
						d: "Euro Bund",
					},
					{
						s: "EUREX:FBTP1!",
						d: "Euro BTP",
					},
					{
						s: "EUREX:FGBM1!",
						d: "Euro BOBL",
					},
				],
				originalTitle: "Bonds",
			},
			{
				title: "Forex",
				symbols: [
					{
						s: "FX:EURUSD",
					},
					{
						s: "FX:GBPUSD",
					},
					{
						s: "FX:USDJPY",
					},
					{
						s: "FX:USDCHF",
					},
					{
						s: "FX:AUDUSD",
					},
					{
						s: "FX:USDCAD",
					},
				],
				originalTitle: "Forex",
			},
		],
	};

	useEffect(() => {
		const scriptTag = document.createElement("script");

		scriptTag.type = "text/javascript";
		scriptTag.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
		scriptTag.text = JSON.stringify(tradingviewSettings);
		scriptTag.async = true;
		/* @ts-ignore */
		scriptParent.current.appendChild(scriptTag);
	}, []);

	return (
		<>
			<Title level={5}>Market Overview</Title>
			<div ref={scriptParent}></div>
		</>
	);
}
