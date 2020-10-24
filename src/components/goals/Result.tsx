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
		<div className="calculator-content">
			<CalcHeader />
			<div ref={chartDiv}>
				<Row justify="end" style={{ cursor: 'pointer' }} onClick={toggle}>
					{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
				</Row>
				{props.results &&
				props.results.length > 0 && (
					<Row className="dd-stats" gutter={[ { xs: 10, sm: 10, md: 35, lg: 40 }, 0 ]}>
						{props.results.map(
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
							{React.Children.map(
								props.children,
								(child: any, i: number) =>
									child ? (
										<Col key={'child' + i} span={24} style={{ minHeight: '400px' }}>
											{child}
										</Col>
									) : null
							)}
						</TabPane>
					))}
				</Tabs>
			</div>
		</div>
	);
}
