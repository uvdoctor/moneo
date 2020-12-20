import React from "react";
import { Col, Button, Image } from "antd";
import "./GettingStarted.less";

export default function GettingStarted() {
	return (
		<Col xs={24} sm={24} md={12}>
			<div className="getting-started">
				<h2>Kick-start Your Financial Independence</h2>
				<Button type="primary">Get Started</Button>
				<Image preview={false} src="images/kick-start.jpg" />
			</div>
		</Col>
	);
}
