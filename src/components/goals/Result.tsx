import React, { ReactNode, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs, Space } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
interface ResultProps {
	result: ReactNode;
	resultTabOptions: Array<any>;
	showResultTab: string;
	children: ReactNode;
	showResultTabHandler: Function;
}

export default function Result(props: ResultProps) {
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;
	return (
		<div ref={chartDiv} style={{ width: '100%' }}>
			<Space align="center" direction="vertical" size="large">
				{props.result}
				<Space align="center" size="large">
					<div style={{ cursor: 'pointer' }} onClick={toggle}>
						{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
					</div>
					<Tabs
						onTabClick={(key: string) => props.showResultTabHandler(key)}
						defaultActiveKey={props.resultTabOptions[0].label}
					>
						{props.resultTabOptions.map((tab) => (
							<TabPane
								key={tab.label}
								disabled={!tab.active}
								tab={
									<span>
										<tab.svg disabled={!tab.active} selected={props.showResultTab === tab.label} />
										{tab.label}
									</span>
								}
							/>
						))}
					</Tabs>
				</Space>
				{React.Children.map(props.children, (child: any) => (child ? child : null))}
			</Space>
		</div>
	);
}
