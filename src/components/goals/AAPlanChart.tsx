import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonXAxis, getDefaultSliderProps } from '../chartutils';
import { getAssetColour } from '../utils';
import { CalcContext } from '../calc/CalcContext';
import { FIGoalContext } from './FIGoalContext';
import { Row, Col } from 'antd';
import { PlanContext } from './PlanContext';

const ColumnChart = dynamic(() => import('bizcharts/lib/plots/ColumnChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), {
	ssr: false
});

export default function AAPlanChart() {
	const { rr, goal, ffResult, ffGoal }: any = useContext(PlanContext);
	const { wipGoal, cfs }: any = useContext(CalcContext);
	const { wipResult }: any = useContext(FIGoalContext);
	const [ data, setData ] = useState<Array<any>>([]);

	const hasAllZeros = (arr: Array<number>) => {
		for (let num of arr) {
			if (num) return false;
		}
		return true;
	};

	const filterAA = () => {
		let result: any = {};
		let aa = goal ? wipResult.aa : ffResult.aa;
		for (let key in aa) {
			if (!hasAllZeros(aa[key])) {
				result[key] = aa[key].slice(1);
			}
		}
		return result;
	};

	useEffect(
		() => {
			if (!cfs.length) return;
			let filteredAA = filterAA();
			let arr: Array<any> = [];
			const sy = new Date().getFullYear() + 1;
			let ffGoalEndYear = goal ? (wipGoal.sy + wipGoal.loan?.dur) : (ffGoal.sy + ffGoal.loan?.dur);
			for (let i = 0; i <= ffGoalEndYear - sy; i++) {
				Object.keys(filteredAA).forEach((key) => {
					if (filteredAA[key][i]) {
						arr.push({
							year: sy + i,
							value: filteredAA[key][i],
							asset: key
						});
					}
				});
			}
			setData([ ...arr ]);
		},
		[ cfs, rr ]
	);

	return (
		<Row>
			<Col span={24} style={{ minHeight: '400px' }}>
				<ColumnChart
					data={data}
					xField="year"
					yField="value"
					seriesField="asset"
					xAxis={getCommonXAxis('Year')}
					yAxis={{ line: null, grid: null, label: null }}
					color={({ asset }: any) => getAssetColour(asset)}
					legend={{ position: 'top' }}
					isStack={true}
				>
					<Slider {...getDefaultSliderProps()} />
				</ColumnChart>
			</Col>
		</Row>
	);
}
