import React from 'react';
import DDLineChart from './DDLineChart';
import { getGoalTypes, getImpLevels } from './goalutils';
import GoalResult from './goalresult';
import { LMH, GoalType } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { Button, Card, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
				<Space align="center" size="large">
					<Space align="center">
						<label>{getGoalTypes()[props.type]}</label>
						<h2>{props.name}</h2>
					</Space>
					<Button type="link" onClick={() => props.editCallback(props.id)} icon={<EditOutlined />}>
						Edit
					</Button>
					<Button type="link" onClick={() => props.deleteCallback(props.id)} icon={<DeleteOutlined />}>
						Delete
					</Button>
				</Space>
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
			<Space align="center" direction="vertical" size="large">
				{props.startYear > nowYear && (
					<GoalResult
						rr={props.rr}
						currency={props.currency}
						ffGoalEndYear={props.ffGoalEndYear}
						cfs={props.cfs}
						startYear={props.startYear}
						ffImpactYears={props.ffImpactYears}
						ffOOM={props.ffOOM}
						buyGoal={props.type === GoalType.B}
					/>
				)}
				<p>Cash Flows in {props.currency}</p>
				<DDLineChart cfs={props.cfs} startYear={props.startYear} currency={props.currency} />
			</Space>
		</Card>
	);
}
