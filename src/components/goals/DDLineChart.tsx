import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';
import { CalcContext } from '../calc/CalcContext';

interface DDLineChartProps {
	numberOfYears?: boolean;
	title?: string;
	firstYear?: number;
}

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), { ssr: false });

export default function DDLineChart({ numberOfYears, title, firstYear }: DDLineChartProps) {
	const {
		startYear,
		currency,
		cfs,
		cfsWithOppCost
	}: any = useContext(CalcContext);
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			let startVal = firstYear ? firstYear : (numberOfYears || !startYear) ? 1 : startYear;
			let cashFlows = cfsWithOppCost && cfsWithOppCost.length > 0 ? cfsWithOppCost : cfs; 
			for (let i = 0; i < cashFlows.length; i++)
				data.push({
					year: startVal + i,
					value: cashFlows[i]
				});
			setData([ ...data ]);
		},
		[ cfs ]
	);

	return (
		<LineChart
			data={data}
			xField="year"
			yField="value"
			yAxis={getCommonYAxis()}
			xAxis={getCommonXAxis(title ? title : numberOfYears ? 'Number of Years' : 'Year')}
			meta={getCommonMeta(currency)}
			point={{ visible: true }}
			interactions={[{ type: 'drag-move' }, {type: 'view-zoom'}]}
			forceFit
		/>
	);
}
