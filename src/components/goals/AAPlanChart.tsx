import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonXAxis, getCommonYAxis } from '../chartutils';
import { ASSET_TYPES } from '../../CONSTANTS';
import { getAssetColour } from '../utils';
import { CalcContext } from '../calc/CalcContext';

const StackedColumnChart = dynamic(() => import('bizcharts/lib/plots/StackedColumnChart'), { ssr: false });

export default function AAPlanChart() {
	const { endYear, rr, ffResult }: any = useContext(CalcContext);
	const [ data, setData ] = useState<Array<any>>([]);

	const hasAllZeros = (arr: Array<number>) => {
		for (let num of arr) {
			if (num) return false;
		}
		return true;
	};

	const filterAA = () => {
		let result: any = {};
		let aa = ffResult.aa;
		for (let key in aa) {
			if (!hasAllZeros(aa[key])) {
				result[key] = aa[key].slice(1);
			}
		}
		return result;
	};

	const getKey = (desc: string) => {
		let key = desc;
		if (key.endsWith("Fund")) {
			key = key.replace(" Fund", "");
		} else if (key.endsWith(" ETF")) {
			key = key.replace(" ETF", "");
		}
		return key;
	};

	useEffect(
		() => {
			let filteredAA = filterAA();
			let arr: Array<any> = [];
			const startYear = new Date().getFullYear() + 2;
			for (let i = 0; i <= endYear - startYear; i++) {
				Object.keys(filteredAA).forEach((key) => {
					if (filteredAA[key][i]) {
						let desc = key;
						if (desc.endsWith('Bonds')) desc += ' Fund';
						else if (desc !== ASSET_TYPES.SAVINGS && desc !== ASSET_TYPES.DEPOSITS) desc += ' ETF';
						arr.push({
							year: startYear + i,
							value: filteredAA[key][i],
							asset: desc
						});
					}
				});
			}
			setData([ ...arr ]);
		},
		[ rr, endYear ]
	);

	return (
		<StackedColumnChart
			data={data}
			xField="year"
			yField="value"
			stackField="asset"
			yAxis={getCommonYAxis()}
			xAxis={getCommonXAxis('Year')}
			color={(d: string) => getAssetColour(getKey(d))}
		/>
	);
}
