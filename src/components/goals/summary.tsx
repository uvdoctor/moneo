import React, { useContext } from 'react';
import DDLineChart from './BasicLineChart';
import { getGoalTypes, getImpLevels } from './goalutils';
import { LMH } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { Button, Card, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DefaultOppCostResult from '../calc/DefaultOppCostResult';
import FFImpact from './ffimpact';
import { GoalContext } from './GoalContext';
interface SummaryProps {
	deleteCallback: Function;
	editCallback: Function;
	ffImpactYears: number | null;
}

export default function Summary({ deleteCallback, editCallback, ffImpactYears }: SummaryProps) {
	const {
		goal,
		startYear,
		currency,
	}: any = useContext(GoalContext);
	const bgColor = goal.imp === LMH.H ? COLORS.BLUE : goal.imp === LMH.M ? COLORS.ORANGE : COLORS.GREEN;
	const nowYear = new Date().getFullYear();
	const goalTypes: any = getGoalTypes();
	const impLevels: any = getImpLevels();

	return (
		<Card
			title={
				<Row align="middle" justify="space-between">
					<Col>
						<label>{goalTypes[goal.type]}</label>
						<h2>{goal.name}</h2>
					</Col>
					<Col>
						<Button type="link" onClick={() => editCallback(goal.id)} icon={<EditOutlined />}>
							Edit
						</Button>
						<Button type="link" onClick={() => deleteCallback(goal.id)} icon={<DeleteOutlined />}>
							Delete
						</Button>
					</Col>
				</Row>
			}
			extra={
				<label
					style={{
						color: 'white',
						backgroundColor: bgColor,
						paddingTop: '1px',
						paddingBottom: '1px',
						paddingLeft: '2px',
						paddingRight: '2px'
					}}
				>
					{impLevels[goal.imp]}
				</label>
			}
		>
			{startYear > nowYear && (
				<Row>
					<Col span={8}>
						<FFImpact impactYears={ffImpactYears} />
					</Col>
					<Col span={8}>
						<DefaultOppCostResult />
					</Col>
				</Row>
			)}
			<Row>Cash Flows in {currency}</Row>
			<Row>
				<DDLineChart />
			</Row>
		</Card>
	);
}
