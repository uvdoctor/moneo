import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { CalcContext } from './CalcContext';
import { FIGoalContext } from '../goals/FIGoalContext';
import { getMonthName, isMobileDevice } from '../utils';
import { useFullScreenBrowser } from "react-browser-hooks";

const AreaChart = dynamic(() => import('bizcharts/lib/plots/AreaChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function FIMonthlyInvTargetChart() {
	const { currency, cfs }: any = useContext(CalcContext);
	const { avgMonthlySavings, monthlySavingsRate, monthlyMaxSavings, wipResult }: any = useContext(FIGoalContext);
	const [ data, setData ] = useState<Array<any>>([]);
	const fsb = useFullScreenBrowser();
	
	useEffect(
		() => {
			let data: Array<any> = [];
			const today = new Date();
			let month = today.getMonth();
			let year = today.getFullYear();
			let savingsAmt = avgMonthlySavings;
			while (year < wipResult.ffYear) {
				savingsAmt *= 1 + monthlySavingsRate / 100;
				if (savingsAmt > monthlyMaxSavings) savingsAmt = monthlyMaxSavings;
				if (month > 11) {
					month = 0;
					year++;
					if (year === wipResult.ffYear) break;
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
			yAxis={getCommonYAxis(!isMobileDevice(fsb))}
			xAxis={getCommonXAxis('Month')}
			meta={getCommonMeta(currency)}
		>
			<Slider {...getDefaultSliderProps()} />
		</AreaChart>
	);
}
