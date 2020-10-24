import React, { Fragment, ReactNode, useContext, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs, Row, Col } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { CalcContext } from '../calc/CalcContext';
import CalcHeader from '../calc/CalcHeader';

interface ResultProps {
	results: Array<ReactNode>;
	children: ReactNode;
}

export default function Result(props: ResultProps) {
	const { resultTabs, showResultTab, setShowResultTab }: any = useContext(CalcContext);
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;
	return (
		<div ref={chartDiv} className="calculator-content">
			<CalcHeader />
			<div style={{ cursor: 'pointer' }} onClick={toggle}>
				{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
			</div>
			{props.results && props.results.length > 0 && <Row className="dd-stats" gutter={[{ xs: 10, sm: 10, md: 35, lg: 40 }, 0]}>
				{props.results.map((result) => result && <Col span={Math.round(24 / props.results.length)}>{result}</Col>)}
			</Row>}
			<Tabs
				className="dd-chart"
				onTabClick={(key: string) => setShowResultTab(key)}
				defaultActiveKey={showResultTab}
				type="card"
			>
				{resultTabs.map((tab: any) => (
					<TabPane
						key={tab.label}
						disabled={!tab.active}
						tab={
							<Fragment>
								<tab.svg disabled={!tab.active} selected={showResultTab === tab.label} />
								{tab.label}
							</Fragment>
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
