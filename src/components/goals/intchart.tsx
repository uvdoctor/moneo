import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';

interface IntChartProps {
	principalSchedule: Array<number>;
	interestSchedule: Array<number>;
	repaymentSY: number;
	loanYears: number;
	currency: string;
}

const StackedColumnChart = dynamic(() => import('bizcharts/lib/plots/StackedColumnChart'), { ssr: false });

export default function IntChart(props: IntChartProps) {
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			for (let year = props.repaymentSY; year < props.repaymentSY + props.loanYears; year++) {
				data.push({
					name: 'Principal',
					year: year,
					value: props.principalSchedule[year - props.repaymentSY]
				});
				data.push({
					name: 'Interest',
					year: year,
					value: props.interestSchedule[year - props.repaymentSY]
				});
			}
			setData([ ...data ]);
		},
		[ props.repaymentSY, props.loanYears, props.principalSchedule, props.interestSchedule ]
	);

	return (
		<div className="w-full">
			<StackedColumnChart
				meta={getCommonMeta(props.currency)}
				xField="year"
				yField="value"
				stackField="name"
				yAxis={getCommonYAxis()}
        xAxis={getCommonXAxis('Year')}
        data={data}
			/>
		</div>
	);
}
