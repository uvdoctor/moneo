import { Button, Row } from 'antd';
import Link from 'next/link';
import React from 'react';
import { ROUTES } from '../../CONSTANTS';
import RollingImages from '../RollingImages';

export default function SetGoalsButton() {
	return (
		<Link href={ROUTES.SET}>
			<a>
				<Button type="primary" size="large" className="set-button">
					<Row align="middle">
						Set My Goals &nbsp;<RollingImages />
					</Row>
				</Button>
			</a>
		</Link>
	);
}
