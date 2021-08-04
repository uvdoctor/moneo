import React from "react";
import { Row, Col } from "antd";
import Card from "./Card";
import Content from "../Content";

import "./about.less";

export default function Home() {
	const cardData = [
		{
			title: "What",
			description: "Through a platform where privacy & security area priority",
			imageUrl: "images/about-what.jpg",
		},
		{
			title: "Why",
			description: "To help people get better with their money",
			imageUrl: "images/about-why.jpg",
		},
		{
			title: "How",
			description:
				"With a digital-first, no-nonsense approach. No branches or tiresome paperwork",
			imageUrl: "images/about-how.jpg",
		},
	];

	return (
		<Content className="about">
			<h2>About US</h2>
			<p>
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book. It has survived not only five
				centuries, but also the leap into electronic typesetting, remaining
				essentially unchanged. It was popularised in the 1960s with the release
				of Letraset sheets containing Lorem Ipsum passages, and more recently
				with desktop publishing software like Aldus PageMaker including versions
				of Lorem Ipsum.
			</p>
			<p>
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book. It has survived not only five
				centuries, but also the leap into electronic typesetting, remaining
				essentially unchanged. It was popularised in the 1960s with the release
				of Letraset sheets containing Lorem Ipsum passages, and more recently
				with desktop publishing software like Aldus PageMaker including versions
				of Lorem Ipsum.
			</p>

			<Row
				align="middle"
				gutter={[
					{ xs: 0, sm: 15, md: 30, lg: 50 },
					{ xs: 15, sm: 15, md: 30, lg: 50 },
				]}
			>
				{cardData.map((data) => (
					<Col xs={24} md={8}>
						<Card {...data} />
					</Col>
				))}
			</Row>

			<h2>Company (Optional)</h2>
			<p>
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book. It has survived not only five
				centuries, but also the leap into electronic typesetting, remaining
				essentially unchanged. It was popularised in the 1960s with the release
				of Letraset sheets containing Lorem Ipsum passages, and more recently
				with desktop publishing software like Aldus PageMaker including versions
				of Lorem Ipsum.
			</p>
			<p>
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book. It has survived not only five
				centuries, but also the leap into electronic typesetting, remaining
				essentially unchanged. It was popularised in the 1960s with the release
				of Letraset sheets containing Lorem Ipsum passages, and more recently
				with desktop publishing software like Aldus PageMaker including versions
				of Lorem Ipsum.
			</p>

			<h2>What can I use Money Darwin for?</h2>
			<ul>
				<li>
					It is a long established fact that a reader will be distracted by the
					readable content of a page when looking at its layout.
				</li>
				<li>
					The point of using Lorem Ipsum is that it has a more-or-less normal
					distribution of letters, as opposed to using 'Content here, content
					here', making it look like readable English.
				</li>
				<li>
					Many desktop publishing packages and web page editors now use Lorem
					Ipsum as their default model text, and a search for 'lorem ipsum' will
					uncover many web sites still in their infancy.
				</li>
				<li>
					Various versions have evolved over the years, sometimes by accident,
					sometimes on purpose (injected humour and the like).
				</li>
			</ul>
		</Content>
	);
}
