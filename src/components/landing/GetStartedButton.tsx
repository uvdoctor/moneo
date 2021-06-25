import { Button } from 'antd';
import Link from 'next/link';
import React from 'react';
import { ROUTES } from '../../CONSTANTS';
import RollingImages from '../RollingImages';

export default function GetStartedButton() {
	return (
		<Link href={ROUTES.SET}>
			<a>
				<Button icon={<RollingImages />} type="primary" size="large" className="start-steps-btn">
					Get Started
				</Button>
			</a>
		</Link>
	);
}
