import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';
import { CONTEXT_TC } from '../../CONSTANTS';

interface DDLineChartProps {
	contextType: any;
	numberOfYears?: boolean;
}

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), { ssr: false });

export default function DDLineChart({ contextType, numberOfYears }: DDLineChartProps) {
	const {
		startYear,
		currency,
		cfs,
		cfsWithOppCost
	}: any = useContext(contextType);
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			let startVal = numberOfYears || !startYear ? 1 : startYear;
			let cashFlows = contextType === CONTEXT_TC && cfsWithOppCost && cfsWithOppCost.length > 0 ? cfsWithOppCost : cfs; 
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
			xAxis={getCommonXAxis(numberOfYears ? 'Number of Years' : 'Year')}
			meta={getCommonMeta(currency)}
			point={{ visible: true }}
		/>
	);
}
