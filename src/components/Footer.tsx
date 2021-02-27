import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import {
	EmailShareButton,
	EmailIcon,
	FacebookShareButton,
	FacebookIcon,
	InstapaperShareButton,
	InstapaperIcon,
	LinkedinShareButton,
	LinkedinIcon,
	PinterestShareButton,
	PinterestIcon,
	RedditShareButton,
	RedditIcon,
	TwitterShareButton,
	TwitterIcon,
	TelegramShareButton,
	TelegramIcon,
	WhatsappShareButton,
	WhatsappIcon,
	ViberShareButton,
	ViberIcon,
} from "react-share";
import Content from "./Content";
import { calcList } from "./landing/Calculator";

import "./Footer.less";

export default function Footer() {
	const websiteUrl = "https://gomoneo.com";
	const [url, setUrl] = useState(websiteUrl);

	useEffect(() => setUrl(`${websiteUrl}${window.location.pathname}`), [null]);

	return (
		<Content className="footer">
			<Row
				gutter={[
					{ xs: 20, sm: 20, md: 25 },
					{ xs: 20, sm: 20, md: 25 },
				]}
			>
				<Col xs={24} sm={24} md={12}>
					<h3>About US</h3>
					<p>
						Lorem Ipsum is simply dummy text of the printing and typesetting
						industry. Lorem Ipsum has been the industry's standard dummy text
						ever since the 1500s, when an unknown printer took a galley of type
						and scrambled it to make a type specimen book. It has survived not
						only five centuries, but also the leap into electronic typesetting,
						remaining essentially unchanged.
					</p>
					<div className="social-icons">
						<FacebookShareButton url={url}>
							<FacebookIcon round />
						</FacebookShareButton>
						<InstapaperShareButton url={url}>
							<InstapaperIcon round />
						</InstapaperShareButton>
						<TwitterShareButton url={url}>
							<TwitterIcon round />
						</TwitterShareButton>
					</div>
				</Col>
				<Col xs={24} sm={24} md={12}>
					<Row
						gutter={[
							{ xs: 0, sm: 0, md: 30 },
							{ xs: 0, sm: 0, md: 30 },
						]}
					>
						<Col span={12}>
							<h3>Calculators</h3>
							<ul>
								{calcList.map(({ name, link }) => (
									<li key={name}>
										<a href={link}>{name}</a>
									</li>
								))}
							</ul>
						</Col>
						<Col span={12}>
							<h3>Quick Links</h3>
							<ul>
								<li>
									<a href="#">About US</a>
								</li>
								<li>
									<a href="#">Contact US</a>
								</li>
								<li>
									<a href="#">Terms and Conditions</a>
								</li>
								<li>
									<a href="#">Privacy Policy</a>
								</li>
							</ul>
						</Col>
					</Row>
				</Col>
				<Col>&copy; 2021 Moneo. All rights reserved.</Col>
				<Col className="disclaimer" xs={24}>
					Disclaimer: This site is protected by reCAPTCHA and the Google{" "}
					<a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
					<a href="https://policies.google.com/terms">Terms of Service</a>{" "}
					apply.
				</Col>
			</Row>
		</Content>
	);
}
