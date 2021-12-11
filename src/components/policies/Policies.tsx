import { Col, Row, Tabs } from 'antd';
import React, { Fragment } from 'react';
import MajorAssumptions from '../calc/blog/MajorAssumptions';
import { isMobileDevice } from '../utils';
import { useFullScreenBrowser } from 'react-browser-hooks';
import privacyContent from './PrivacyContent';
import securityContent from './SecurityContent';
import tcConent from './TCContent';
import Link from 'next/link';
import { ROUTES } from '../../CONSTANTS';

interface PoliciesProps {
	type: string;
}

export default function Policies({ type }: PoliciesProps) {
	const fsb = useFullScreenBrowser();
	const { TabPane } = Tabs;

	const sections: any = {
		'Terms & Conditions': <MajorAssumptions elements={[ ...tcConent ]} />,
		Privacy: <MajorAssumptions elements={[ ...privacyContent ]} />,
		Security: <MajorAssumptions elements={[ ...securityContent ]} />
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
