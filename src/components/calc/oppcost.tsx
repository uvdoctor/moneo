import React, { useState, useEffect, useContext } from 'react';
import { getCompoundedIncome } from './finance';
import ItemDisplay from './ItemDisplay';
import { toCurrency } from '../utils';
import { getMinRetirementDuration } from '../goals/goalutils';
import { GoalType } from '../../api/goals';
import { CalcContext } from './CalcContext';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface OppCostProps {
	calculateFor?: number;
}

export default function OppCost({ calculateFor }: OppCostProps) {
	const { cfs, currency, dr, rr, startYear, goal }: any = useContext(CalcContext);
	const [ oppCost, setOppCost ] = useState<number>(0);
	const isDRNumber = dr !== null;
	const numOfYears =
		goal.type === GoalType.B ? cfs.length : calculateFor ? calculateFor : cfs.length < 20 ? 20 : cfs.length;

	const calculateOppCost = () => {
		const discountRate = dr ? dr : rr;
		if (!cfs || !cfs.length) {
			setOppCost(0);
			return;
		}
		let oppCost = 0;
		let startIndex = 0;
		if (startYear) startIndex = startYear - (new Date().getFullYear() + 1);
		cfs.forEach((cf: number, index: number) => {
			oppCost += cf;
			if (index < cfs.length - 1 && oppCost < 0) {
				oppCost *= 1 + (isDRNumber ? discountRate : discountRate[startIndex + index]) / 100;
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
			} else if (cfs.length - 1 < numOfYears && oppCost < 0)
				oppCost = getCompoundedIncome(discountRate, oppCost, numOfYears - (cfs.length - 1));
		}
		setOppCost(oppCost);
	};

	useEffect(() => calculateOppCost(), [ cfs, dr, rr ]);

	return (
		<ItemDisplay
			result={oppCost}
			currency={currency}
			label={`${goal.type === GoalType.B ? 'Buy' : 'Spend'} v/s Invest${dr ? ` @ ${dr}%` : ''}`}
			svg={oppCost < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
			pl
			info={`You May Have ${toCurrency(Math.abs(oppCost), currency)} More in ${numOfYears} Years
      if You ${oppCost < 0 ? 'Invest' : 'Buy'} instead of ${oppCost < 0
				? goal.type === GoalType.B ? 'Buying' : 'Spending'
				: 'Investing'}.`}
		/>
	);
}
