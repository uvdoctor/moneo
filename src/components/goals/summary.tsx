import React from 'react';
import DDLineChart from './DDLineChart';
import { getGoalTypes, getImpLevels } from './goalutils';
import { LMH, GoalType } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { Button, Card, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import OppCost from '../calc/oppcost';
import FFImpact from './ffimpact';
interface SummaryProps {
	id: string;
	name: string;
	type: GoalType;
	imp: LMH;
	startYear: number;
	currency: string;
	cfs: Array<number>;
	ffOOM: Array<number> | null;
	ffGoalEndYear: number;
	ffImpactYears: number | null;
	rr: Array<number>;
	deleteCallback: Function;
	editCallback: Function;
}

export default function Summary(props: SummaryProps) {
	const bgColor = props.imp === LMH.H ? COLORS.BLUE : props.imp === LMH.M ? COLORS.ORANGE : COLORS.GREEN;
	const nowYear = new Date().getFullYear();

	return (
		<Card
			title={
				<Row align="middle" justify="space-between">
					<Col>
						<label>{getGoalTypes()[props.type]}</label>
						<h2>{props.name}</h2>
					</Col>
					<Col>
						<Button type="link" onClick={() => props.editCallback(props.id)} icon={<EditOutlined />}>
							Edit
						</Button>
						<Button type="link" onClick={() => props.deleteCallback(props.id)} icon={<DeleteOutlined />}>
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
					{getImpLevels()[props.imp]}
				</label>
			}
		>
			{props.startYear > nowYear && (
				<Row>
					<Col span={8}>
						<FFImpact ffGoalEndYear={props.ffGoalEndYear} ffOOM={props.ffOOM} ffImpactYears={props.ffImpactYears} />
					</Col>
					<Col span={8}>
						<OppCost
							discountRate={props.rr}
							cfs={props.cfs}
							currency={props.currency}
							startYear={props.startYear}
							buyGoal={props.type === GoalType.B}
							ffGoalEndYear={props.ffGoalEndYear}
						/>
					</Col>
				</Row>
			)}
			<Row>Cash Flows in {props.currency}</Row>
			<Row>
				<DDLineChart cfs={props.cfs} startYear={props.startYear} currency={props.currency} />
			</Row>
		</Card>
	);
}
