import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getAllAssetCategories, getAllAssetTypesByCategory, getAssetColour } from '../utils';

interface TreeMapChartProps {
	aa: any;
	rr: Array<number>;
}

const TreemapChart = dynamic(() => import('bizcharts/lib/plots/TreemapChart'), { ssr: false });

export default function TreeMapChart({ aa, rr }: TreeMapChartProps) {
	const [ data, setData ] = useState<Array<any>>([]);
	const [ colors, setColors ] = useState<Array<string>>([]);

	const initChartData = () => {
		let data: Array<any> = [];
		let colors: Array<string> = [];
		getAllAssetCategories().forEach((cat) => {
			let children: Array<any> = [];
			let total = 0;
			getAllAssetTypesByCategory(cat).forEach((at) => {
				if (aa[at][0]) {
					total += aa[at][0];
					children.push({
						name: at,
						value: aa[at][0],
						children: []
					});
					colors.push(getAssetColour(at));
				}
			});
			data.push({
				name: cat,
				value: total,
				children: children
      });
      colors.push(getAssetColour(cat))
		});
    setData([...data]);
    setColors([...colors]);
	};

	useEffect(
		() => {
			initChartData();
		},
		[ rr ]
	);

	return (
		<TreemapChart
			data={{
				name: 'Portfolio',
				value: 100,
				children: data
			}}
			meta={{
				value: {
					formatter: (v) => {
						return v + '%';
					}
				}
			}}
			colorField="value"
			label={{
				visible: true,
				formatter: (v) => {
					return aa.hasOwnProperty(v) ? v + '\n' + aa[v][0] + '%' : v;
				}
      }}
      color={colors}
		/>
	);
}
