import React from "react";
import { Row, Col } from "antd";
import { Carousel } from "react-responsive-carousel";
import Content from "../Content";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./CouponsBanner.less";

export default function CouponsBanner() {
	return (
		<Content className="coupons-banner" whiteBg>
			<h2>What Users Are Saying?</h2>
			<Carousel
				autoPlay
				interval={5000}
				showThumbs={false}
				showStatus={false}
				infiniteLoop
			>
				<div>
					<img src="images/travel-banner.jpg" />
					<Row align="middle" justify="center" gutter={[15, 0]}>
						{["amazon", "flipkart", "flipkart", "flipkart", "flipkart"].map(
							(brand) => (
								<Col>
									<div className={`${brand}-coupon`}></div>
								</Col>
							)
						)}
					</Row>
				</div>
				<div>
					<img src="images/travel-banner.jpg" />
					<Row align="middle" justify="center" gutter={[15, 0]}>
						{["amazon", "flipkart", "flipkart", "flipkart", "flipkart"].map(
							(brand) => (
								<Col>
									<div className={`${brand}-coupon`}></div>
								</Col>
							)
						)}
					</Row>
				</div>
			</Carousel>
		</Content>
	);
}
