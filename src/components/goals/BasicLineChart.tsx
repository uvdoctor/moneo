import React, { useState, useEffect, useContext, Fragment } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';
import { Col, Row } from 'antd';
import NumberInput from '../form/numberinput';

interface BasicLineChartProps {
	numberOfYears?: boolean;
	chartTitle?: string;
	title?: string;
	showRange?: boolean;
}

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function BasicLineChart({ numberOfYears, chartTitle, title, showRange }: BasicLineChartProps) {
	const { startYear, currency, cfs, goal, analyzeFor, setAnalyzeFor }: any = useContext(CalcContext);
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			let startVal = numberOfYears ? 1 : goal.type === GoalType.FF ? new Date().getFullYear() : startYear;
			for (let i = 0; i < cfs.length; i++)
				data.push({
					year: '' + (startVal + i),
					value: cfs[i]
				});
			setData([ ...data ]);
		},
		[ cfs ]
	);

	return (
		<Fragment>
			{showRange ? (
				<Row align="middle" className="chart-options-row" justify="center">
					<Col xs={24} sm={24} md={24} lg={12}>
						<NumberInput
							pre="Compare from 1 to "
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
			) : null}
			{chartTitle && (
				<Row justify="center">
					<Col>
						<strong>{chartTitle}</strong>
					</Col>
				</Row>
			)}
			<Row style={{ minHeight: '400px' }}>
				<Col span={24}>
					<LineChart
						data={data}
						xField="year"
						yField="value"
						yAxis={getCommonYAxis()}
						xAxis={getCommonXAxis(title ? title : numberOfYears ? 'Number of Years' : 'Year')}
						meta={getCommonMeta(currency)}
						point={true}
						autoFit
					>
						<Slider {...getDefaultSliderProps()} />
					</LineChart>
				</Col>
			</Row>
		</Fragment>
	);
}
