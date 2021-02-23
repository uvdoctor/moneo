import React, { useContext, useState, Fragment } from 'react';
import { getImpOptions, getGoalTypes, createNewGoalInput } from './goalutils';
import SelectInput from '../form/selectinput';
import PlanStart from './PlanStart';
import FISummaryHeader from './FISummaryHeader';
import { Button, Col, Dropdown, Menu, Row, Tabs, Alert } from 'antd';
import { faChartLine, faChartPie, faBullseye, faChartBar } from '@fortawesome/free-solid-svg-icons';
import GoalSummary from './GoalSummary';
import { PlanContext } from './PlanContext';
import YearlyCFChart from './YearlyCFChart';
import { CalcContextProvider } from '../calc/CalcContext';
import MenuItem from 'antd/lib/menu/MenuItem';
import { GoalType } from '../../api/goals';
import { DownOutlined } from '@ant-design/icons';
import { FIGoalContextProvider } from './FIGoalContext';
import DynamicAAChart from './DynamicAAChart';
import BasicLineChart from './BasicLineChart';

export default function PlanView() {
	const { allGoals, ffGoal, goalsLoaded, setGoal }: any = useContext(PlanContext);
	const { TabPane } = Tabs;
	const portfolioLabel = 'Milestones';
	const goalsLabel = 'Goals';
	const cfLabel = 'Cash Flows';
	const aaLabel = 'Target Allocation';
	const [ impFilter, setImpFilter ] = useState<string>('');

	const tabOptions = [
		{
			label: portfolioLabel,
			svg: faChartLine,
			content: (
				<CalcContextProvider calculateFor={ffGoal}>
					<FIGoalContextProvider>
						<BasicLineChart showAnnotation chartTitle='Yearly Portfolio Forecast with Milestones' />
					</FIGoalContextProvider>
				</CalcContextProvider>
			)
		},
		{
			label: goalsLabel,
			svg: faBullseye,
			content: <GoalSummary impFilter={impFilter} />
		},
		{
			label: aaLabel,
			svg: faChartPie,
			content: (
				<CalcContextProvider calculateFor={ffGoal}>
					<FIGoalContextProvider>
						<DynamicAAChart />
					</FIGoalContextProvider>
				</CalcContextProvider>
			)
		},
		{
			label: cfLabel,
			svg: faChartBar,
			content: <YearlyCFChart />
		}
	];

	const goalTypesMenuItems = (
		<Menu>
			{Object.keys(getGoalTypes()).map(
				(key: string) =>
					key !== GoalType.FF && (
						<MenuItem key={key} onClick={() => setGoal(createNewGoalInput(key as GoalType, ffGoal.ccy))}>
							{getGoalTypes()[key as GoalType]}
						</MenuItem>
					)
			)}
		</Menu>
	);

	return goalsLoaded ? ffGoal ? (
		<Fragment>
			<div className="primary-header" style={{marginBottom: '10px'}}>
				<FISummaryHeader />
				<Row className="secondary-header" justify="center">
				<Col>
					<Dropdown overlay={goalTypesMenuItems}>
						<Button>
							Define Your Dreams <DownOutlined />
						</Button>
					</Dropdown>
				</Col>
				</Row>
			</div>
			{allGoals && allGoals.length ? (
				<Row>
					<Col span={24}>
						<Tabs type="card">
							{tabOptions.map((t: any) => (
								<TabPane key={t.label} tab={t.label}>
									{(t.label === goalsLabel || t.label === cfLabel) && (
										<Row justify={t.label === goalsLabel ? 'space-between' : 'center'} style={{marginBottom: '10px'}}>
											<Col>
												<Alert
													message="Negative values imply You Pay, while Positive values imply You Receive"
													type="info"
												/>
											</Col>
											{t.label === goalsLabel && (
												<Col className="text-right">
													<SelectInput
														pre=""
														post=""
														options={getImpOptions()}
														value={impFilter as string}
														changeHandler={setImpFilter}
													/>
												</Col>
											)}
										</Row>
									)}
									<Row
										align="middle"
										gutter={[
											{ xs: 0, sm: 15, md: 30, lg: 50 },
											{ xs: 15, sm: 15, md: 30, lg: 50 }
										]}
									>
										<Col span={24}>{t.content}</Col>
									</Row>
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
