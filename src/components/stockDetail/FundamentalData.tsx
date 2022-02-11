import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function FundamentalData() {
	const router = useRouter();
	const { stock } = router.query;
	const scriptParent = useRef(null);

	useEffect(() => {
		if (!stock) return;

		const tradingviewSettings = {
			symbol: `NSE:${stock}`,
			colorTheme: "light",
			isTransparent: false,
			largeChartUrl: "",
			displayMode: "regular",
			width: 320,
			height: 830,
			locale: "in",
		};
		const scriptTag = document.createElement("script");

		scriptTag.type = "text/javascript";
		scriptTag.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
		scriptTag.text = JSON.stringify(tradingviewSettings);
		scriptTag.async = true;
		/* @ts-ignore */
		scriptParent.current.replaceChildren(scriptTag);
	}, [stock]);

	return <div ref={scriptParent}></div>;
}
