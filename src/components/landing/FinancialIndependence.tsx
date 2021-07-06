import { useEffect, useState } from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "../utils";
import Content from "../Content";

export default function FinancialIndependence() {
	const fsb = useFullScreenBrowser();
	const [imgPath, setImgPath] = useState("images/1x1.gif");

	useEffect(
		() => setImgPath(`images/fi${isMobileDevice(fsb) ? "-mobile" : ""}.jpg`),
		[]
	);

	return (
		<Content>
			<div className="site-banner">
				<img src={imgPath} />
				<div className="site-banner-content">
					<h2>Worry-free Financial Independence</h2>
					<h3>Your family's financial coach that champions your goals</h3>
				</div>
			</div>
		</Content>
	);
}
