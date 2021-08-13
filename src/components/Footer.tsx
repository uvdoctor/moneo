import React, { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { FacebookIcon, LinkedinIcon, TwitterIcon } from 'react-share';
import { YoutubeFilled, InstagramFilled } from '@ant-design/icons';
import Content from './Content';

import './Footer.less';
import { PlanContext } from './goals/PlanContext';
import { COLORS } from '../CONSTANTS';

export default function Footer() {
	const websiteUrl = 'https://moneo.in';
	const [ url, setUrl ] = useState(websiteUrl);
	const { goal }: any = useContext(PlanContext);
	const year = new Date().getFullYear();

	useEffect(() => setUrl(`${websiteUrl}${window.location.pathname}`), []);

	return !goal ? (
		<Content className="footer">
			{/*<Row justify="center">
				<Col>
					<h3><strong>Moneo Advisors Private Limited</strong></h3>
					<p>
						1, Anita Society, Nr. Vishwakunj Cross-roads,<br />
						Narayan Nagar Road, Paldi.<br />
						Ahmedabad - 380007. Gujarat.
					</p>
				</Col>
	</Row>*/}
			<Row justify="center">
				<Col xs={20} sm={12} md={10} lg={6} className="social-icons">
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
				</Col>
			</Row>
			<Row justify="center">
				<Col>
					<a href="#">Terms & Conditions</a>&nbsp; | &nbsp;
					<a href="#">Privacy Policy</a> &nbsp; | &nbsp;
				</Col>
			</Row>
			<Row justify="center">
				<Col>&copy; {year} Moneo. All rights reserved.</Col>
			</Row>
			<Row justify="center">
				<Col>
					Made with <span style={{ color: COLORS.RED }}>&#10084;</span> in India.
				</Col>
			</Row>
			<Row justify="center">
				<Col className="disclaimer">
					Disclaimer: This site is protected by reCAPTCHA and the Google{' '}
					<a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
					<a href="https://policies.google.com/terms">Terms of Service</a> apply.
				</Col>
			</Row>
		</Content>
	) : null;
}
