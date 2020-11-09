import React, { Fragment, useContext, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import CalcHeader from '../calc/CalcHeader';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';
import GoalHeader from './GoalHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ResultCarousel from '../ResultCarousel';

export default function Result() {
	const { goal, resultTabs, resultTabIndex, setResultTabIndex, results }: any = useContext(CalcContext);
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;

	return (
		<div className="calculator-content">
			{goal.type && goal.type !== GoalType.FF ? <GoalHeader /> : <CalcHeader />}
			<div className="results-content" ref={chartDiv}>
				<ResultCarousel results={results} />
				<Tabs
					className="dd-chart"
					onTabClick={(key: string) => setResultTabIndex(parseInt(key))}
					defaultActiveKey={resultTabIndex}
					type="card"
					tabBarExtraContent={
						<div className="fullScreen-icon" onClick={toggle}>
							{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
						</div>
					}
				>
					{resultTabs.map((tab: any, i: number) => (
						<TabPane
							key={i}
							disabled={!tab.active}
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
		</div>
	);
}
