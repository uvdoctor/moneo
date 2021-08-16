import React from "react";
import Carousel from "react-elastic-carousel";
import Content from "../Content";

import "./CouponsBanner.less";

export default function CouponsBanner() {
	return (
		<Content className="coupons-banner" whiteBg>
			<h2>What Users Are Saying?</h2>
			<Carousel itemsToShow={1} showArrows={false}>
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
