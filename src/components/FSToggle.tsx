import React, { useContext } from "react";
import { useFullScreen } from "react-browser-hooks";
import { Button } from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import { AppContext } from "./AppContext";

export default function FSToggle() {
	const { fullScreen, toggle } = useFullScreen();
	const { query }: any = useContext(AppContext);

	return query.isMobileApp ? null : (
		<Button
			className="fullScreen-btn"
			type="link"
			onClick={() => toggle()}
			icon={fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
		/>
	);
}
