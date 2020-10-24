import React, { useState, useEffect } from 'react';
import { getCompoundedIncome } from './finance';
import ItemDisplay from './ItemDisplay';
import { toCurrency } from '../utils';
import { getMinRetirementDuration } from '../goals/goalutils';
import { PLAN_DURATION } from '../../CONSTANTS';
interface OppCostProps {
	cfs: Array<number>;
	currency: string;
	discountRate: number | Array<number>;
	startYear?: number;
	ffGoalEndYear?: number;
	buyGoal?: boolean;
	minDuration?: number;
}

export default function OppCost(props: OppCostProps) {
	const [ oppCost, setOppCost ] = useState<number>(0);
	const [ lastYear, setLastYear ] = useState<number>(0);
	const minDuration = props.minDuration ? props.minDuration : 20;

	const calculateOppCost = () => {
		if (!props.cfs || props.cfs.length === 0) {
			setOppCost(0);
			return;
		}
		let oppCost = 0;
		let startIndex = 0;
		if (props.startYear) startIndex = props.startYear - (new Date().getFullYear() + 1);
		props.cfs.forEach((cf, index) => {
			oppCost += cf;
			if (index < props.cfs.length - 1 && oppCost < 0) {
				oppCost *=
					1 +
					(typeof props.discountRate === 'number'
						? props.discountRate
						: props.discountRate[startIndex + index]) /
						100;
			}
		});
		if (!props.buyGoal) {
			if (typeof props.discountRate !== 'number') {
				let year = (props.startYear as number) + props.cfs.length - 1;
				for (
					let i = startIndex + props.cfs.length - 1;
					i < props.discountRate.length - (getMinRetirementDuration() + 1);
					i++, year++
				)
					if (oppCost < 0) oppCost *= 1 + props.discountRate[i] / 100;
				setLastYear(year);
			} else if (props.cfs.length - 1 < minDuration && oppCost < 0)
				oppCost = getCompoundedIncome(props.discountRate, oppCost, minDuration - (props.cfs.length - 1));
		}
		setOppCost(oppCost);
	};

	useEffect(() => calculateOppCost(), [ props.cfs, props.discountRate ]);

	return (
			<ItemDisplay
				result={oppCost}
				currency={props.currency}
				label={`${props.buyGoal ? 'Buy' : 'Spend'} v/s Invest`}
				pl
				info={`You May Have ${toCurrency(Math.abs(oppCost), props.currency)} More ${props.buyGoal
					? `in ${props.cfs.length - 1} Years`
					: typeof props.discountRate === 'number'
						? `in ${props.cfs.length - 1 > minDuration ? props.cfs.length : minDuration} Years`
						: `when You turn ${lastYear - ((props.ffGoalEndYear as number) - PLAN_DURATION)}`} if You 
        ${oppCost < 0 ? 'Invest' : 'Buy'} instead of ${oppCost < 0
					? props.buyGoal ? 'Buying' : 'Spending'
					: 'Investing'}.`}
			/>
	);
}
