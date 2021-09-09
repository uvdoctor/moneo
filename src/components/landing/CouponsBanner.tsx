import React from "react";
import { Row, Col, Button } from "antd";
import {
	Carousel,
	AnimationHandler,
	AnimationHandlerResponse,
} from "react-responsive-carousel";
import Content from "../Content";
import GetStartedButton from "./GetStartedButton";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./CouponsBanner.less";

export default function CouponsBanner() {
	const banners = ["travel-banner.jpg", "buy-banner.jpg", "event-banner.jpg"];
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
						<strong>Smart deals for your goals</strong>
					</h2>
					<h3>
						Curated deals from <strong>100+ partners</strong> to help you save.
					</h3>
					<p />
					<p />
					<p>
						<GetStartedButton />
					</p>
					<h3>
						<strong>Plan More, Save More!</strong>
					</h3>
					<h2>
						{/*@ts-ignore*/}
						<strike>Buy Now, Plan Later</strike>
					</h2>
					<h2>
						<strong>Plan Now, Buy Smarter</strong>
					</h2>
					<h3>
						Plan big-spends so that Moneo can help you to find good deals and
						invest accordingly.
					</h3>
					<p className="brand-coupon">
						<Row
							align="middle"
							justify="center"
							gutter={[
								{ xs: 5, sm: 5, md: 15 },
								{ xs: 10, sm: 10, md: 15 },
							]}
						>
							{coupons.map((brand, i) => (
								<Col key={i}>
									<div className={`${brand}-coupon`} />
								</Col>
							))}
							<Col>
								<Button type="dashed" herf="" className="more-link">
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
						infiniteLoop
						animationHandler="fade"
						swipeable={false}
					>
						{banners.map((imageName) => (
							<div>
								<img src={`images/${imageName}`} />
							</div>
						))}
					</Carousel>
				</Col>
			</Row>
		</Content>
	);
}
