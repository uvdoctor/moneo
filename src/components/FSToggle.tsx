import React from "react";
import { useFullScreen } from "react-browser-hooks";
import { Button } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";

export default function FSToggle() {
	const { fullScreen, toggle } = useFullScreen();
	return (
		<Button
			className="fullScreen-btn"
			type="link"
			onClick={() => toggle()}
			icon={fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
		/>
	);
}
