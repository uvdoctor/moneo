import React from 'react';
import { Row, Col } from 'antd';
import Content from '../Content';
import Image from 'next/image'

require('./TakeQuickStep.less');
import GetStartedButton from './GetStartedButton';

export default function TakeQuickStep() {
	return (
		<Content className="take-quick-step" whiteBg>
			<Row
				align="middle"
				gutter={[
					50,
					0
				]}>
				<Col xs={24} sm={24} md={12}>
					<h2 className="text-green-primary">Just 15 minutes for a personalized Financial Plan</h2>
					<p>&nbsp;</p>
					<GetStartedButton />
				</Col>
				<Col xs={24} sm={24} md={12}>
					<Image src="/images/quick-step.jpg"  alt='' height={100} width={300} layout='responsive'/>
				</Col>
			</Row>
		</Content>
	);
}
