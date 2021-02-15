import React, { useContext, useState, Fragment } from 'react';
import { getImpOptions, getGoalTypes, createNewGoalInput } from './goalutils';
import SelectInput from '../form/selectinput';
import AssetAllocationChart from './AssetAllocationChart';
import PlanStart from './PlanStart';
import FISummaryHeader from './FISummaryHeader';
import { Button, Col, Dropdown, Menu, Row, Tabs } from 'antd';
import { faChartLine, faChartPie, faBullseye } from '@fortawesome/free-solid-svg-icons';
import GoalSummary from './GoalSummary';
import { PlanContext } from './PlanContext';
import YearlyCFChart from './YearlyCFChart';
import { CalcContextProvider } from '../calc/CalcContext';
import MenuItem from 'antd/lib/menu/MenuItem';
import { GoalType } from '../../api/goals';
import { DownOutlined } from '@ant-design/icons';
import { FIGoalContextProvider } from './FIGoalContext';

export default function PlanView() {
	const { allGoals, ffGoal, goalsLoaded, setGoal }: any = useContext(PlanContext);
	const { TabPane } = Tabs;
	const goalsLabel = 'Goals';
	const cfLabel = 'Cash Flows';
	const aaLabel = 'Allocation';
	const [ impFilter, setImpFilter ] = useState<string>('');

	const tabOptions = [
		{
			label: goalsLabel,
			svg: faBullseye,
			content: <GoalSummary impFilter={impFilter} />
		},
		{
			label: aaLabel,
			svg: faChartPie,
			content: (
				<CalcContextProvider goal={ffGoal}>
					<FIGoalContextProvider>
						<AssetAllocationChart />
					</FIGoalContextProvider>
				</CalcContextProvider>
			)
		},
		{
			label: cfLabel,
			svg: faChartLine,
			content: <YearlyCFChart />
		}
	];

	const goalTypesMenuItems = (
		<Menu>
			{Object.keys(getGoalTypes()).map(
				(key: string) =>
					key !== GoalType.FF && (
						<MenuItem onClick={() => setGoal(createNewGoalInput(key as GoalType, ffGoal.ccy))}>
							{getGoalTypes()[key as GoalType]}
						</MenuItem>
					)
			)}
		</Menu>
	);

	return goalsLoaded ? ffGoal ? (
		<Fragment>
			<FISummaryHeader />
			<Row justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
				<Col>
					<Dropdown overlay={goalTypesMenuItems}>
						<Button>
							Define Your Dreams <DownOutlined />
						</Button>
					</Dropdown>
				</Col>
			</Row>
			{allGoals && allGoals.length ? (
				<Row>
					<Col className="steps-content" span={24}>
						<Tabs type="card">
							{tabOptions.map((t: any) => (
								<TabPane
									key={t.label}
									tab={
										t.label === goalsLabel ? (
											<SelectInput
												pre=""
												post="Goals"
												options={getImpOptions()}
												value={impFilter as string}
												changeHandler={setImpFilter}
											/>
										) : (
											t.label
										)
									}
								>
									{t.label !== aaLabel && (
										<Row justify="center">
											Negative values imply You Pay, while Positive values imply You Receive
										</Row>
									)}
									{t.content}
								</TabPane>
							))}
						</Tabs>
					</Col>
				</Row>
			) : null}
		</Fragment>
	) : (
		<PlanStart />
	) : null;
}
