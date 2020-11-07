import React from "react";
import { Layout } from "antd";
import DDContent from "./DDContent";

import "./DDFooter.less";

export default function Footer() {
	const { Footer } = Layout;

	return (
		<DDContent className="dd-footer">
			<Footer>&copy; 2020 Dollar Darwin. All rights reserved.</Footer>
		</DDContent>
	);
}
