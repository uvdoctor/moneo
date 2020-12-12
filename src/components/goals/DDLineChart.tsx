import React, { useState, useEffect, useContext, Fragment } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';
import { Col, Row } from 'antd';
import NumberInput from '../form/numberinput';

interface DDLineChartProps {
	numberOfYears?: boolean;
	title?: string;
}

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function DDLineChart({ numberOfYears, title }: DDLineChartProps) {
	const { startYear, currency, cfs, cfsWithOppCost, goal, analyzeFor, setAnalyzeFor }: any = useContext(CalcContext);
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			let startVal = numberOfYears ? 1 : goal.type === GoalType.FF ? new Date().getFullYear() + 1 : startYear;
			let cashFlows = cfsWithOppCost && cfsWithOppCost.length ? cfsWithOppCost : cfs;
			for (let i = 0; i < cashFlows.length; i++)
				data.push({
					year: '' + (startVal + i),
					value: cashFlows[i]
				});
			setData([ ...data ]);
		},
		[ cfs, cfsWithOppCost ]
	);

	return (
		<Fragment>
			{cfsWithOppCost && cfsWithOppCost.length ? (
				<Row align="middle" className="chart-options-row" justify="center">
					<Col xs={24} sm={24} md={24} lg={12}>
						<NumberInput
							pre="Compare from 1 to "
							value={analyzeFor}
							changeHandler={setAnalyzeFor}
							min={1}
							max={50}
							step={1}
							unit="Years"
							additionalMarks={[ 20, 30, 40 ]}
						/>
					</Col>
				</Row>
			) : null}
			<Col span={24} style={{ minHeight: '400px' }}>
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
			</Col>
		</Fragment>
	);
}
