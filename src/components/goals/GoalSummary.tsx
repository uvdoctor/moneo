import React, { useContext } from 'react';
import { PlanContext } from './PlanContext';
import { Row, Col } from 'antd';
import { UpdateGoalInput } from '../../api/goals';
import Summary from './SummaryView';

interface GoalSummaryProps {
	impFilter: string;
}

export default function GoalSummary({ impFilter }: GoalSummaryProps) {
	const { goalsLoaded, allGoals }: any = useContext(PlanContext);
	return goalsLoaded ? (
		<Row justify="space-around">
			{allGoals.map(
				(g: UpdateGoalInput, i: number) =>
					(!impFilter || impFilter === g.imp) && (
						<Col key={'g' + i} xs={24} sm={24} md={24} lg={10}>
							<Summary goal={g} />
						</Col>
					)
			)}
		</Row>
	) : null;
}
