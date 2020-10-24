import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';
import { buildYearsArray } from '../utils';
interface BuyRentChartProps {
	data: Array<any>;
	currency: string;
}

const GroupedColumnChart = dynamic(() => import('bizcharts/lib/plots/GroupedColumnChart'), { ssr: false });

export default function BuyRentChart(props: BuyRentChartProps) {
	const [ stackedData, setStackedData ] = useState<Array<any>>(buildYearsArray(1, props.data[0].values.length));

	useEffect(
		() => {
			let chartData: Array<any> = [];
			if (props.data[0].values.length === 0) {
				setStackedData([ ...chartData ]);
				return;
			}
			for (let year = 1; year <= props.data[0].values.length; year++) {
				chartData.push({
					name: props.data[0].name,
					years: year,
					value: props.data[0].values[year - 1]
				});
				chartData.push({
					name: props.data[1].name,
					years: year,
					value: props.data[1].values[year - 1]
				});
			}
			setStackedData([ ...chartData ]);
		},
		[ props.data ]
	);

	return (
			<GroupedColumnChart
				meta={getCommonMeta(props.currency)}
				xField="years"
				yField="value"
				groupField="name"
				data={stackedData}
				yAxis={getCommonYAxis()}
				xAxis={getCommonXAxis('Number of Years')}
			/>
	);
}
