import React, { Fragment, useContext, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import CalcHeader from '../calc/CalcHeader';
import { CalcContext } from '../calc/CalcContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ResultCarousel from '../ResultCarousel';

export default function Result() {
	const { resultTabs, resultTabIndex, setResultTabIndex, error }: any = useContext(CalcContext);
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;

	return (
		<div className="calculator-content">
			<CalcHeader />
			{!error && (
				<div className={`results-content ${fullScreen ? 'fullScreen-mode-enabled' : ''}`} ref={chartDiv}>
					<ResultCarousel />
					<Tabs
						className="dd-chart"
						onTabClick={(key: string) => setResultTabIndex(parseInt(key))}
						activeKey={'' + resultTabIndex}
						type="card"
						tabBarExtraContent={
							<div className="fullScreen-icon" onClick={toggle}>
								{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
							</div>
						}
					>
						{resultTabs.map((tab: any, i: number) => (
							<TabPane
								key={'' + i}
								disabled={!tab.active}
								className={!tab.active ? 'disabled' : ''}
								tab={
									<Fragment>
										<FontAwesomeIcon icon={tab.svg} />
										<label>{tab.label}</label>
									</Fragment>
								}
							>
								{resultTabs[resultTabIndex].content}
							</TabPane>
						))}
					</Tabs>
				</div>
			)}
		</div>
	);
}
