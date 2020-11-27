import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDarkTheme, getDefaultSliderProps } from '../chartutils';
import { GoalContext } from './GoalContext';
import { CalcContext } from '../calc/CalcContext';
import { createYearlyFromMonthlyLoanCFs } from '../calc/finance';

const StackedColumnChart = dynamic(() => import('bizcharts/lib/plots/StackedColumnChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function LoanScheduleChart() {
	const { currency, startMonth }: any = useContext(CalcContext);
	const { pSchedule, iSchedule, loanRepaymentSY }: any = useContext(GoalContext);
	const [ data, setData ] = useState<Array<any>>([]);
	let darkTheme: any;
	if (typeof window !== 'undefined') darkTheme = getDarkTheme();

	useEffect(
		() => {
			let data: Array<any> = [];
			let yearlyLoanCFs: any = createYearlyFromMonthlyLoanCFs(iSchedule, pSchedule, startMonth);
			for (let year = loanRepaymentSY; year < loanRepaymentSY + yearlyLoanCFs.principal.length; year++) {
				data.push({
					name: 'Principal',
					year: year,
					value: yearlyLoanCFs.principal[year - loanRepaymentSY]
				});
				data.push({
					name: 'Interest',
					year: year,
					value: yearlyLoanCFs.interest[year - loanRepaymentSY]
				});
			}
			setData([ ...data ]);
		},
		[ loanRepaymentSY, pSchedule, iSchedule ]
	);

	return (
		<StackedColumnChart
			meta={getCommonMeta(currency)}
			xField="year"
			yField="value"
			stackField="name"
			yAxis={getCommonYAxis()}
			xAxis={getCommonXAxis('Year')}
			data={data}
			legend={{ position: 'top-center' }}
			theme={darkTheme}
		>
			<Slider {...getDefaultSliderProps()} />
		</StackedColumnChart>
	);
}
