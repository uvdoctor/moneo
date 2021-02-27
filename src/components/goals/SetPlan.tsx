import React, { useContext, useState } from 'react';
import * as APIt from '../../api/goals';
import { GoalContextProvider } from './GoalContext';
import { CalcContextProvider } from '../calc/CalcContext';
import { FIGoalContextProvider } from './FIGoalContext';
import BasicPage from '../BasicPage';
import { FeedbackContextProvider } from '../feedback/FeedbackContext';
import PlanView from './PlanView';
import { PlanContext } from './PlanContext';
import CalcTemplate from '../calc/CalcTemplate';

export default function SetPlan() {
	const { goal }: any = useContext(PlanContext);
	const [activeTab, setActiveTab] = useState<string>('1');

	return goal ? (
		<FeedbackContextProvider>
			<CalcContextProvider>
				{(goal as APIt.CreateGoalInput).type === APIt.GoalType.FF ? (
					<FIGoalContextProvider>
						<BasicPage
							title={goal.id ? 'Edit FI Target' : 'Set FI Target'}
							className="calculator-container steps-landing"
							navScrollable
							fixedNav
						>
							<CalcTemplate />
						</BasicPage>
					</FIGoalContextProvider>
				) : (
					<GoalContextProvider>
						<BasicPage
							title={goal.id ? 'Edit Goal' : 'New Life Goal'}
							className="calculator-container steps-landing"
							navScrollable
							fixedNav
						>
							<CalcTemplate />
						</BasicPage>
					</GoalContextProvider>
				)}
			</CalcContextProvider>
		</FeedbackContextProvider>
	) : (
		<BasicPage title="My Financial Plan" navScrollable fixedNav>
				<PlanView activeTab={activeTab} setActiveTab={setActiveTab} />
		</BasicPage>
	);
}
