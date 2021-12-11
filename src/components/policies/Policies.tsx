import { Col, Row, Tabs } from 'antd';
import React, { Fragment } from 'react';
import { isMobileDevice } from '../utils';
import { useFullScreenBrowser } from 'react-browser-hooks';
import Link from 'next/link';
import { ROUTES } from '../../CONSTANTS';
import TCContent from './TCContent';
import PrivacyContent from './PrivacyContent';
import SecurityContent from './SecurityContent';

interface PoliciesProps {
	type: string;
}

export default function Policies({ type }: PoliciesProps) {
	const fsb = useFullScreenBrowser();
	const { TabPane } = Tabs;

	const sections: any = {
		'Terms & Conditions':  <TCContent />,
		Privacy: <PrivacyContent />,
		Security: <SecurityContent />
	};

	return (
		<Fragment>
			<Row className="steps-content">
				<Col>
					<Tabs
						defaultActiveKey={type}
						tabPosition={isMobileDevice(fsb) ? 'top' : 'left'}
						type={isMobileDevice(fsb) ? 'card' : 'line'}
						animated
					>
						{Object.keys(sections).map((key: string) => (
							<TabPane
								key={key}
								tab={
									<Link
										href={
											key === 'Privacy' ? (
												ROUTES.PRIVACY
											) : key === 'Security' ? (
												ROUTES.SECURITY
											) : (
												ROUTES.TC
											)
										}
									>
										<a>{key}</a>
									</Link>
								}
							>
								{sections[key]}
							</TabPane>
						))}
					</Tabs>
				</Col>
			</Row>
		</Fragment>
	);
}
