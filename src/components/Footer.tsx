import React, { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { FacebookIcon, LinkedinIcon, TwitterIcon } from 'react-share';
import { YoutubeFilled, InstagramFilled } from '@ant-design/icons';
import Content from './Content';

import './Footer.less';
import { PlanContext } from './goals/PlanContext';
import { COLORS } from '../CONSTANTS';

export default function Footer() {
	const websiteUrl = 'https://moneo.money';
	const [ url, setUrl ] = useState(websiteUrl);
	const { goal }: any = useContext(PlanContext);

	useEffect(() => setUrl(`${websiteUrl}${window.location.pathname}`), []);

	return !goal ? (
		<Content className="footer">
			<Row justify="space-between">
				<Col xs={24} sm={24} md={12}>
					<h3>Moneo India Private Limited</h3>
					<p>
						1, Anita Society, Nr. Vishwakunj Cross-roads,<br/>
						Narayan Nagar Road, Paldi.<br/>
						Ahmedabad - 380007. Gujarat.
					</p>
					<div className="social-icons">
						<a target="_blank" href={url} rel="noopener noreferrer">
							<FacebookIcon round />
						</a>
						<a target="_blank" href={url} rel="noopener noreferrer">
							<LinkedinIcon round />
						</a>
						<a target="_blank" href={url} rel="noopener noreferrer">
							<TwitterIcon round />
						</a>
						<a target="_blank" href={url} rel="noopener noreferrer">
							<YoutubeFilled />
						</a>
						<a target="_blank" href={url} rel="noopener noreferrer">
							<InstagramFilled />
						</a>
					</div>
				</Col>
				<Col xs={24} sm={24} md={12} style={{ textAlign: 'right' }}>
					<h3>Quick Links</h3>
					<ul>
						<li>
							<a href="#">About Us</a>
						</li>
						<li>
							<a href="#">Contact Us</a>
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
			<Row>
				<Col>
					&copy; 2021 Moneo. All rights reserved. Made with{' '}
					<span style={{ color: COLORS.RED }}>&#10084;</span> in India.
				</Col>
			</Row>
			<Row>
				<Col className="disclaimer" xs={24}>
					Disclaimer: This site is protected by reCAPTCHA and the Google{' '}
					<a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
					<a href="https://policies.google.com/terms">Terms of Service</a> apply.
				</Col>
			</Row>
		</Content>
	) : null;
}
