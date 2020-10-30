import React, { Fragment, ReactNode, useContext, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs, Row, Col } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import CalcHeader from '../calc/CalcHeader';
import TabContent from './TabContent';
import { CalcContext } from '../calc/CalcContext';
interface ResultProps {
	results: Array<ReactNode>;
}

export default function Result({ results }: ResultProps) {
	const { resultTabs, resultTabIndex, setResultTabIndex }: any = useContext(CalcContext);
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;

	return (
		<div className="calculator-content">
			<CalcHeader />
			<div ref={chartDiv}>
				<Row justify="end" style={{ cursor: 'pointer' }} onClick={toggle}>
					{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
				</Row>
				{results &&
				results.length > 0 && (
					<Col span={24}>
						<Row className="dd-stats" justify="space-around">
							{results.map((result, i) => <Col key={'result' + i}>{result}</Col>)}
						</Row>
					</Col>
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
