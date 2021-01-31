import { Button, Col, PageHeader, Row } from 'antd';
import React from 'react';
import { CreateGoalInput } from '../../api/goals';
import { isFFPossible } from './cfutils';
import { EditOutlined } from '@ant-design/icons';

interface FISummaryHeaderProps {
	ffGoal: CreateGoalInput;
	ffResult: any;
	setWIPGoal: Function;
	ffYear: number;
}

export default function FISummaryHeader({ ffGoal, ffResult, setWIPGoal, ffYear }: FISummaryHeaderProps) {
	return (
		<Row>
			<Col span={24} className="primary-header">
				<PageHeader
					title={`Financial Independence ${isFFPossible(ffResult, ffGoal.sa as number)
						? `by ${ffYear}`
						: `Not Possible by ${ffGoal.sy + (ffGoal.loan?.rate as number)}. Please try again with different Goals / Inputs.`}`}
					extra={[
						<Button className="steps-start-btn" onClick={() => setWIPGoal(Object.assign({}, ffGoal))}>
							<EditOutlined /> Edit
						</Button>
					]}
				/>
			</Col>
		</Row>
	);
}
