import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  getCommonConfig,
  getCommonLayoutProps,
  getCommonStyle,
} from "../chartutils";
import { useFullScreenBrowser } from "react-browser-hooks";
import { buildYearsArray, convertPerToDec, isMobileDevice } from "../utils";
import { COLORS } from "../../CONSTANTS";

interface IntChartProps {
  principalSchedule: Array<number>;
  interestSchedule: Array<number>;
  repaymentSY: number;
  loanYears: number;
  fullScreen: boolean;
}

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function IntChart(props: IntChartProps) {
  const fsb = useFullScreenBrowser();
  const [years, setYears] = useState<Array<number>>([]);

  useEffect(() => {
    setYears([
      ...buildYearsArray(
        props.repaymentSY,
        props.repaymentSY + props.loanYears - 1
      ),
    ]);
  }, [props.repaymentSY, props.loanYears]);

  useEffect(() => {
    if (!isMobileDevice(fsb))
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 300);
  }, [props.fullScreen]);

  const createBarTrace = (
    cfs: Array<number>,
    name: string,
    color: string,
    mode: string = "line"
  ) => {
    console.log("CFs are: ", cfs)
    return {
      type: "bar",
      x: years,
      y: convertPerToDec(cfs),
      name: name,
      mode: mode,
      marker: { color: color },
    };
  };

  return (
    <div className="w-full">
      <Plot
        //@ts-ignore
        layout={{
          barmode: "stack",
          ...getCommonLayoutProps("", "%", true),
          xaxis: { title: "Year", showgrid: false, type: "category" },
          legend: {
            orientation: "h",
            x: 0.7,
            y: 1.1,
          },
        }}
        useResizeHandler
        style={getCommonStyle()}
        data={[
          createBarTrace(props.principalSchedule, "Principal", COLORS.GREEN),
          createBarTrace(props.interestSchedule, "Interest", COLORS.RED),
        ]}
        config={getCommonConfig()}
      />
    </div>
  );
}
