import React, { Fragment, ReactNode, useContext, useRef } from 'react';
import { useFullScreen } from 'react-browser-hooks';
import { Tabs, Row, Col } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import CalcHeader from '../calc/CalcHeader';
import TabContent from './TabContent';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';
import GoalHeader from './GoalHeader';
import FIGoalHeader from './FIGoalHeader';
interface ResultProps {
	results: Array<ReactNode> | ReactNode;
}

export default function Result({ results }: ResultProps) {
	const { goal, resultTabs, resultTabIndex, setResultTabIndex }: any = useContext(CalcContext);
	const chartDiv = useRef(null);
	const { toggle, fullScreen } = useFullScreen({ element: chartDiv });
	const { TabPane } = Tabs;

	return (
		<div className="calculator-content">
			{goal.type ? goal.type === GoalType.FF ? <FIGoalHeader /> : <GoalHeader /> : <CalcHeader />}
			<div ref={chartDiv}>
				<Row justify="end" style={{ cursor: 'pointer' }} onClick={toggle}>
					{!fullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
				</Row>
				{results && results instanceof Array ? (
					results.length > 0 && (
						<Row className="dd-stats" justify="space-around">
							{results.map((result, i) => (
								<Col key={'result' + i} span={11}>
									{result}
								</Col>
							))}
						</Row>
					)
				) : (
					<Col className="dd-stats" span={24}>
						{results}
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
