import React, { useContext, useState, Fragment } from 'react';
import { getImpOptions, getGoalTypes, createNewGoalInput, getDefaultIconForGoalType } from './goalutils';
import SelectInput from '../form/selectinput';
import PlanStart from './PlanStart';
import FISummaryHeader from './FISummaryHeader';
import { Button, Col, Dropdown, Menu, Row, Tabs } from 'antd';
import { faChartLine, faChartPie, faChartBar } from '@fortawesome/free-solid-svg-icons';
import GoalSummary from './GoalSummary';
import { PlanContext } from './PlanContext';
import YearlyCFChart from './YearlyCFChart';
import { CalcContextProvider } from '../calc/CalcContext';
import MenuItem from 'antd/lib/menu/MenuItem';
import { GoalType } from '../../api/goals';
import { DownOutlined, AimOutlined } from '@ant-design/icons';
import { FIGoalContextProvider } from './FIGoalContext';
import DynamicAAChart from './DynamicAAChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FIPortfolioChart from './FIPortfolioChart';
import { COLORS } from '../../CONSTANTS';

interface PlanViewProps {
	activeTab: string;
	setActiveTab: Function;
}

export default function PlanView({ activeTab, setActiveTab }: PlanViewProps) {
	const { allGoals, ffGoal, goalsLoaded, setGoal }: any = useContext(PlanContext);
	const { TabPane } = Tabs;
	const [ impFilter, setImpFilter ] = useState<string>('');
	
	return goalsLoaded ? ffGoal ? (
		<Fragment>
			<div className="primary-header" style={{ marginBottom: '10px' }}>
				<FISummaryHeader />
				<Row className="secondary-header" justify="center">
					<Col>
						<Dropdown overlay={
							<Menu>
								{Object.keys(getGoalTypes()).map((key: string) =>
									key !== GoalType.FF && (
										<MenuItem key={key} icon={<FontAwesomeIcon icon={getDefaultIconForGoalType(key as GoalType)} size="lg" color={COLORS.DEFAULT} />} 
										onClick={() => setGoal(createNewGoalInput(key as GoalType, ffGoal.ccy))}>
											&nbsp;&nbsp;
											{`${(key !== GoalType.B) ? ' ' : ''}`}
											{getGoalTypes()[key as GoalType]}
										</MenuItem>
									))}
							</Menu>
						}>
							<Button>
								<AimOutlined /> New Life Goal <DownOutlined />
							</Button>
						</Dropdown>
					</Col>
				</Row>
			</div>
			<Tabs type="card" defaultActiveKey={activeTab} onTabClick={(key: string) => setActiveTab(key)}>
						<TabPane key={'1'}
							tab={
										<Fragment>
											<FontAwesomeIcon icon={faChartLine} />
											&nbsp;&nbsp;Milestones
										</Fragment>
							}
						>
							<CalcContextProvider calculateFor={ffGoal}>
								<FIGoalContextProvider>
									<FIPortfolioChart />
								</FIGoalContextProvider>
							</CalcContextProvider>
						</TabPane>
				{allGoals?.length &&
					<TabPane
							key={'2'}
							tab={
								<Fragment>
									<AimOutlined />
									Goals
								</Fragment>
							}
						>
							{allGoals?.length > 2 && (
								<Row justify="center" style={{ marginBottom: '10px' }}>
									<Col className="text-right">
										<SelectInput
											pre=""
											post=""
											options={getImpOptions()}
											value={impFilter as string}
											changeHandler={setImpFilter}
										/>
									</Col>
								</Row>
							)}
							<Row
								align="middle"
								gutter={[{ xs: 0, sm: 15, md: 30, lg: 50 }, { xs: 15, sm: 15, md: 30, lg: 50 }]}
							>
								<Col span={24}>
									<GoalSummary impFilter={impFilter} />
								</Col>
							</Row>
				</TabPane>}
				<TabPane
									key={'3'}
									tab={
										<Fragment>
											<FontAwesomeIcon icon={faChartPie} />
											&nbsp;&nbsp;Allocation
										</Fragment>
									}
								>
				<CalcContextProvider calculateFor={ffGoal}>
					<FIGoalContextProvider>
						<DynamicAAChart />
					</FIGoalContextProvider>
				</CalcContextProvider>
				</TabPane>
				{allGoals?.length && <TabPane
					key={'4'}
					tab={
						<Fragment>
							<FontAwesomeIcon icon={faChartBar} />
											&nbsp;&nbsp;Cash Flows
										</Fragment>
					}
				>
					<YearlyCFChart />
				</TabPane>}
						</Tabs>
		</Fragment>
	) : (
		<PlanStart />
	) : null;
}
