import React, { useContext } from 'react';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function LoanIntResult() {
	const { currency }: any = useContext(CalcContext);
	const { totalIntAmt, totalInsAmt }: any = useContext(GoalContext);

	return totalIntAmt ? (
		<ItemDisplay label={`Total Loan Cost`} result={totalIntAmt + totalInsAmt} currency={currency}
		info="Includes loan interest and any insurance paid to protect repayment." />
	) : (
		<ItemDisplay label={`Total Loan Cost`} result="No Loan." />
	);
}
