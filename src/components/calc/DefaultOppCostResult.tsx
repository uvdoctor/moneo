import React, { useState, useEffect, useContext } from 'react';
import { getCompoundedIncome } from './finance';
import { initOptions } from '../utils';
import { getMinRetirementDuration } from '../goals/goalutils';
import { CalcContext } from './CalcContext';
import OppCostResult from './OppCostResult';
import { GoalContext } from '../goals/GoalContext';

export default function DefaultOppCostResult() {
	const { cfs, dr, rr, startYear, startMonth }: any = useContext(CalcContext);
	const { sellAfter, sellPrice }: any = useContext(GoalContext);
	const [ oppCost, setOppCost ] = useState<number>(0);
	const isDRNumber = dr !== null;
	const [ numOfYears, setNumOfYears ] = useState<number>(cfs.length);
	const [ numOfYearsOptions, setNumOfYearsOptions ] = useState<any>(
		initOptions(startMonth > 1 ? cfs.length - 1 : cfs.length, 20)
	);

	const calculateOppCost = (yearsNum: number) => {
		if (!cfs || !cfs.length) {
			setOppCost(0);
			return;
		}
		let yearsForCalculation = sellAfter ? sellAfter : yearsNum < cfs.length ? cfs.length : yearsNum;
		if (yearsForCalculation !== numOfYears) setNumOfYears(yearsForCalculation);
		const discountRate = dr ? dr : rr;
		let oppCost = 0;
		let startIndex = 0;
		if (startYear) startIndex = startYear - (new Date().getFullYear() + 1);
		cfs.forEach((cf: number, index: number) => {
			if (sellAfter) {
				if (index === sellAfter) return;
				else if (index === sellAfter - 1) cf -= sellPrice;
			} 
			oppCost += cf;
			if (index < cfs.length - 1 && oppCost < 0) oppCost *= 1 + (isDRNumber ? discountRate : discountRate[startIndex + index]) / 100;
			if(sellAfter && index === sellAfter - 1) oppCost += sellPrice;
		});
		if (!sellAfter) {
			if (!isDRNumber) {
				let year = (startYear as number) + cfs.length - 1;
				for (
					let i = startIndex + cfs.length - 1;
					i < discountRate.length - (getMinRetirementDuration() + 1);
					i++, year++
				)
					if (oppCost < 0) oppCost *= 1 + discountRate[i] / 100;
			} else if (cfs.length - 1 < yearsForCalculation && oppCost < 0)
				oppCost = getCompoundedIncome(discountRate, oppCost, yearsForCalculation - (cfs.length - 1));
		}
		setOppCost(oppCost);
	};

	useEffect(
		() => {
			calculateOppCost(sellAfter ? sellAfter : cfs.length);
			setNumOfYearsOptions(initOptions(startMonth > 1 ? cfs.length - 1 : cfs.length, cfs.length + 20, 1));
		},
		[ cfs ]
	);

	useEffect(() => calculateOppCost(numOfYears), [ dr, rr ]);

	return (
		<OppCostResult
			oppCost={oppCost}
			numOfYears={numOfYears}
			numOfYearsOptions={numOfYearsOptions}
			oppCostHandler={calculateOppCost}
		/>
	);
}
