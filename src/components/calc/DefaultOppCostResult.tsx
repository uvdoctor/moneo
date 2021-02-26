import React, { useState, useEffect, useContext } from 'react';
import { getCompoundedIncome } from './finance';
import { initOptions } from '../utils';
import { CalcContext } from './CalcContext';
import OppCostResult from './OppCostResult';
import { GoalContext } from '../goals/GoalContext';
import { PlanContext } from '../goals/PlanContext';

export default function DefaultOppCostResult() {
	const { rr, dr, isPublicCalc }: any = useContext(PlanContext);
	const { cfs, startYear, startMonth, oppCost, setOppCost }: any = useContext(CalcContext);
	const { sellAfter, sellPrice }: any = useContext(GoalContext);
	const [ numOfYears, setNumOfYears ] = useState<number>(cfs.length);
	const [ numOfYearsOptions, setNumOfYearsOptions ] = useState<any>(initOptions(cfs.length, 20));

	const calculateOppCost = (yearsNum: number) => {
		if (!cfs || !cfs.length) {
			setOppCost(0);
			return;
		}
		let yearsForCalculation = sellAfter ? sellAfter : yearsNum < cfs.length ? cfs.length : yearsNum;
		if (yearsForCalculation !== numOfYears) setNumOfYears(yearsForCalculation);
		let oppCost = 0;
		let startIndex = 0;
		if (startYear) startIndex = startYear - (new Date().getFullYear() + 1);
		cfs.forEach((cf: number, index: number) => {
			if (sellAfter) {
				if (index > sellAfter) return;
				if (index === (startMonth > 1 ? sellAfter : sellAfter - 1)) cf -= sellPrice;
			}
			oppCost += cf;
			if (oppCost < 0) {
				let yearlyFactor = 1;
				if (index === 0 && startMonth > 1) yearlyFactor = (12 - (startMonth - 1)) / 12;
				if (index === cfs.length - 1 && startMonth > 1) yearlyFactor = (startMonth - 1) / 12;
				oppCost *= 1 + (isPublicCalc ? dr : rr[startIndex + index]) * yearlyFactor / 100;
			}
			if (sellAfter && index === (startMonth > 1 ? sellAfter : sellAfter - 1)) oppCost += sellPrice;
		});
		if (!sellAfter) {
			if (!isPublicCalc) {
				let year = (startYear as number) + cfs.length;
				for (
					let i = startIndex + cfs.length;
					i < rr.length - (yearsForCalculation + 1);
					i++, year++
				)
					if (oppCost < 0) oppCost *= 1 + rr[i] / 100;
			} else if (cfs.length < yearsForCalculation && oppCost < 0)
				oppCost = getCompoundedIncome(dr, oppCost, yearsForCalculation - cfs.length);
		}
		setOppCost(oppCost);
	};

	useEffect(
		() => {
			calculateOppCost(numOfYears);
			if(isPublicCalc) setNumOfYearsOptions(initOptions(cfs.length, 20));
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
