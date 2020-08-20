import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  getCommonConfig,
  getCommonLayoutProps,
  getCommonStyle,
} from "../chartutils";
import { buildYearsArray } from "../utils";
interface BRCompChartProps {
  analyzeFor: number;
  data: Array<any>;
  currency?: string;
  sellAfter: number;
  rentAns: string;
  title: string;
  fullScreen: boolean;
}

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export function BRCompChart(props: BRCompChartProps) {
  const [numOfYears, setNumOfYears] = useState<Array<number>>(
    buildYearsArray(1, props.analyzeFor)
  );

  useEffect(() => {
    setNumOfYears([...buildYearsArray(1, props.analyzeFor)]);
  }, [props.analyzeFor]);

  useEffect(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 500);
  }, [props.fullScreen]);

  useEffect;
  return (
    <div className="w-full">
      <Plot
        //@ts-ignore
        layout={{
          ...getCommonLayoutProps(props.title, ","),
          xaxis: {
            type: "category",
            showgrid: false,
            range: [1, numOfYears.length],
          },
          legend: {
            orientation: "h",
            x: 0.5,
            y: 1.07,
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
            x: numOfYears,
            y: props.data[0].values,
            name: props.data[0].name,
          },
          //@ts-ignore: Object is possible undefined
          {
            type: "scatter",
            fill: "tonexty",
            mode: "none",
            x: numOfYears,
            y: props.data[1].values,
            name: props.data[1].name,
          },
        ]}
        config={getCommonConfig()}
      />
    </div>
  );
}
