import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { GoalContext } from './GoalContext';
import { CalcContext } from '../calc/CalcContext';
import { createYearlyFromMonthlyLoanCFs } from '../calc/finance';

const StackedColumnChart = dynamic(() => import('bizcharts/lib/plots/StackedColumnChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function LoanScheduleChart() {
	const { currency, startYear, startMonth }: any = useContext(CalcContext);
	const { pSchedule, iSchedule, insSchedule, loanRepaymentMonths }: any = useContext(GoalContext);
	const [ data, setData ] = useState<Array<any>>([]);
	const [ hasMonthlyInsurance, setHasMonthlyInsurance ] = useState<boolean>(false);

	useEffect(
		() => {
			for (let p of insSchedule) {
				if (p) {
					setHasMonthlyInsurance(true);
					return;
				}
			}
			setHasMonthlyInsurance(false);
		},
		[ insSchedule ]
	);

	useEffect(
		() => {
			let data: Array<any> = [];
			let yearlyLoanCFs: any = createYearlyFromMonthlyLoanCFs(
				iSchedule,
				pSchedule,
				insSchedule,
				startMonth,
				loanRepaymentMonths
			);
			let startingYear = startYear;
			if (loanRepaymentMonths && startMonth + loanRepaymentMonths > 12) startingYear++;
			for (let year = startingYear; year < startingYear + yearlyLoanCFs.principal.length; year++) {
				let index = year - startingYear;
				data.push({
					name: 'Principal',
					year: year,
					value: yearlyLoanCFs.principal[index]
				});
				data.push({
					name: 'Interest',
					year: year,
					value: yearlyLoanCFs.interest[index]
				});
				if (hasMonthlyInsurance) {
					data.push({
						name: 'Insurance',
						year: year,
						value: yearlyLoanCFs.insurance[index] ? yearlyLoanCFs.insurance[index] : 0
					});
				}
			}
			setData([ ...data ]);
		},
		[ loanRepaymentMonths, pSchedule, iSchedule, startYear, startMonth ]
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
			legend={{ position: 'top' }}
		>
			<Slider {...getDefaultSliderProps()} />
		</StackedColumnChart>
	);
}
