import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';
import { buildYearsArray } from '../utils';
import { GoalContext } from './GoalContext';

const GroupedColumnChart = dynamic(() => import('bizcharts/lib/plots/GroupedColumnChart'), { ssr: false });

export default function BuyRentChart() {
	const { brChartData, currency, brAns }: any = useContext(GoalContext);
	const [ stackedData, setStackedData ] = useState<Array<any>>(buildYearsArray(1, brChartData[0].values.length));

	useEffect(
		() => {
			let chartData: Array<any> = [];
			if (brChartData[0].values.length === 0) {
				setStackedData([ ...chartData ]);
				return;
			}
			for (let year = 1; year <= brChartData[0].values.length; year++) {
				chartData.push({
					name: brChartData[0].name,
					years: year,
					value: brChartData[0].values[year - 1]
				});
				chartData.push({
					name: brChartData[1].name,
					years: year,
					value: brChartData[1].values[year - 1]
				});
			}
			setStackedData([ ...chartData ]);
		},
		[ brChartData ]
	);

	return (
		brAns ? <GroupedColumnChart
			meta={getCommonMeta(currency)}
			xField="years"
			yField="value"
			groupField="name"
			data={stackedData}
			yAxis={getCommonYAxis()}
			xAxis={getCommonXAxis('Number of Years')}
		/> : null
	);
}
