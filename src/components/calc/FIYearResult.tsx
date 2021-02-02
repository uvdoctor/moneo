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
			label="Earliest Year"
			result={'' + ffResult.ffYear}
			info={`You May achieve Financial Independence earliest in ${ffResult.ffYear}.`}
			unit=""
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
			label="Earliest Year"
				result={`Difficult by ${startYear + retirementAge}`}
			info={`It may be difficult to achieve Financial Independence by ${startYear + retirementAge}. Please try again with different inputs.`}
		/>
	);
}
