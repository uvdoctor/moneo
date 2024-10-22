import React from "react";
import { Col, Image } from "antd";
require("./GettingStarted.less");
import GetStartedButton from "./GetStartedButton";

export default function GettingStarted() {
	return (
		<Col xs={24} sm={24} md={12}>
			<div className="getting-started">
				<h2>One-stop financial platform for Your family</h2>
				<Image preview={false} src="images/kick-start.jpg" />
				<p style={{ textAlign: "center" }}>
					<GetStartedButton />
				</p>
			</div>
		</Col>
	);
}
