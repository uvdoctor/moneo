import React from "react";
import dynamic from "next/dynamic";
import {
  getCommonConfig,
  getCommonLayoutProps,
  getCommonStyle,
} from "../chartutils";
interface BRCompChartProps {
  data: Array<any>;
  currency?: string;
  sellAfter: number;
  rentAns: string;
  title: string;
  fullScreen: boolean;
}

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export function BRCompChart(props: BRCompChartProps) {
  const customWidth = props.data[0].values.x.length * 40;

  return (
    <div id="graphDiv" className="w-full">
      <Plot
        //@ts-ignore
        layout={{
          ...getCommonLayoutProps(props.title),
          width: customWidth < 600 ? 600 : customWidth,
          xaxis: {
            type: "category",
            showgrid: false,
            range: [1, props.data[0].values.x.length],
          },
          legend: {
            orientation: "h",
            x: 0,
            y: 1.08,
          },
        }}
        style={getCommonStyle()}
        useResizeHandler
        data={[
          //@ts-ignore: Object is possible undefined
          {
            type: "scatter",
            fill: "tozeroy",
            mode: "none",
            x: props.data[0].values.x,
            y: props.data[0].values.y,
            name: props.data[0].name,
          },
          //@ts-ignore: Object is possible undefined
          {
            type: "scatter",
            fill: "tonexty",
            mode: "none",
            x: props.data[1].values.x,
            y: props.data[1].values.y,
            name: props.data[1].name,
          },
        ]}
        config={getCommonConfig()}
      />
    </div>
  );
}
