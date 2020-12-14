import React, { useState, useEffect, useContext } from 'react';
import { getCompoundedIncome } from './finance';
import { initOptions } from '../utils';
import { getMinRetirementDuration } from '../goals/goalutils';
import { GoalType } from '../../api/goals';
import { CalcContext } from './CalcContext';
import OppCostResult from './OppCostResult';

export default function DefaultOppCostResult() {
	const { cfs, dr, rr, startYear, startMonth, goal }: any = useContext(CalcContext);
	const [ oppCost, setOppCost ] = useState<number>(0);
	const isDRNumber = dr !== null;
	const [ numOfYears, setNumOfYears ] = useState<number>(cfs.length);
	const [ numOfYearsOptions, setNumOfYearsOptions ] = useState<any>(
		initOptions(startMonth > 1 ? cfs.length - 1 : cfs.length, 20)
	);

	const calculateOppCost = (yearsNum: number) => {
		let yearsForCalculation = yearsNum;
		if (yearsForCalculation === cfs.length - 1 && startMonth > 1) yearsForCalculation++;
		else if (yearsForCalculation < cfs.length) {
			yearsForCalculation = cfs.length;
			setNumOfYears(yearsForCalculation);
		} else if (yearsForCalculation !== numOfYears) setNumOfYears(yearsForCalculation);
		const discountRate = dr ? dr : rr;
		if (!cfs || !cfs.length) {
			setOppCost(0);
			return;
		}
		let oppCost = 0;
		let startIndex = 0;
		if (startYear) startIndex = startYear - (new Date().getFullYear() + 1);
		cfs.forEach((cf: number, index: number) => {
			let yearFactor = 1;
			if (startMonth > 1 && goal.type !== GoalType.FF) {
				if (index === 0) yearFactor = (12 - (startMonth - 1)) / 12;
				else if (index === cfs.length - 1) yearFactor = (startMonth - 1) / 12;
			}
			oppCost += cf;
			if (index < cfs.length - 1 && oppCost < 0) {
				oppCost *= 1 + (isDRNumber ? discountRate : discountRate[startIndex + index]) * yearFactor / 100;
			}
		});
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
		setOppCost(oppCost);
	};

	useEffect(
		() => {
			calculateOppCost(cfs.length);
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
