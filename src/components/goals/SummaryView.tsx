import React, { Fragment, useContext } from 'react';
import { getGoalTypes, getImpLevels } from './goalutils';
import { GoalType, LMH } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { Card, Row, Col, Badge, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PlanContext } from './PlanContext';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import './SummaryView.less';
import DefaultOppCostResult from '../calc/DefaultOppCostResult';
import FIImpact from './FIImpact';
import BasicLineChart from './BasicLineChart';
import { CalcContext } from '../calc/CalcContext';
import { GoalContext } from './GoalContext';

export default function SummaryView() {
	const { removeGoal, editGoal }: any = useContext(PlanContext);
	const { goal, currency }: any = useContext(CalcContext);
	const { impLevel, name }: any = useContext(GoalContext);
	const bgColor = goal.imp === LMH.H ? COLORS.BLUE : goal.imp === LMH.M ? COLORS.ORANGE : COLORS.GREEN;
	const goalTypes: any = getGoalTypes();
	const impLevels: any = getImpLevels();
	const { confirm } = Modal;

	return (
		<Card
			className="goals-card"
			size="small"
			title={
				<Fragment>
					<Row justify="space-between">
						<Col>
							<Badge
								count={impLevels[impLevel as LMH]}
								style={{ backgroundColor: bgColor, color: COLORS.WHITE }}
							/>
							<strong>&nbsp;{goalTypes[goal.type as GoalType]}</strong>
						</Col>
						<Col>
							<strong>{currency}</strong>
						</Col>
						<Col>
							<Button type="link" icon={<EditOutlined />} onClick={() => editGoal(goal.id)} />&nbsp;
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
					<Row justify="center">
						<Col>{name}</Col>
					</Row>
				</Fragment>
			}
			cover={
				<div style={{cursor: 'pointer'}} onClick={() => editGoal(goal.id)}>
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
