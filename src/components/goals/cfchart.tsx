import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  getCommonConfig,
  getCommonLayoutProps,
  getCommonStyle,
} from "../chartutils";
import { useFullScreenBrowser } from "react-browser-hooks";
import { buildYearsArray, isMobileDevice } from "../utils";

interface CFChartProps {
  mustCFs: Array<number>;
  tryCFs: Array<number>;
  optCFs: Array<number>;
  from: number;
  to: number;
  fullScreen: boolean;
}

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function CFChart({
  mustCFs,
  tryCFs,
  optCFs,
  from,
  to,
  fullScreen,
}: CFChartProps) {
  const [years, setYears] = useState<Array<number>>([]);
  const fsb = useFullScreenBrowser();

  useEffect(() => {
    setYears([
      ...buildYearsArray(from,to),
    ]);
  }, [from, to]);

  useEffect(() => {
    if (!isMobileDevice(fsb))
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 300);
  }, [fullScreen]);

  const createBarTrace = (cfs: Array<number>, name: string) => {
    return {
      type: "bar",
      x: years,
      y: cfs,
      name: name,
    };
  };

  return (
    <div className="w-full">
      <Plot
        //@ts-ignore
        layout={{
          barmode: "stack",
          ...getCommonLayoutProps(),
          xaxis: {
            title: "Year",
            showgrid: false,
            type: "category",
          },
          legend: {
            orientation: "h",
            x: 0.5,
            y: 1,
          },
        }}
        useResizeHandler
        style={getCommonStyle()}
        data={[
          createBarTrace(mustCFs, "Must Meet"),
          createBarTrace(tryCFs, "Try Best"),
          createBarTrace(optCFs, "Optional"),
        ]}
        config={getCommonConfig()}
      />
    </div>
  );
}
