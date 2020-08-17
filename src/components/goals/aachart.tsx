import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { convertPerToDec } from "../utils";
import {
  getCommonConfig,
  getCommonLayoutProps,
  getCommonStyle,
} from "../chartutils";
import { useFullScreenBrowser } from "react-browser-hooks";

interface AAChartProps {
  aa: any;
  rr: Array<number>;
  years: Array<number>;
  fullScreen: boolean;
}

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function AAChart(props: AAChartProps) {
  const fsb = useFullScreenBrowser();
  const createScatterTrace = (
    cfs: any,
    name: string,
    color: string,
    mode: string = "line"
  ) => {
    return {
      type: "scatter",
      x: props.years,
      y: convertPerToDec(cfs),
      name: name,
      mode: mode,
      marker: { color: color },
      line: { shape: "spline" },
    };
  };

  const createBarTrace = (
    cfs: any,
    name: string,
    color: string,
    mode: string = "line"
  ) => {
    return {
      type: "bar",
      x: props.years,
      y: convertPerToDec(cfs),
      name: name,
      mode: mode,
      marker: { color: color },
    };
  };

  useEffect(() => {
    if (fsb.info.screenWidth > 800)
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 300);
  }, [props.fullScreen]);

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
            x: 0.25,
            y: -0.25,
          },
        }}
        useResizeHandler
        style={getCommonStyle()}
        data={[
          createBarTrace(props.aa.savings, "Savings Account", "#b7791f"),
          createBarTrace(props.aa.deposits, "Deposits", "#38a169"),
          createBarTrace(props.aa.sbonds, "Short-term Bonds Fund", "#4299e1"),
          createBarTrace(
            props.aa.mbonds,
            "Intermediate-term Bonds Fund",
            "#3182ce"
          ),
          createBarTrace(props.aa.mtebonds, "Tax-Exempt Bonds Fund", "#2b6cb0"),
          createBarTrace(
            props.aa.divstocks,
            "Dividend Growth Stocks ETF",
            "#ed8936"
          ),
          createBarTrace(
            props.aa.largecapstocks,
            "Large-cap Growth Stocks ETF",
            "#dd6b20"
          ),
          createBarTrace(
            props.aa.multicapstocks,
            "Multi-cap Growth Stocks ETF",
            "#c05621"
          ),
          createBarTrace(
            props.aa.istocks,
            "International Stocks ETF",
            "#7b341e"
          ),
          createBarTrace(props.aa.dreit, "Domestic REIT ETF", "#805ad5"),
          createBarTrace(props.aa.ireit, "International REIT ETF", "#b794f4"),
          createBarTrace(props.aa.gold, "Gold ETF", "gold"),
          createBarTrace(
            props.aa.digitalcurrency,
            "Digital Currencies",
            "#e53e3e"
          ),
          createScatterTrace(
            props.rr,
            "Potential Return",
            "#3c366b",
            "lines+markers"
          ),
        ]}
        config={getCommonConfig()}
      />
    </div>
  );
}
