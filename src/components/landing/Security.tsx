import React from 'react';
import { Row, Col } from 'antd';
import Content from '../Content';
import Image from 'next/image'

export default function Security() {
	return (
		<Content className="security" whiteBg>
			<Row align="middle" gutter={[ 50, 0 ]}>
				<Col xs={24} sm={24} md={12}>
					<h2>
						Bank-grade <span className="text-green-primary">security</span> &amp;{' '}
						<span className="text-green-primary">control</span>
					</h2>
					<p>
						We have implemented the highest standard for fraud protection and compliance with 256-bit encryption. We take data privacy seriously, and promise to never sell your data.
					</p>
				</Col>
				<Col xs={24} sm={24} md={12}>
					<Image src="/images/security.jpg" alt='' height={313} width={565} layout='responsive'/>
				</Col>
			</Row>
		</Content>
	);
}
