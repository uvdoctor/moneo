import React from "react";
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
				</div>
				<div>
					<img src="images/travel-banner.jpg" />
				</div>
			</Carousel>
		</Content>
	);
}
