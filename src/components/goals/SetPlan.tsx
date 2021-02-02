import React, { useState } from 'react';
import * as APIt from '../../api/goals';
import { GoalContextProvider } from './GoalContext';
import { CalcContextProvider } from '../calc/CalcContext';
import { FIGoalContextProvider } from './FIGoalContext';
import BasicPage from '../BasicPage';
import { PlanContextProvider } from './PlanContext';
import { FeedbackContextProvider } from '../feedback/FeedbackContext';
import SetPlanView from './SetPlanView';

export default function SetPlan() {
	const [ wipGoal, setWIPGoal ] = useState<APIt.CreateGoalInput | null>(null);

	return (
		<PlanContextProvider wipGoal={wipGoal} setWIPGoal={setWIPGoal}>
			<BasicPage
				title="Set Plan"
				className="calculator-container steps-landing"
				onBack={wipGoal ? () => setWIPGoal(null) : null}
				navScrollable
				fixedNav
			>
				{wipGoal ? (
					<FeedbackContextProvider>
						<CalcContextProvider goal={wipGoal}>
							{(wipGoal as APIt.CreateGoalInput).type === APIt.GoalType.FF ? (
								<FIGoalContextProvider />
							) : (
								<GoalContextProvider />
							)}
						</CalcContextProvider>
					</FeedbackContextProvider>
				) : (
					<SetPlanView />
				)}
			</BasicPage>
		</PlanContextProvider>
	);
}
