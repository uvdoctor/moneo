import React from "react";
import { useFullScreen } from "react-browser-hooks";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";

export default function FullScreen() {
	const { fullScreen, toggle } = useFullScreen();
	return (
		<div style={{cursor: 'pointer'}} onClick={() => toggle()}>
			{fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
		</div>
	);
}
