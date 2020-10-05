import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";

interface DDLineChartProps {
	cfs: Array<number>;
	startYear: number;
	fullScreen: boolean;
	title?: string;
}

const LineChart = dynamic(() => import("bizcharts/lib/plots/LineChart"), { ssr: false });

export default function DDLineChart(props: DDLineChartProps) {
	const [ data, setData ] = useState<Array<any>>([]);
	/*const layout = {
    ...getCommonLayoutProps(),
    xaxis: { title: props.title ? props.title : "Year", type: "category", showgrid: false },
  };
  const track = {
    type: "scatter",
    mode: "lines+markers",
    x: years,
    y: props.cfs,
    line: { color: "#68d391", size: 3 },
    marker: { color: "#276749", symbol: "circle-x" },
  };*/

	useEffect(
		() => {
			let data: Array<any> = [];
			for (let i = 0; i < props.cfs.length; i++)
				data.push({
					year: props.startYear + i,
					value: props.cfs[i]
				});
			setData([ ...data ]);
		},
		[ props.cfs, props.startYear ]
	);

	/*useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
  }, [props.fullScreen]);*/

	return (
		<div className="w-full">
			{/*<Plot
        layout={layout}
        style={getCommonStyle()}
        data={[track]}
        useResizeHandler
        config={getCommonConfig()}
      />*/}
			<LineChart
				data={data}
				xField="year"
				yField="value"
			/>
		</div>
	);
}
