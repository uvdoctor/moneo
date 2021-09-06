import React from 'react';
import { Row, Col } from 'antd';
import { Carousel } from 'react-responsive-carousel';
import Content from '../Content';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './CouponsBanner.less';

export default function CouponsBanner() {
	const banners = [
		{
			imagePath: 'images/travel-banner.jpg',
			moreLink: '',
			coupons: [ 'booking', 'airbnb', 'makemytrip', 'goibibo', 'expedia' ]
		},
		{
			imagePath: 'images/buy-banner.jpg',
			moreLink: '',
			coupons: [ 'amazon', 'flipkart', 'urbanladder', 'snapdeal', 'myntra' ]
		},
		{
			imagePath: 'images/event-banner.jpg',
			moreLink: '',
			coupons: [ 'kalyan', 'tanishq', 'pcj', 'himalaya', 'pampers' ]
		}
	];

	return (
		<Content className="coupons-banner" whiteBg>
			<Col>
				<h2>
					{/*@ts-ignore*/}
					<strike>Buy Now, Plan Later</strike>
				</h2>
			</Col>
			<Col>
				<h2>
					<strong>Plan Now, Buy Smarter</strong>
				</h2>
			</Col>
			<h3>Plan big-spends so that Moneo can help you to find good deals and invest accordingly.</h3>
			<Carousel
				autoPlay
				interval={5000}
				showThumbs={false}
				showStatus={false}
				showIndicators={false}
				infiniteLoop
			>
				{banners.map(({ imagePath, moreLink, coupons }) => (
					<div>
						<img src={imagePath} />
						<p className="brand-coupon">
							<Row
								align="middle"
								justify="center"
								gutter={[ { xs: 5, sm: 5, md: 15 }, { xs: 10, sm: 10, md: 15 } ]}
							>
								{coupons.map((brand, i) => (
									<Col key={i}>
										<div className={`${brand}-coupon`} />
									</Col>
								))}
								<Col>
									<a className="more-link" href={moreLink}>
										More...
									</a>
								</Col>
							</Row>
						</p>
					</div>
				))}
			</Carousel>
		</Content>
	);
}
