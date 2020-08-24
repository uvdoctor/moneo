import React, { useEffect, useState } from "react";
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
  const filterAA = () => {
    let result: any = {}
    for(let key in props.aa) {
      result[key] = props.aa[key].slice(1)
    }
    return result
  }
  const [filteredAA, setFilteredAA] = useState<any>(filterAA())
  const [filteredRR, setFilteredRR] = useState<Array<number>>(props.rr.slice(0,1))
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

  useEffect(() => {
    setFilteredAA(filterAA())
    setFilteredRR([...props.rr.slice(1)])
  }, [props.rr])

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
          createBarTrace(filteredAA.savings, "Savings Account", "#b7791f"),
          createBarTrace(filteredAA.deposits, "Deposits", "#38a169"),
          createBarTrace(filteredAA.sbonds, "Short-term Bonds Fund", "#4299e1"),
          createBarTrace(
            filteredAA.mbonds,
            "Intermediate-term Bonds Fund",
            "#3182ce"
          ),
          createBarTrace(filteredAA.mtebonds, "Tax-Exempt Bonds Fund", "#2b6cb0"),
          createBarTrace(
            filteredAA.divstocks,
            "Dividend Growth Stocks ETF",
            "#ed8936"
          ),
          createBarTrace(
            filteredAA.largecapstocks,
            "Large-cap Growth Stocks ETF",
            "#dd6b20"
          ),
          createBarTrace(
            filteredAA.multicapstocks,
            "Multi-cap Growth Stocks ETF",
            "#c05621"
          ),
          createBarTrace(
            filteredAA.istocks,
            "International Stocks ETF",
            "#7b341e"
          ),
          createBarTrace(filteredAA.dreit, "Domestic REIT ETF", "#805ad5"),
          createBarTrace(filteredAA.ireit, "International REIT ETF", "#b794f4"),
          createBarTrace(filteredAA.gold, "Gold ETF", "gold"),
          createBarTrace(
            filteredAA.digitalcurrency,
            "Digital Currencies",
            "#e53e3e"
          ),
          createScatterTrace(
            filteredRR,
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
