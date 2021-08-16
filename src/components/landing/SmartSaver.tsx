import React from "react";
import { Row, Col } from "antd";
import Content from "../Content";

import "./SmartSaver.less";

export default function SmartSaver() {
	return (
		<Content className="smart-saver">
			<Row align="middle" gutter={[15, 15]}>
				<Col xs={24} sm={24} md={12}>
					<h2>
						<strong>Smart Saver</strong>
					</h2>
					<p>
						We have implemented the highest standard for fraud protection and
						compliance with 256-bit encryption. We take data privacy seriously,
						and promise to never sell your data.
					</p>
				</Col>
				<Col xs={24} sm={24} md={12}>
					<img src="images/genie-coupons.png" />
				</Col>
			</Row>
		</Content>
	);
}
