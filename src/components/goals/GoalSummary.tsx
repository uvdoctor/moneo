import React, { useContext } from 'react';
import { PlanContext } from './PlanContext';
import { Row, Col } from 'antd';
import { CreateGoalInput, UpdateGoalInput } from '../../api/goals';
import Summary from './SummaryView';
import { CalcContextProvider } from '../calc/CalcContext';
import { GoalContextProvider } from './GoalContext';

interface GoalSummaryProps {
	impFilter: string;
}

export default function GoalSummary({ impFilter }: GoalSummaryProps) {
	const { goalsLoaded, allGoals }: any = useContext(PlanContext);
	return goalsLoaded ? (
		<Row justify="space-around" gutter={[ { xs: 0, sm: 15, md: 30, lg: 50 }, { xs: 15, sm: 15, md: 30, lg: 50 } ]}>
			{allGoals.map(
				(g: UpdateGoalInput, i: number) =>
					(!impFilter || impFilter === g.imp) && (
						<Col key={'g' + i} xs={24} sm={24} md={24} lg={10}>
							<CalcContextProvider calculateFor={g as CreateGoalInput}>
								<GoalContextProvider>
									<Summary />
								</GoalContextProvider>
							</CalcContextProvider>
						</Col>
					)
			)}
		</Row>
	) : null;
}
