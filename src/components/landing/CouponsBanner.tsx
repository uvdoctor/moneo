import React from "react";
import { Row, Col, Button } from "antd";
import { Carousel } from "react-responsive-carousel";
import Content from "../Content";
import GetStartedButton from "./GetStartedButton";

import "react-responsive-carousel/lib/styles/carousel.min.css";
require("./CouponsBanner.less");

export default function CouponsBanner() {
	const banners = ["buy-banner.jpg", "travel-banner.jpg", "event-banner.jpg"];
	const coupons = [
		"amazon",
		"flipkart",
		"booking",
		"makemytrip",
		"kalyan",
		"airbnb",
		"urbanladder",
	];

	return (
		<Content className="coupons-banner" whiteBg>
			<Row align="middle" gutter={[15, 30]}>
				<Col xs={24} sm={24} md={24} lg={12}>
					<h2>
						{/*@ts-ignore*/}
						<strike>Buy Now, Plan Later</strike>
					</h2>
					<h2>
						<strong>Plan Now, Buy Smarter</strong>
					</h2>
					<h3>
						Plan big-spends so that Moneo can help you to invest accordingly and
						also find awesome deals from <strong>100+ partners</strong>.
					</h3>
					<p>
						<GetStartedButton />
					</p>
					<h3>
						<strong>Plan More, Save More!</strong>
					</h3>
					<p className="brand-coupon">
						<Row
							align="middle"
							gutter={[
								{ xs: 0, sm: 0, md: 0 },
								{ xs: 10, sm: 10, md: 15 },
							]}
						>
							{coupons.map((brand, i) => (
								<Col key={i} xs={12} sm={8} md={6} lg={8}>
									<div className={`${brand}-coupon`} />
								</Col>
							))}
							<Col xs={12} sm={8} md={6} lg={8}>
								<Button type="primary" href="" className="more-link">
									More...
								</Button>
							</Col>
						</Row>
					</p>
				</Col>
				<Col xs={24} sm={24} md={24} lg={12}>
					<Carousel
						autoPlay
						interval={2500}
						showThumbs={false}
						showStatus={false}
						showIndicators={false}
						showArrows={false}
						stopOnHover={false}
						swipeable={false}
						infiniteLoop
					>
						{banners.map((imageName) => (
							<div key={imageName}>
								<img src={`images/${imageName}`} />
							</div>
						))}
					</Carousel>
				</Col>
			</Row>
		</Content>
	);
}
