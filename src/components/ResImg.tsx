import React, { useEffect, useState } from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "./utils";

interface ResImgProps {
	name: string;
	className?: string;
}

export default function ResImg({ name, className }: ResImgProps) {
	const fsb = useFullScreenBrowser();
	const [imgPath, setImgPath] = useState("images/1x1.gif");

	useEffect(
		function () {
			setImgPath(`images/${name}${isMobileDevice(fsb) ? "-mobile" : ""}.jpg`);
		},
		[null]
	);

	return <img className={className} src={imgPath} />;
}
