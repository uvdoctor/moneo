import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { CalcContext } from '../calc/CalcContext';
import { FIGoalContext } from '../goals/FIGoalContext';
import { getMonthName } from '../utils';

const AreaChart = dynamic(() => import('bizcharts/lib/plots/AreaChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function FISavingsTargetChart() {
	const { currency, ffResult, cfs }: any = useContext(CalcContext);
	const { avgMonthlySavings, monthlySavingsRate }: any = useContext(FIGoalContext);
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			const today = new Date();
			let month = today.getMonth();
			let year = today.getFullYear();
			let savingsAmt = avgMonthlySavings;
			while (year < ffResult.ffYear) {
				savingsAmt *= 1 + monthlySavingsRate / 100;
				if (month > 11) {
					month = 0;
					year++;
					if (year === ffResult.ffYear) break;
				}
				data.push({
					month: getMonthName(month + 1, true) + '-' + year.toString().substring(2),
					value: savingsAmt
				});
				month++;
			}
			setData([ ...data ]);
		},
		[ cfs ]
	);

	return (
		<AreaChart
			data={data}
			xField="month"
			yField="value"
			yAxis={getCommonYAxis()}
			xAxis={getCommonXAxis('Month')}
			meta={getCommonMeta(currency)}
		>
			<Slider {...getDefaultSliderProps()} />
		</AreaChart>
	);
}
