import React, { Fragment, useContext, useEffect, useState } from 'react';
import { getGoalTypes, getImpLevels } from './goalutils';
import { CreateGoalInput, GoalType, LMH } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { Card, Row, Col, Badge, Button, Modal, Tooltip, Avatar } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PlanContext } from './PlanContext';
import { ExclamationCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';
import './SummaryView.less';
import DefaultOppCostResult from '../calc/DefaultOppCostResult';
import FIImpact from './FIImpact';
import BasicLineChart from './BasicLineChart';
import { CalcContext } from '../calc/CalcContext';
import { GoalContext } from './GoalContext';
import { getDaysDiff, toHumanFriendlyCurrency } from '../utils';

export default function SummaryView() {
	const { removeGoal, editGoal, allGoals }: any = useContext(PlanContext);
	const { goal, currency, cfs }: any = useContext(CalcContext);
	const { impLevel, name }: any = useContext(GoalContext);
	const [ goalImp, setGoalImp ] = useState<LMH>(impLevel);
	const [ goalName, setGoalName ] = useState<string>(name);
	const [ goalCurrency, setGoalCurrency ] = useState<string>(currency);
	const getImpColor = (imp: LMH) => (imp === LMH.H ? COLORS.BLUE : imp === LMH.M ? COLORS.ORANGE : COLORS.GREEN);
	const [ impColor, setImpColor ] = useState<string>(getImpColor(impLevel as LMH));
	const goalTypes: any = getGoalTypes();
	const impLevels: any = getImpLevels();
	const { confirm } = Modal;
	const [ lastUpdated, setLastUpdated ] = useState<string>(getDaysDiff(goal.updatedAt));
	const [ totalCost, setTotalCost ] = useState<string>('')
	useEffect(
		() => {
			let g: CreateGoalInput = allGoals.filter((g: CreateGoalInput) => g.id === goal.id)[0];
			setGoalImp(g.imp);
			setImpColor(getImpColor(g.imp as LMH));
			setGoalName(g.name);
			setGoalCurrency(g.ccy);
			//@ts-ignore
			setLastUpdated(getDaysDiff(g.updatedAt));
		},
		[ allGoals ]
	);

	useEffect(
		() => {
			cfs.length && setTotalCost(
				toHumanFriendlyCurrency(
					Math.abs(
						cfs.reduce(
							(val:number, total:number) => total + val
						)
					), goalCurrency
				)
			);
		},
		[ cfs ]
	);

	return (
		<Card
			className="goals-card"
			size="small"
			title={
				<Fragment>
					<Row justify="space-between">
						<Col>
							<Row>
								<Col>
									<Badge
										count={impLevels[goalImp]}
										style={{ backgroundColor: impColor, color: COLORS.WHITE }}
									/>
								</Col>
							</Row>
							<Row>
								<Col>{goalTypes[goal.type as GoalType]}</Col>
							</Row>
						</Col>
						<Col>
							<Row align="middle">
								<Col>
									<Avatar size={50} src={null} icon={<UserOutlined />} />
								</Col>
								<Col>
									<hgroup>
										<h3>{goalName}</h3>
										<h4>{totalCost}</h4>
									</hgroup>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col>
									<Tooltip title={`You Updated this Goal ${lastUpdated}`}>
										<FieldTimeOutlined />
										{lastUpdated}
									</Tooltip>
								</Col>
							</Row>
							<Row>
								<Col>
									<Tooltip title="Edit">
										<Button type="link" icon={<EditOutlined />} onClick={() => editGoal(goal.id)} />
									</Tooltip>
									<Tooltip title="Delete">
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
									</Tooltip>
								</Col>
							</Row>
						</Col>
					</Row>
				</Fragment>
			}
		>
			<Card.Grid style={{ width: '50%' }}>
				<FIImpact />
			</Card.Grid>
			<Card.Grid style={{ width: '50%' }}>
				<DefaultOppCostResult />
			</Card.Grid>
			<Card.Grid style={{ width: '100%'}}>
				<BasicLineChart summaryView />
			</Card.Grid>
		</Card>
	);
}
