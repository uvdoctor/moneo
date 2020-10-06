import React from "react";
import SVGFullScreen from "./icons/SVGFullscreen";
import SVGExitFullScreen from "./icons/SVGExitfullscreen";
import { useFullScreen } from "react-browser-hooks";

export default function FullScreen() {
	const { fullScreen, toggle } = useFullScreen();
	return (
		<div onClick={() => toggle()}>
			{fullScreen ? <SVGExitFullScreen /> : <SVGFullScreen />}
		</div>
	);
}
