import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function CompanyProfile() {
	const router = useRouter();
	const { stock } = router.query;
	const scriptParent = useRef(null);

	useEffect(() => {
		if (!stock) return;

		const tradingviewSettings = {
			symbol: `NSE:${stock}`,
			width: "100%",
			height: 400,
			colorTheme: "light",
			isTransparent: false,
			locale: "in",
		};
		const scriptTag = document.createElement("script");

		scriptTag.type = "text/javascript";
		scriptTag.src =
			"https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
		scriptTag.text = JSON.stringify(tradingviewSettings);
		scriptTag.async = true;
		/* @ts-ignore */
		scriptParent.current.replaceChildren(scriptTag);
	}, [stock]);

	return <div ref={scriptParent}></div>;
}
