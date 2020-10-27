import React, { Fragment, ReactNode, useContext, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs, Row, Col, Rate } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import CalcHeader from '../calc/CalcHeader';
import TabContent from './TabContent';
import { CalcContext } from '../calc/CalcContext';
import { COLORS } from '../../CONSTANTS';
import * as gtag from '../../lib/gtag';

interface ResultProps {
	results: Array<ReactNode>;
}

export default function Result({ results }: ResultProps) {
	const { goal, resultTabs, resultTabIndex, setResultTabIndex }: any = useContext(CalcContext);
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;

	const reportFeedback = (val: number) => {
		gtag.event({
			category: goal.name,
			action: 'Feedback',
			label: 'Rating',
			value: val
		});
	};

	return (
		<div className="calculator-content">
			<CalcHeader />
			<Row align="middle" justify="center" style={{ backgroundColor: COLORS.DEFAULT, color: 'white' }}>
				Your Feedback
				<Rate
					allowHalf
					allowClear
					defaultValue={0}
					style={{ marginLeft: '0.5rem' }}
					onChange={(rating: number) => reportFeedback(rating)}
				/>
			</Row>
			<div ref={chartDiv}>
				<Row justify="end" style={{ cursor: 'pointer' }} onClick={toggle}>
					{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
				</Row>
				{results &&
				results.length > 0 && (
					<Row className="dd-stats" gutter={[ { xs: 10, sm: 10, md: 35, lg: 40 }, 0 ]}>
						{results.map(
							(result, i: number) =>
								result ? (
									<Col key={'result' + i} span={12}>
										{result}
									</Col>
								) : null
						)}
					</Row>
				)}
				<Tabs
					className="dd-chart"
					onTabClick={(key: string) => setResultTabIndex(parseInt(key))}
					defaultActiveKey={resultTabIndex}
					type="card"
				>
					{resultTabs.map((tab: any, i: number) => (
						<TabPane
							key={i}
							disabled={!tab.active}
							tab={
								<Fragment>
									<tab.svg disabled={!tab.active} selected={resultTabIndex === i} />
									{tab.label}
								</Fragment>
							}
						>
							<TabContent result />
						</TabPane>
					))}
				</Tabs>
			</div>
		</div>
	);
}
