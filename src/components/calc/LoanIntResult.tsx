import React, { useContext } from 'react';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function LoanIntResult() {
	const { currency }: any = useContext(CalcContext);
	const { totalIntAmt }: any = useContext(GoalContext);

	return totalIntAmt ? (
		<ItemDisplay label={`Total Loan Interest`} result={totalIntAmt} currency={currency} />
	) : (
		<ItemDisplay label={`Total Loan Interest`} result="No Loan." />
	);
}
