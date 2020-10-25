import React, { Fragment, ReactNode, useContext, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs, Row, Col } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import CalcHeader from '../calc/CalcHeader';
import TabContent from './TabContent';

interface ResultProps {
	results: Array<ReactNode>;
	contextType: any;
}

export default function Result({ results, contextType }: ResultProps) {
	const { resultTabs, resultTabIndex, setResultTabIndex }: any = useContext(contextType);
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;
	return (
		<div className="calculator-content">
			<CalcHeader contextType={contextType} />
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
					onTabClick={(key: string) => setResultTabIndex(key)}
					defaultActiveKey={resultTabIndex}
					type="card"
				>
					{resultTabs.map((tab: any, i: number) => (
						<TabPane
							key={tab.label}
							disabled={!tab.active}
							tab={
								<Fragment>
									<tab.svg disabled={!tab.active} selected={resultTabIndex === i} />
									{tab.label}
								</Fragment>
							}
						>
							<TabContent contextType={contextType} result />
						</TabPane>
					))}
				</Tabs>
			</div>
		</div>
	);
}
