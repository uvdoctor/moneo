import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useFullScreenBrowser } from "react-browser-hooks";
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
  const customWidth = props.data[0].values.x.length * 30;
  const fsb = useFullScreenBrowser();
  const autoResize = 800;

  useEffect(() => {
    if (fsb.info.screenWidth > autoResize) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 300);
    }
  }, [props.fullScreen]);

  useEffect;
  return (
    <div className="w-full">
      <Plot
        //@ts-ignore
        layout={{
          ...getCommonLayoutProps(
            props.title,
            ",",
            fsb.info.screenWidth > autoResize
          ),
          width: fsb.info.screenWidth < autoResize ? customWidth : 0,
          xaxis: {
            type: "category",
            showgrid: false,
            range: [1, props.data[0].values.x.length],
          },
          legend: {
            orientation: "h",
            x: 0,
            y: 1.05,
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
