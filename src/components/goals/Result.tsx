import React, { ReactNode, useContext, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs, Statistic, Row, Col } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { CalcContext } from '../calc/CalcContext';

interface ResultProps {
	results: Array<ReactNode>;
	children: ReactNode;
}

export default function Result(props: ResultProps) {
	const { resultTabs, setResultTabs, showResultTab }: any = useContext(CalcContext);
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;
	return (
		<div ref={chartDiv} className="calculator-content">
			<div style={{ cursor: 'pointer' }} onClick={toggle}>
				{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
			</div>
			<Row className="dd-stats" gutter={[ { xs: 10, sm: 10, md: 35, lg: 40 }, 0 ]}>
				{props.results.map((result) => <Col span={12}>{result}</Col>)}
			</Row>
			<Tabs
				className="dd-chart"
				onTabClick={(key: string) => setResultTabs(key)}
				defaultActiveKey={resultTabs[0].label}
			>
				{resultTabs.map((tab: any) => (
					<TabPane
						key={tab.label}
						disabled={!tab.active}
						tab={
							<Statistic
								title=""
								value={tab.label}
								prefix={<tab.svg disabled={!tab.active} selected={showResultTab === tab.label} />}
							/>
						}
					>
						<Row>
							<Col span={24} style={{ minHeight: '400px' }}>
								{React.Children.map(props.children, (child: any) => (child ? child : null))}
							</Col>
						</Row>
					</TabPane>
				))}
			</Tabs>
		</div>
	);
}
