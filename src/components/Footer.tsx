import React from 'react';
import { Col, Layout, Row } from 'antd';
import Content from './Content';

import './Footer.less';

export default function Footer() {
	const { Footer } = Layout;
	return (
		<Content className="footer">
			<Footer>
			<Row justify="center"><Col>Estimates Only. No Advice.</Col></Row>
				<Row justify="center"><Col>&copy; 2021 Moneo. All rights reserved.</Col></Row>
				<Row justify="center">
					<Col>This site is protected by reCAPTCHA and the Google<span>&nbsp;</span></Col>
					<Col><a href="https://policies.google.com/privacy">Privacy Policy</a></Col>
					<Col><span>&nbsp;</span>and<span>&nbsp;</span></Col>
					<Col><a href="https://policies.google.com/terms">Terms of Service</a></Col>
					<Col><span>&nbsp;</span>apply.</Col>
				</Row>
			</Footer>
		</Content>
	);
}
