import React from 'react';
import { Layout } from 'antd';
import DDContent from './DDContent';

import './DDFooter.less';

export default function Footer() {
	const { Footer } = Layout;

	return (
		<DDContent className="dd-footer">
			<Footer>
				<p>&copy; 2020 Dollar Darwin. All rights reserved.</p>
				<p>
					{`This site is protected by reCAPTCHA and the Google `}
					<a href="https://policies.google.com/privacy">Privacy Policy</a> and {` `}
					<a href="https://policies.google.com/terms">Terms of Service</a> apply.
				</p>
			</Footer>
		</DDContent>
	);
}
