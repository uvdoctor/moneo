import React from "react";
import { Row, Col } from "antd";
import Content from "../Content";
import Image from 'next/image'

require("./SmartSaver.less");
import GetStartedButton from "./GetStartedButton";

export default function SmartSaver() {
	return (
		<Content className="smart-saver">
			<Row align="middle" gutter={[15, 15]}>
				<Col xs={24} sm={24} md={12}>
					<h2>
						<strong>Smart deals for your goals</strong>
					</h2>
					<h3>
						Curated deals from <strong>100+ partners</strong> to help you save.
					</h3>
					<p/>
					<p/>
					<p>
						<GetStartedButton />
					</p>
					<h3>
						<strong>Plan More, Save More!</strong>
					</h3>
				</Col>
				<Col xs={24} sm={24} md={12}>
					<Image src="images/genie-coupons.png" alt="" width={583} height={531} layout="responsive"/>
				</Col>
			</Row>
		</Content>
	);
}
