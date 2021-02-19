import React, { useState, useEffect, useContext } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { PlanContext } from './PlanContext';
import { Row, Col } from 'antd';
import { COLORS } from '../../CONSTANTS';

const StackedColumnChart = dynamic(() => import('bizcharts/lib/plots/StackedColumnChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function YearlyCFChart() {
	const { mustCFs, tryCFs, optCFs, ffGoal }: any = useContext(PlanContext);
	const [ data, setData ] = useState<Array<any>>([]);
	const from = new Date().getFullYear() + 1;
	const to = ffGoal.sy + (ffGoal.loan.dur as number);
	const currency = ffGoal.ccy;
	
	useEffect(
		() => {
			let data: Array<any> = [];
			for (let year = from; year <= to; year++) {
				if (mustCFs[year - from]) {
					data.push({
						year: year,
						value: mustCFs[year - from],
						name: 'Must Meet'
					});
				}
				if (tryCFs[year - from]) {
					data.push({
						year: year,
						value: tryCFs[year - from],
						name: 'Try Best'
					});
				}
				if (optCFs[year - from]) {
					data.push({
						year: year,
						value: optCFs[year - from],
						name: 'Optional'
					});
				}
			}
			setData([ ...data ]);
		},
		[ from, to, mustCFs, tryCFs, optCFs ]
	);

	const getColumnColor = (name: string) => {
		switch (name) {
			case 'Must Meet':
				return COLORS.BLUE;
			case 'Try Best':
				return COLORS.ORANGE;
			default:
				return COLORS.GREEN;
		}
	};

	return (
		<Row>
			<Col span={24} style={{ minHeight: '400px' }}>
				<StackedColumnChart
					data={data}
					xField="year"
					yField="value"
					stackField="name"
					yAxis={getCommonYAxis()}
					xAxis={getCommonXAxis('Year')}
					meta={getCommonMeta(currency)}
					legend={{ position: 'top' }}
					color={(column: any) => getColumnColor(column.name)}
				>
					<Slider {...getDefaultSliderProps()} />
				</StackedColumnChart>
			</Col>
		</Row>
	);
}
