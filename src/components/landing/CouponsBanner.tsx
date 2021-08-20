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
				autoPlay={false}
				interval={5000}
				showThumbs={false}
				showStatus={false}
				showIndicators={false}
				infiniteLoop
			>
				<div>
					<img src="images/travel-banner.jpg" />
					<div className="brand-coupon">
						<Row
							align="middle"
							justify="center"
							gutter={[
								{ xs: 5, sm: 5, md: 15 },
								{ xs: 10, sm: 10, md: 15 },
							]}
						>
							{["amazon", "flipkart", "flipkart", "flipkart", "flipkart"].map(
								(brand) => (
									<Col>
										<div className={`${brand}-coupon`}></div>
									</Col>
								)
							)}
						</Row>
					</div>
				</div>
				<div>
					<img src="images/buy-banner.jpg" />
					<div className="brand-coupon">
						<Row
							align="middle"
							justify="center"
							gutter={[
								{ xs: 5, sm: 5, md: 15 },
								{ xs: 10, sm: 10, md: 15 },
							]}
						>
							{["amazon", "flipkart", "flipkart", "flipkart", "flipkart"].map(
								(brand) => (
									<Col>
										<div className={`${brand}-coupon`}></div>
									</Col>
								)
							)}
						</Row>
					</div>
				</div>
			</Carousel>
		</Content>
	);
}
