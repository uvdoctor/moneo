import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';
import { GoalContext } from './GoalContext';

const StackedColumnChart = dynamic(() => import('bizcharts/lib/plots/StackedColumnChart'), { ssr: false });

export default function LoanScheduleChart() {
	const { pSchedule, iSchedule, currency, loanYears, loanRepaymentSY, loanPer, manualMode }: any = useContext(
		GoalContext
	);
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			for (let year = loanRepaymentSY; year < loanRepaymentSY + loanYears; year++) {
				data.push({
					name: 'Principal',
					year: year,
					value: pSchedule[year - loanRepaymentSY]
				});
				data.push({
					name: 'Interest',
					year: year,
					value: iSchedule[year - loanRepaymentSY]
				});
			}
			setData([ ...data ]);
		},
		[ loanRepaymentSY, loanYears, pSchedule, iSchedule ]
	);

	return manualMode < 1 && loanPer && loanRepaymentSY && loanYears ? (
		<StackedColumnChart
			meta={getCommonMeta(currency)}
			xField="year"
			yField="value"
			stackField="name"
			yAxis={getCommonYAxis()}
			xAxis={getCommonXAxis('Year')}
			data={data}
		/>
	) : null;
}
