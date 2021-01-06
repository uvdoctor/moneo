import React from 'react';
import { Layout } from 'antd';
import Content from './Content';

import './Footer.less';

export default function Footer() {
	const { Footer } = Layout;

	return (
		<Content className="footer">
			<Footer>
				<p>&copy; 2021 Moneo. All rights reserved.</p>
				<p>
					{`This site is protected by reCAPTCHA and the Google `}
					<a href="https://policies.google.com/privacy">Privacy Policy</a> and {` `}
					<a href="https://policies.google.com/terms">Terms of Service</a> apply.
				</p>
			</Footer>
		</Content>
	);
}
