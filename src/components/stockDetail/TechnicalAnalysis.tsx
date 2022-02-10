import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function TechnicalAnalysis() {
	const router = useRouter();
	const { stock } = router.query;
	const scriptParent = useRef(null);

	useEffect(() => {
		if (!stock) return;

		const tradingviewSettings = {
			symbol: `NSE:${stock}`,
			interval: "1D",
			width: "100%",
			isTransparent: false,
			height: 400,
			showIntervalTabs: true,
			locale: "in",
			colorTheme: "light",
		};
		const scriptTag = document.createElement("script");

		scriptTag.type = "text/javascript";
		scriptTag.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
		scriptTag.text = JSON.stringify(tradingviewSettings);
		scriptTag.async = true;
		/* @ts-ignore */
		scriptParent.current.replaceChildren(scriptTag);
	}, [stock]);

	return <div ref={scriptParent}></div>;
}
