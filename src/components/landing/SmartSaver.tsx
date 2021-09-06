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
						<strong>Smart deals for your goals</strong>
					</h2>
					<p>
						Curated deals from 100+ partners to help you save while reaching your goals.
					</p>
					<h3>
						<strong>The more you plan, the more you save!</strong>
					</h3>
				</Col>
				<Col xs={24} sm={24} md={12}>
					<img src="images/genie-coupons.png" />
				</Col>
			</Row>
		</Content>
	);
}
