import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';

interface DDLineChartProps {
	cfs: Array<number>;
	startYear: number;
	title?: string;
	currency: string;
}

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), { ssr: false });

export default function DDLineChart(props: DDLineChartProps) {
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			for (let i = 0; i < props.cfs.length; i++)
				data.push({
					year: props.startYear + i,
					value: props.cfs[i]
				});
			setData([ ...data ]);
		},
		[ props.cfs, props.startYear ]
	);

	return (
		<LineChart
			data={data}
			xField="year"
			yField="value"
			yAxis={getCommonYAxis()}
			xAxis={getCommonXAxis(props.title ? props.title : 'Year')}
			meta={getCommonMeta(props.currency)}
			point={{ visible: true }}
		/>
	);
}
