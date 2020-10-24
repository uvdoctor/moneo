import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonFill, getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';
import { buildYearsArray } from '../utils';
interface BuyRentChartProps {
	data: Array<any>;
	currency: string;
	answer: string;
	answerHandler: Function;
}

const GroupedColumnChart = dynamic(() => import('bizcharts/lib/plots/GroupedColumnChart'), { ssr: false });

export default function BuyRentChart(props: BuyRentChartProps) {
	const [ stackedData, setStackedData ] = useState<Array<any>>(buildYearsArray(1, props.data[0].values.length));

	const findAnswer = (data: Array<any>) => {
		let answer = '';
		let condition = '';
		let buyValues = data[0].values;
		let rentValues = data[1].values;
		if (buyValues[0] < rentValues[0]) {
			answer += 'Rent';
		} else if (buyValues[0] > rentValues[0]) answer += 'Buy';
		else if (buyValues[0] === rentValues[0]) answer += 'Both cost similar.';
		for (let i = 1; i < buyValues.length; i++) {
			let alternative = '';
			if (buyValues[i] < rentValues[i]) alternative += 'Rent';
			else if (buyValues[i] > rentValues[i]) alternative += 'Buy';
			else if (buyValues[i] === rentValues[i]) alternative += 'Both';
			if (!answer.startsWith(alternative)) {
				condition = ` till ${i} ${i === 1 ? 'Year' : 'Years'}. ${alternative} after that.`;
				break;
			}
		}
		props.answerHandler(answer + condition);
	};

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
			findAnswer(props.data);
		},
		[ props.data ]
	);

	return (
			<GroupedColumnChart
				meta={getCommonMeta(props.currency)}
				title={{ visible: true, text: props.answer, style: getCommonFill() }}
				xField="years"
				yField="value"
				groupField="name"
				data={stackedData}
				yAxis={getCommonYAxis()}
				xAxis={getCommonXAxis('Number of Years')}
			/>
	);
}
