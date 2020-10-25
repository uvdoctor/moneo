import React, { useState, useEffect, useContext } from 'react';
import { getCompoundedIncome } from './finance';
import ItemDisplay from './ItemDisplay';
import { toCurrency } from '../utils';
import { getMinRetirementDuration } from '../goals/goalutils';
import { PLAN_DURATION } from '../../CONSTANTS';
import { GoalType } from '../../api/goals';
interface OppCostProps {
	contextType: any;
	minDuration?: number;
}

export default function OppCost({ contextType, minDuration }: OppCostProps) {
	const {
		cfs,
		currency,
		dr,
		rr,
		startYear,
		ffGoalEndYear,
		goal
	}: any = useContext(contextType);
	const [ oppCost, setOppCost ] = useState<number>(0);
	const [lastYear, setLastYear] = useState<number>(0);
	const isDRNumber = dr !== null;
	const minYears = minDuration ? minDuration : cfs.length < 20 ? 20 : 30;

	const calculateOppCost = () => {
		const discountRate = dr !== null ? dr : rr;
		if (!cfs || cfs.length === 0) {
			setOppCost(0);
			return;
		}
		let oppCost = 0;
		let startIndex = 0;
		if (startYear) startIndex = startYear - (new Date().getFullYear() + 1);
		cfs.forEach((cf: number, index: number) => {
			oppCost += cf;
			if (index < cfs.length - 1 && oppCost < 0) {
				oppCost *=
					1 +
					(isDRNumber
						? discountRate
						: discountRate[startIndex + index]) /
						100;
			}
		});
		if (goal.type !== GoalType.B) {
			if (!isDRNumber) {
				let year = (startYear as number) + cfs.length - 1;
				for (
					let i = startIndex + cfs.length - 1;
					i < discountRate.length - (getMinRetirementDuration() + 1);
					i++, year++
				)
					if (oppCost < 0) oppCost *= 1 + discountRate[i] / 100;
				setLastYear(year);
			} else if (cfs.length - 1 < minYears && oppCost < 0)
				oppCost = getCompoundedIncome(discountRate, oppCost, minYears - (cfs.length - 1));
		}
		setOppCost(oppCost);
	};

	useEffect(() => calculateOppCost(), [ cfs, dr, rr ]);

	return (
			<ItemDisplay
				result={oppCost}
				currency={currency}
				label={`${goal.type === GoalType.B ? 'Buy' : 'Spend'} v/s Invest`}
				pl
				info={`You May Have ${toCurrency(Math.abs(oppCost), currency)} More ${goal.type === GoalType.B
					? `in ${cfs.length - 1} Years`
					: isDRNumber
						? `in ${cfs.length - 1 > minYears ? cfs.length : minDuration} Years`
						: `when You turn ${lastYear - ((ffGoalEndYear as number) - PLAN_DURATION)}`} if You 
        ${oppCost < 0 ? 'Invest' : 'Buy'} instead of ${oppCost < 0
					? goal.type === GoalType.B ? 'Buying' : 'Spending'
					: 'Investing'}.`}
			/>
	);
}
