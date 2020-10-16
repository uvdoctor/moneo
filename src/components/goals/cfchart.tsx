import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';

interface CFChartProps {
	mustCFs: Array<number>;
	tryCFs: Array<number>;
	optCFs: Array<number>;
	from: number;
  to: number;
  currency: string
}

const StackedColumnChart = dynamic(() => import('bizcharts/lib/plots/StackedColumnChart'), { ssr: false });

export default function CFChart({ mustCFs, tryCFs, optCFs, from, to, currency }: CFChartProps) {
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			for (let year = from; year <= to; year++) {
				if (mustCFs[year - from]) {
					data.push({
						year: year,
						value: mustCFs[year - from],
						name: 'Must Meet'
					});
				}
				if (tryCFs[year - from]) {
					data.push({
						year: year,
						value: tryCFs[year - from],
						name: 'Try Best'
					});
				}
				if (optCFs[year - from]) {
					data.push({
						year: year,
						value: optCFs[year - from],
						name: 'Optional'
					});
				}
			}
			setData([ ...data ]);
		},
		[ from, to, mustCFs, tryCFs, optCFs ]
	);

	return (
		<div className="w-full">
			<StackedColumnChart
				data={data}
				xField="year"
				yField="value"
				stackField="name"
				yAxis={getCommonYAxis()}
        xAxis={getCommonXAxis('Year')}
        meta={getCommonMeta(currency)}
			/>
		</div>
	);
}
