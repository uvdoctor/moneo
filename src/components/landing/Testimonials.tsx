import React from "react";
import Carousel from "react-elastic-carousel";
import { Avatar, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Content from "../Content";

import "./testimonials.less";

export default function Testimonials() {
	const mobileSlideCount = 1;
	const tabletSlideCount = 2;
	const desktopSlideCount = 2;

	return (
		<Content className="client-testimonials">
			<h2>What Users Are Saying about the Calculators</h2>
			<Carousel
				itemsToShow={2}
				breakPoints={[
					{
						width: 300,
						itemsToShow: mobileSlideCount,
						itemsToScroll: mobileSlideCount,
					},
					{
						width: 577,
						itemsToShow: tabletSlideCount,
						itemsToScroll: tabletSlideCount,
					},
					{
						width: 992,
						itemsToShow: desktopSlideCount,
						itemsToScroll: desktopSlideCount,
					},
				]}
				showArrows={false}
			>
				{[...Array(5).keys()].map((index: number) => (
					<div key={"" + index} className="client-testimonial">
						<Row align="middle">
							<Col span={5}>
								<Avatar size={80} icon={<UserOutlined />} />
							</Col>
							<Col span={19}>
								<hgroup>
									<h3>Angelina Doe</h3>
									<h4>UI/UX Designer</h4>
								</hgroup>
							</Col>
						</Row>
						<p>
							Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry's standard dummy text
							ever since the 1500s, when an unknown printer took a galley of
							type and scrambled it to make a type specimen book. It has
							survived not only five centuries, but also the leap into
							electronic typesetting, remaining essentially unchanged.
						</p>
					</div>
				))}
			</Carousel>
		</Content>
	);
}
