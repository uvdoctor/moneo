import React, { useContext } from 'react';
import { PlanContext } from './PlanContext';
import { Row, Col } from 'antd';
import { UpdateGoalInput } from '../../api/goals';
import Summary from './SummaryView';
import { CalcContextProvider } from '../calc/CalcContext';
import { GoalContextProvider } from './GoalContext';

interface GoalSummaryProps {
	impFilter: string;
}

export default function GoalSummary({ impFilter }: GoalSummaryProps) {
	const { allGoals }: any = useContext(PlanContext);
	return (
		<Row justify="space-around">
			{allGoals.map(
				(g: UpdateGoalInput, i: number) =>
					(!impFilter || impFilter === g.imp) && (
						<Col xs={24} sm={24} md={24} lg={10}>
							<CalcContextProvider key={'g' + i} goal={g}>
								<GoalContextProvider>
									<Summary />
								</GoalContextProvider>
							</CalcContextProvider>
						</Col>
					)
			)}
		</Row>
	);
}
