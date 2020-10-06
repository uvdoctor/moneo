import React from "react";
import SVGFullScreen from "./svgfullscreen";
import SVGExitFullScreen from "./svgexitfullscreen";
import { useFullScreen } from "react-browser-hooks";

export default function FullScreen() {
	const { fullScreen, toggle } = useFullScreen();
	return (
		<div onClick={() => toggle()}>
			{fullScreen ? <SVGExitFullScreen /> : <SVGFullScreen />}
		</div>
	);
}
