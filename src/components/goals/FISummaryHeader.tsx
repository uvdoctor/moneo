import { Button, Col, PageHeader, Row } from 'antd';
import React, { useContext } from 'react';
import { isFFPossible } from './cfutils';
import { EditOutlined } from '@ant-design/icons';
import { PlanContext } from './PlanContext';

export default function FISummaryHeader() {
	const { ffGoal, ffResult, setWIPGoal }: any = useContext(PlanContext);
	return (
		ffGoal ? <Row>
			<Col span={24} className="primary-header">
				<PageHeader
					title={`Financial Independence ${isFFPossible(ffResult, ffGoal.sa as number)
						? `by ${ffResult.ffYear}`
						: `Not Possible by ${ffGoal.sy + (ffGoal.loan?.rate as number)}. Please try again with different Goals / Inputs.`}`}
					extra={[
						<Button className="steps-start-btn" onClick={() => setWIPGoal(Object.assign({}, ffGoal))}>
							<EditOutlined /> Edit
						</Button>
					]}
				/>
			</Col>
		</Row> : null
	);
}
