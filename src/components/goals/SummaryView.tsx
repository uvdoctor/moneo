import React, { useContext } from 'react';
import BasicLineChart from './BasicLineChart';
import { getGoalTypes, getImpLevels } from './goalutils';
import { GoalType, LMH } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { Button, Card, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DefaultOppCostResult from '../calc/DefaultOppCostResult';
import FIImpact from './FIImpact';
import { PlanContext } from './PlanContext';
import { CalcContext } from '../calc/CalcContext';

export default function SummaryView() {
	const { removeGoal, editGoal }: any = useContext(PlanContext);
	const { goal }: any = useContext(CalcContext);
	const bgColor = goal.imp === LMH.H ? COLORS.BLUE : goal.imp === LMH.M ? COLORS.ORANGE : COLORS.GREEN;
	const nowYear = new Date().getFullYear();
	const goalTypes: any = getGoalTypes();
	const impLevels: any = getImpLevels();

	return (
		<Card
			title={
				<Row justify="space-around">
					<label
						style={{
							color: 'white',
							backgroundColor: bgColor,
							paddingTop: '2px',
							paddingBottom: '2px',
							paddingLeft: '4px',
							paddingRight: '4px'
						}}
					>
						{impLevels[goal.imp as LMH]}
					</label>
					<label>{goalTypes[goal.type as GoalType]}</label>
					<h2>{goal.name}</h2>
				</Row>
			}
			extra={[
				<Button type="link" onClick={() => editGoal(goal.id)} icon={<EditOutlined />}>
					Edit
				</Button>,
				<Button type="link" onClick={() => removeGoal(goal.id)} icon={<DeleteOutlined />}>
					Delete
				</Button>
			]}
		>
			{(goal.sy as number) > nowYear && (
				<Row justify="space-around">
					<Col>
						<FIImpact />
					</Col>
					<Col>
						<DefaultOppCostResult />
					</Col>
				</Row>
			)}
			<div style={{ marginTop: '20px' }}>
				<Row justify="center">Cash Flows in {goal.ccy}</Row>
				<Row justify="center">
					<BasicLineChart />
				</Row>
			</div>
		</Card>
	);
}
