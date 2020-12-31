import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { CalcContext } from '../calc/CalcContext';
import { FIGoalContext } from '../goals/FIGoalContext';
import { getMonthName } from '../utils';

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), { ssr: false });
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
				month++;
				if (month > 12) {
					month = 1;
					year++;
					if (year === ffResult.ffYear) break;
				}
				data.push({
					month: getMonthName(month, true) + '-' + year,
					value: savingsAmt
				});
			}
			setData([ ...data ]);
		},
		[ cfs ]
	);

	return (
		<LineChart
			data={data}
			xField="month"
			yField="value"
			yAxis={getCommonYAxis()}
			xAxis={getCommonXAxis('Month')}
			meta={getCommonMeta(currency)}
			point={{ visible: true }}
			forceFit
		>
			<Slider {...getDefaultSliderProps()} />
		</LineChart>
	);
}
