import React, { useContext, useEffect, useState } from 'react';
import { initOptions } from '../utils';
import { CalcContext } from './CalcContext';
import { TrueCostContext } from './TrueCostContext';
import { SPEND_ONCE } from './Spend';
import OppCostResult from './OppCostResult';
import { PlanContext } from '../goals/PlanContext';

export default function TrueOppCostResult() {
	const { dr }: any = useContext(PlanContext);
	const { cfs, setCFs, analyzeFor }: any = useContext(CalcContext);
	const { cfsWithoutOppCost, freq }: any = useContext(TrueCostContext);
	const [ numOfYears, setNumOfYears ] = useState<number>(cfs.length ? cfs.length : 5);
	const [ numOfYearsOptions, setNumOfYearsOptions ] = useState<any>(initOptions(1, cfs.length ? cfs.length - 1 : 4));
	const [ oppCost, setOppCost ] = useState<number>(0);

	const calculateOppCost = (years: number) => {
		setNumOfYears(years);
		setOppCost(cfs[years - 1]);
	};

	useEffect(
		() => {
			if (!cfs || !cfs.length) {
				setOppCost(0);
				return;
			}
			setNumOfYearsOptions(initOptions(1, cfs.length - 1));
			if (numOfYears > cfs.length) {
				setNumOfYears(cfs.length);
				setOppCost(cfs[cfs.length - 1]);
			} else setOppCost(cfs[numOfYears - 1]);
		},
		[ cfs ]
	);

	useEffect(
		() => {
			if (!cfsWithoutOppCost.length) {
				setCFs([ ...[] ]);
				return;
			}
			let cfsWithOppCost: Array<number> = [];
			for (let i = 0; i < analyzeFor; i++) {
				let prevCF = i < cfsWithoutOppCost.length ? -cfsWithoutOppCost[i] : cfsWithOppCost[i - 1];
				if (i > 0 && i < cfsWithoutOppCost.length && freq !== SPEND_ONCE) {
					prevCF += cfsWithOppCost[i - 1];
				}
				let compoundedVal = Math.round(prevCF * (1 + dr / 100));
				cfsWithOppCost.push(compoundedVal);
			}
			setCFs([ ...cfsWithOppCost ]);
		},
		[ cfsWithoutOppCost, dr, analyzeFor ]
	);

	return (
		<OppCostResult
			oppCost={-oppCost}
			oppCostHandler={calculateOppCost}
			numOfYears={numOfYears}
			numOfYearsOptions={numOfYearsOptions}
		/>
	);
}
