import React, { useContext } from 'react';
import { isFFPossible } from '../goals/cfutils';
import { FIGoalContext } from '../goals/FIGoalContext';
import { PlanContext } from '../goals/PlanContext';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function FIResult() {
	const { ffResult }: any = useContext(PlanContext);
	const { startYear, currency }: any = useContext(CalcContext);
	const { retirementAge, leaveBehind }: any = useContext(FIGoalContext);

	return isFFPossible(ffResult, leaveBehind) ? (
		<ItemDisplay
			result={ffResult.ffAmt}
			label={`By end of ${ffResult.ffYear - 1}, You may have`}
			currency={currency}
			info="You can Withdraw from this Savings for Your expenses after gaining Financial Independence."
		/>
	) : (
		<ItemDisplay
			result="Unable to Determine"
			label="Amount Needed for FI"
			info={`Unable to Determine the amount needed as Financial Independence (FI) is difficult to achieve by ${startYear +
				retirementAge} based on current inputs. Please try again with different inputs.`}
		/>
	);
}
