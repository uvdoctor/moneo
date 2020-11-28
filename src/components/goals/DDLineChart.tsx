import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';

interface DDLineChartProps {
	numberOfYears?: boolean;
	title?: string;
}

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function DDLineChart({ numberOfYears, title }: DDLineChartProps) {
	const {
		startYear,
		currency,
		cfs,
		cfsWithOppCost,
		goal
	}: any = useContext(CalcContext);
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			let startVal = numberOfYears ? 1 : goal.type === GoalType.FF ? new Date().getFullYear() + 1 : startYear;
			let cashFlows = cfsWithOppCost && cfsWithOppCost.length > 0 ? cfsWithOppCost : cfs; 
			for (let i = 0; i < cashFlows.length; i++)
				data.push({
					year: "" + (startVal + i),
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
			forceFit
		>
			<Slider {...getDefaultSliderProps()} />
		</LineChart>
	);
}
