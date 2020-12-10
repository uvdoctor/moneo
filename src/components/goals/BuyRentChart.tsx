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

	useEffect(
		() => {
			if (!brChartData || !brChartData.length) return;
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

	const getAns = (buyVal: number, rentVal: number) => (buyVal > rentVal ? 'Buy' : 'Rent');

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
					tooltip={{
						fields: [ 'years', 'name', 'value' ],
						showTitle: false,
						//@ts-ignore
						formatter: (years: number, name: string, value: number) => {
							const isAns =
								name === getAns(brChartData[0].values[years - 1], brChartData[1].values[years - 1]);
							const valueStr = `${value > 0 ? 'Gain' : 'Loss'} of ${toCurrency(
								Math.abs(value),
								currency
							)} over ${years} Year${years > 1 ? 's' : ''}`;
							return {
								name: isAns ? `<b>${name}</b>` : name,
								value: isAns ? `<b>${valueStr}</b>` : valueStr
							};
						}
					}}
				>
					<Slider {...getDefaultSliderProps()} />
				</GroupedColumnChart>
			</Col>
		</Fragment>
	);
}
