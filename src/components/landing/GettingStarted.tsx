import React from "react";
import { Col, Image, Button } from "antd";
import Link from "next/link";
import "./GettingStarted.less";
import { ROUTES } from "../../CONSTANTS";

export default function GettingStarted() {
	return (
		<Col xs={24} sm={24} md={12}>
			<div className="getting-started">
				<h2>One-stop financial platform for Your family</h2>
				<Image preview={false} src="images/kick-start.jpg" />
				<p style={{ textAlign: "center" }}>
					{/*defaultCountry === "IN" ? (*/}
					<Link href={ROUTES.SET}>
						<Button type="primary" size="large">
							Get...Set...Grow &nbsp;&gt;&gt;
						</Button>
					</Link>
					{/*) : status !== Status.Y ? (
					<Join />
				) : null}*/}
				</p>
			</div>
		</Col>
	);
}
