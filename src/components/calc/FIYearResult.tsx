import React, { useContext } from 'react';
import { isFFPossible } from '../goals/cfutils';
import { FIGoalContext } from '../goals/FIGoalContext';
import { PlanContext } from '../goals/PlanContext';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function FIYearResult() {
	const { ffResult }: any = useContext(PlanContext);
	const { startYear }: any = useContext(CalcContext);
	const { retirementAge, leaveBehind }: any = useContext(FIGoalContext);
	
	return isFFPossible(ffResult, leaveBehind) ? (
		<ItemDisplay
			label="Earliest Age"
			result={'' + (ffResult.ffYear - startYear)}
			info={`You May achieve Financial Independence earliest by age of ${ffResult.ffYear - startYear}.`}
			unit="Years"
			imp={
				ffResult.oom ? (
					`You May Not Have Enough Savings in ${ffResult.oom.map((year: number) => ` ${year}`)}`
				) : (
					''
				)
			}
		/>
	) : (
		<ItemDisplay
			label="Earliest Age"
				result={`Difficult by Age of ${retirementAge}`}
			info={`It may be difficult to achieve Financial Independence by ${retirementAge}.`}
		/>
	);
}
