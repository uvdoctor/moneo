import React from 'react';
import Carousel from 'react-elastic-carousel';
import { Avatar, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Content from '../Content';

import './testimonials.less';

export default function Testimonials() {
	const mobileSlideCount = 1;
	const tabletSlideCount = 2;
	const desktopSlideCount = 2;

	return (
		<Content className="client-testimonials">
			<h2>What Users Are Saying...</h2>
			<Carousel
				itemsToShow={2}
				breakPoints={[
					{
						width: 300,
						itemsToShow: mobileSlideCount,
						itemsToScroll: mobileSlideCount
					},
					{
						width: 577,
						itemsToShow: tabletSlideCount,
						itemsToScroll: tabletSlideCount
					},
					{
						width: 992,
						itemsToShow: desktopSlideCount,
						itemsToScroll: desktopSlideCount
					}
				]}
				showArrows={false}
			>
				<div key="t1" className="client-testimonial">
					<Row align="middle">
						<Col span={5}>
							<Avatar size={80} icon={<UserOutlined />} />
						</Col>
						<Col span={19}>
							<hgroup>
								<h3>Nipa</h3>
								<h4>Ahmedabad</h4>
							</hgroup>
						</Col>
					</Row>
					<p>
						I had taken a home loan of Rs. 25 lakhs over 20 years. After paying installments for more than 7
						years, I was wondering if I should prepay the remaining loan of Rs. 17 lakhs and save on
						interest or invest the money instead. Moneo helped me to solve this predicament. By using
						Moneo's loan calculator, I was instantly able to get answers to various scenarios. It even
						allowed me to assess the impact of refinancing the loan. Finally, I decided that I am better off
						prepaying the loan and get much needed peace of mind. Moneo has now become my go-to coach for
						financial analysis and planning.
					</p>
				</div>
				<div key="t2" className="client-testimonial">
					<Row align="middle">
						<Col span={5}>
							<Avatar size={80} icon={<UserOutlined />} />
						</Col>
						<Col span={19}>
							<hgroup>
								<h3>Snehal</h3>
								<h4>Bangalore</h4>
							</hgroup>
						</Col>
					</Row>
					<p>
						I have been working for more than 30 years, and keen for early retirement. While I am not
						comfortable with financial jargons, using Moneo was a breeze! Within 15 minutes, I was able to
						define my goals and had a concrete understanding of the money needed for early retirement. I
						also realized that I could retire within 5 years! Moneo presented detailed graphs and
						information to give me a better understanding of my financial situation and the road ahead. My
						wife and I are so relaxed about our financial situation. I highly recommend Moneo to everyone.
					</p>
				</div>
				<div key="t3" className="client-testimonial">
					<Row align="middle">
						<Col span={5}>
							<Avatar size={80} icon={<UserOutlined />} />
						</Col>
						<Col span={19}>
							<hgroup>
								<h3>Neha</h3>
								<h4>Bangalore</h4>
							</hgroup>
						</Col>
					</Row>
					<p>
						My family has been living on rent since 20 years, and my husband uses a rental car for his
						office commute. I had been trying to convince him to buy an apartment and a car since sometime,
						but he wasn't sure as it required us to use most of our savings. This had become a hotly debated
						topic in the family. Finally, Moneo came to our rescue. Using Moneo's Buy vs Rent and Invest
						calculator, we realized that we are much better off renting the apartment and car. We saved XYZ
						amount by running our plan through the calculator.
					</p>
				</div>
			</Carousel>
		</Content>
	);
}
