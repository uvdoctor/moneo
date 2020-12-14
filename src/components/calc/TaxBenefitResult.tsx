import React, { useContext } from 'react';
import { GoalContext } from '../goals/GoalContext';
import { toHumanFriendlyCurrency } from '../utils';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function TaxBenefitResult() {
	const { currency }: any = useContext(CalcContext);
	const { duration, taxRate, totalITaxBenefit, totalPTaxBenefit }: any = useContext(GoalContext);

	return taxRate ? (
    <ItemDisplay label="Total Tax Benefit" result={totalITaxBenefit + totalPTaxBenefit} currency={currency} pl
      info={`Given that You pay ${taxRate}% Income Tax, You may get total tax benefit of about ${toHumanFriendlyCurrency(totalITaxBenefit + totalPTaxBenefit, currency)} across ${duration} Years.`} />
	) : (
		<ItemDisplay label="Total Tax Benefit" result="Input Tax Details" />
	);
}
