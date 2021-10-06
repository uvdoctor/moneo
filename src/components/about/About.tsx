import React from "react";
import { Row, Col } from "antd";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "./Card";
import Content from "../Content";

import "./about.less";

export default function Home() {
	const cardData = [
		{
			title: "What",
			description: "Moneo is a one-stop financial coaching platform to help families achieve worry-free financial independence.",
			imageUrl: "images/about-what.jpg",
		},
		{
			title: "Why",
			description: "There is nothing personal about personal finance. Moneo is here to change that. ",
			imageUrl: "images/about-why.jpg",
		},
		{
			title: "How",
			description:
				"Moneo not only provides a personalized financial plan, but also helps you to invest according to the plan.",
			imageUrl: "images/about-how.jpg",
		},
	];

	return (
		<div className="about">
			<Content className="founder-quote" whiteBg>
				<img src="images/founder.jpg" />
				<hgroup>
					<h2>
						<FontAwesomeIcon icon={faQuoteLeft} />
						We're building the world's most human digital financial coach.
						<FontAwesomeIcon icon={faQuoteRight} />
					</h2>
					<h4>- Umang Doctor, Founder</h4>
				</hgroup>
			</Content>
			<Content>
				<h2>About Us</h2>
				<p>
					Lorem Ipsum is simply dummy text of the printing and typesetting
					industry. Lorem Ipsum has been the industry's standard dummy text ever
					since the 1500s, when an unknown printer took a galley of type and
					scrambled it to make a type specimen book. It has survived not only
					five centuries, but also the leap into electronic typesetting,
					remaining essentially unchanged. It was popularised in the 1960s with
					the release of Letraset sheets containing Lorem Ipsum passages, and
					more recently with desktop publishing software like Aldus PageMaker
					including versions of Lorem Ipsum.
				</p>
				<p>
					Lorem Ipsum is simply dummy text of the printing and typesetting
					industry. Lorem Ipsum has been the industry's standard dummy text ever
					since the 1500s, when an unknown printer took a galley of type and
					scrambled it to make a type specimen book. It has survived not only
					five centuries, but also the leap into electronic typesetting,
					remaining essentially unchanged. It was popularised in the 1960s with
					the release of Letraset sheets containing Lorem Ipsum passages, and
					more recently with desktop publishing software like Aldus PageMaker
					including versions of Lorem Ipsum.
				</p>

				<Row
					className="what-why-how"
					align="middle"
					justify="center"
					gutter={[
						{ xs: 0, sm: 15, md: 30, lg: 50 },
						{ xs: 50, sm: 50, md: 50, lg: 50 },
					]}
				>
					{cardData.map((data, i) => (
						<Col key={i} xs={24} sm={12} md={8}>
							<Card {...data} />
						</Col>
					))}
				</Row>
			</Content>
			<Content whiteBg>
				<h2><strong>150+ years of global experience</strong></h2>
				<p>
					We have hired leading financial and technology experts from around the world to build a global financial platform from the ground-up so that it leverages the best of human and machine capabilities to help families achieve worry-free financial independence.
				</p>
				<Row className="companies-logo" align="middle" gutter={[50, 50]}>
					{["natwest", "sapient", "thoughtworks", "jpmorgan", "jabong"].map(
						(company, i) => (
							<Col key={i}>
								<div className={`${company}-logo`}></div>
							</Col>
						)
					)}
				</Row>
			</Content>
		</div>
	);
}
