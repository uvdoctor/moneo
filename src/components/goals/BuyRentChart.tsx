import React, { Fragment, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { buildYearsArray, toCurrency } from '../utils';
import { GoalContext } from './GoalContext';
import { Col, Row } from 'antd';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';

const GroupedColumnChart = dynamic(() => import('bizcharts/lib/plots/GroupedColumnChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function BuyRentChart() {
	const { currency }: any = useContext(CalcContext);
	const { brChartData, analyzeFor, setAnalyzeFor }: any = useContext(GoalContext);
	const [ stackedData, setStackedData ] = useState<Array<any>>(buildYearsArray(1, brChartData[0].values.length));
	const [ selectedIndex, setSelectedIndex ] = useState<number | null>(null);

	const calculateRentDiff = (numOfYears: number) =>
		numOfYears && brChartData && brChartData.length && brChartData[0].values.length >= numOfYears
			? brChartData[1].values[numOfYears - 1] - brChartData[0].values[numOfYears - 1]
			: null;

	const getDiffAns = (numOfYears: number) => {
		const diff = calculateRentDiff(numOfYears);
		if (!diff) return '';
		return `Rent ${diff < 0 ? 'Costlier' : 'Cheaper'} by ${toCurrency(
			Math.abs(diff),
			currency
		)} over ${numOfYears} Years`;
	};

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
		<Fragment>
			<Row align="middle" className="chart-options-row" justify="center">
				<Col xs={24} sm={24} md={24} lg={12}>
					<NumberInput
						pre="Compare from 1 to "
						value={analyzeFor}
						changeHandler={setAnalyzeFor}
						min={10}
						max={50}
						step={5}
						unit="Years"
						additionalMarks={[ 20, 30, 40 ]}
					/>
				</Col>
			</Row>
			<Row justify="center">
				{selectedIndex ? getDiffAns(selectedIndex) : `Buy v/s Rent Comparison for ${analyzeFor} Years`}
			</Row>
			<Col span={24} style={{ minHeight: '400px' }}>
				{/*@ts-ignore*/}
				<GroupedColumnChart
					meta={getCommonMeta(currency)}
					xField="years"
					yField="value"
					groupField="name"
					data={stackedData}
					yAxis={getCommonYAxis()}
					xAxis={getCommonXAxis('Number of Years')}
					legend={{ position: 'top-center' }}
					events={{
						onColumnClick: (event: any) => {
							setSelectedIndex(parseInt(event.data.years));
						}
					}}
					animation={false}
				>
					<Slider {...getDefaultSliderProps()} />
				</GroupedColumnChart>
			</Col>
		</Fragment>
	);
}
