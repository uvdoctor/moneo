import React, { ReactNode, useContext, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs, Space, Statistic, Row, Col } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { CalcContext } from '../calc/CalcContext';
interface ResultProps {
	result: ReactNode;
	children: ReactNode;
}

export default function Result(props: ResultProps) {
	const { resultTabs, setResultTabs, showResultTab }: any = useContext(CalcContext);
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;
	return (
		<div ref={chartDiv} style={{ width: '100%' }}>
			{props.result}
			<Space align="center" size="large">
				<div style={{ cursor: 'pointer' }} onClick={toggle}>
					{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
				</div>
				<Tabs
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
									prefix={
										<tab.svg disabled={!tab.active} selected={showResultTab === tab.label} />
									}
								/>
							}
						/>
					))}
				</Tabs>
			</Space>
			<Row>
				<Col span={24} style={{ minHeight: '400px' }}>
					{React.Children.map(props.children, (child: any) => (child ? child : null))}
				</Col>
			</Row>
		</div>
	);
}
