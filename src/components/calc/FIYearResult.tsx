import React, { useContext } from 'react';
import { FIGoalContext } from '../goals/FIGoalContext';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function FIYearResult() {
	const { startYear }: any = useContext(CalcContext);
	const { retirementAge, wipResult }: any = useContext(FIGoalContext);
	
	return wipResult.ffYear ? (
		<ItemDisplay
			label="Earliest Age"
			result={'' + (wipResult.ffYear - startYear)}
			info={`You May achieve Financial Independence earliest by age of ${wipResult.ffYear - startYear}.`}
			unit="Years"
			imp={
				wipResult.oom ? (
					`You May Not Have Enough Savings in ${wipResult.oom.map((year: number) => ` ${year}`)}`
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
