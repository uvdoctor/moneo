import React, { useContext, useState } from 'react';
import * as APIt from '../../api/goals';
import { GoalContextProvider } from './GoalContext';
import { CalcContextProvider } from '../calc/CalcContext';
import { FIGoalContextProvider } from './FIGoalContext';
import { FeedbackContextProvider } from '../feedback/FeedbackContext';
import PlanView from './PlanView';
import { PlanContext } from './PlanContext';
import CalcTemplate from '../calc/CalcTemplate';

export default function SetPlan() {
	const { goal }: any = useContext(PlanContext);
	const [ activeTab, setActiveTab ] = useState<string>('1');

	return goal ? (
		<FeedbackContextProvider>
			<CalcContextProvider>
				{(goal as APIt.CreateGoalInput).type === APIt.GoalType.FF ? (
					<FIGoalContextProvider>
						<CalcTemplate />
					</FIGoalContextProvider>
				) : (
					<GoalContextProvider>
						<CalcTemplate />
					</GoalContextProvider>
				)}
			</CalcContextProvider>
		</FeedbackContextProvider>
	) : (
		<PlanView activeTab={activeTab} setActiveTab={setActiveTab} />
	);
}
