import React, { Fragment, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { toCurrency } from '../utils';
import { GoalContext } from './GoalContext';
import { Col, Row } from 'antd';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';

const ColumnChart = dynamic(() => import('bizcharts/lib/plots/ColumnChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function BuyRentChart() {
	const { currency, analyzeFor, setAnalyzeFor }: any = useContext(CalcContext);
	const { brChartData }: any = useContext(GoalContext);
	const [ stackedData, setStackedData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			if (!brChartData || brChartData.length !== 2) {
				setStackedData([ ...[] ]);
				return;
			}
			let chartData: Array<any> = [];
			for (let i = 0; i < brChartData[0].values.length; i++) {
				chartData.push({
					name: brChartData[0].name,
					years: '' + (i + 3),
					value: brChartData[0].values[i]
				});
				chartData.push({
					name: brChartData[1].name,
					years: '' + (i + 3),
					value: brChartData[1].values[i]
				});
			}
			setStackedData([...chartData]);
		},
		[ brChartData ]
	);

	const getAns = (buyVal: number, rentVal: number) => (buyVal > rentVal ? 'Buy' : 'Rent');

	return (
		<Fragment>
			<Row align="middle" className="chart-options-row" justify="center">
				<Col xs={24} sm={24} md={24} lg={12}>
					<NumberInput
						pre="Compare from 3 to "
						value={analyzeFor}
						changeHandler={setAnalyzeFor}
						min={5}
						max={50}
						step={1}
						unit="Years"
						additionalMarks={[ 10, 15, 20, 25, 30, 35, 40, 45 ]}
					/>
				</Col>
			</Row>
			<Col span={24} style={{ minHeight: '400px' }}>
				<ColumnChart
					meta={getCommonMeta(currency)}
					xField="years"
					yField="value"
					seriesField="name"
					data={stackedData}
					yAxis={getCommonYAxis()}
					xAxis={getCommonXAxis('Number of Years')}
					legend={{
						position: 'top',
					}}
					tooltip={{
						fields: [ 'years', 'name', 'value' ],
						showTitle: false,
						formatter: ({ years, name, value }: any) => {
							const y = parseInt(years);
							const isAns =
								name === getAns(brChartData[0].values[y - 3], brChartData[1].values[y - 3]);
							const valueStr = `${value >= 0 ? 'Gain' : 'Loss'} of ${toCurrency(
								Math.abs(value),
								currency
							)} over ${years} Years`;
							return {
								name: isAns ? `<b>${name}</b>` : name,
								value: isAns ? `<b>${valueStr}</b>` : valueStr
							};
						}
					}}
					isGroup
				>
					<Slider {...getDefaultSliderProps()} />
				</ColumnChart>
			</Col>
		</Fragment>
	);
}
