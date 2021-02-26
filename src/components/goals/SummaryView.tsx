import React, { Fragment, useContext, useEffect, useState } from 'react';
import { getGoalTypes, getImpLevels } from './goalutils';
import { CreateGoalInput, GoalType, LMH } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { Card, Row, Col, Badge, Button, Modal, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PlanContext } from './PlanContext';
import { ExclamationCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';
import './SummaryView.less';
import DefaultOppCostResult from '../calc/DefaultOppCostResult';
import FIImpact from './FIImpact';
import BasicLineChart from './BasicLineChart';
import { CalcContext } from '../calc/CalcContext';
import { GoalContext } from './GoalContext';
import { getDaysDiff } from '../utils';

export default function SummaryView() {
	const { removeGoal, editGoal, allGoals }: any = useContext(PlanContext);
	const { goal, currency }: any = useContext(CalcContext);
	const { impLevel, name }: any = useContext(GoalContext);
	const [goalImp, setGoalImp] = useState<LMH>(impLevel);
	const [goalName, setGoalName] = useState<string>(name);
	const [goalCurrency, setGoalCurrency] = useState<string>(currency);
	const getImpColor = (imp: LMH) => imp === LMH.H ? COLORS.BLUE : imp === LMH.M ? COLORS.ORANGE : COLORS.GREEN;
	const [ impColor, setImpColor ] = useState<string>(getImpColor(goal.imp as LMH));
	const goalTypes: any = getGoalTypes();
	const impLevels: any = getImpLevels();
	const { confirm } = Modal;
	const [ lastUpdated, setLastUpdated ] = useState<string>(getDaysDiff(goal.updatedAt));
	
	useEffect(() => {
		let g: CreateGoalInput = allGoals.filter((g: CreateGoalInput) => g.id === goal.id)[0];
		setGoalImp(g.imp);
		setImpColor(getImpColor(g.imp as LMH));
		setGoalName(g.name);
		setGoalCurrency(g.ccy);
		//@ts-ignore
		setLastUpdated(getDaysDiff(g.updatedAt));
	}, [allGoals]);
	
	return (
		<Card
			className="goals-card"
			size="small"
			title={
				<Fragment>
					<Row justify="space-between">
						<Col>
							<Badge
								count={impLevels[goalImp]}
								style={{ backgroundColor: impColor, color: COLORS.WHITE }}
							/>
						</Col>
						<Col>
							<strong>{goalTypes[goal.type as GoalType]}</strong>
						</Col>
						<Col>
							<Button type="link" icon={<EditOutlined />} onClick={() => editGoal(goal.id)} />
							<Button
								type="link"
								icon={<DeleteOutlined />}
								danger
								onClick={() => {
									confirm({
										icon: <ExclamationCircleOutlined />,
										content: 'Are You Sure about Deleting this Goal?',
										onOk() {
											removeGoal(goal.id);
										}
									});
								}}
							/>
						</Col>
					</Row>
					<Row justify="space-between">
						<Col>
							{goalCurrency}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						</Col>
						<Col>
							<strong>{goalName}</strong>
						</Col>
						<Col>
							<Tooltip title={`You Updated this Goal ${lastUpdated}`}>
								<FieldTimeOutlined />
								{lastUpdated}
							</Tooltip>
						</Col>
					</Row>
				</Fragment>
			}
			cover={
				<div style={{ cursor: 'pointer' }} onClick={() => editGoal(goal.id)}>
					<BasicLineChart summaryView />
				</div>
			}
			actions={[
				<div key="fii" onClick={() => editGoal(goal.id)}>
					<FIImpact />
				</div>,
				<div key="oppcost" onClick={() => editGoal(goal.id)}>
					<DefaultOppCostResult />
				</div>
			]}
		/>
	);
}
