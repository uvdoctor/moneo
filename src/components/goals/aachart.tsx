import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonXAxis, getCommonYAxis } from '../chartutils';
import { ASSET_TYPES } from '../../CONSTANTS';
import { getAssetColour } from '../utils';

interface AAChartProps {
	aa: any;
	rr: Array<number>;
	years: Array<number>;
}

const StackedColumnChart = dynamic(() => import('bizcharts/lib/plots/StackedColumnChart'), { ssr: false });

export default function AAChart(props: AAChartProps) {
	const [ data, setData ] = useState<Array<any>>([]);
	const [colors, setColors] = useState<Array<string>>([]);

	const hasAllZeros = (arr: Array<number>) => {
		for (let num of arr) {
			if (num) return false;
		}
		return true;
	};

	const filterAA = () => {
		let result: any = {};
		let colors: Array<string> = []
		for (let key in props.aa) {
			if (!hasAllZeros(props.aa[key])) {
				result[key] = props.aa[key].slice(1);
				colors.push(getAssetColour(key))
			}
		}
		setColors([...colors])
		return result;
	};

	useEffect(
		() => {
			let filteredAA = filterAA();
			let arr: Array<any> = [];
			for (let i = 0; i < props.years.length; i++) {
				Object.keys(filteredAA).forEach((key) => {
					if (filteredAA[key][i]) {
						let desc = key;
						if (desc.endsWith('Bonds')) desc += ' Fund';
						else if (desc !== ASSET_TYPES.SAVINGS && desc !== ASSET_TYPES.DEPOSITS) desc += ' ETF';
						arr.push({
							year: props.years[i],
							value: filteredAA[key][i],
							asset: desc
						});
					}
				});
			}
			setData([ ...arr ]);
		},
		[ props.rr, props.years ]
	);

	return (
		<div className="w-full">
			<StackedColumnChart
				data={data}
				xField="year"
				yField="value"
				stackField="asset"
				yAxis={getCommonYAxis()}
				xAxis={getCommonXAxis('Year')}
				color={colors}
			/>
		</div>
	);
}
