import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { convertPerToDec, getAssetColour, isMobileDevice } from "../utils";
import {
  getCommonConfig,
  getCommonLayoutProps,
  getCommonStyle,
} from "../chartutils";
import { useFullScreenBrowser } from "react-browser-hooks";
import { ASSET_TYPES } from "../../CONSTANTS";

interface AAChartProps {
  aa: any;
  rr: Array<number>;
  years: Array<number>;
  fullScreen: boolean;
}

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function AAChart(props: AAChartProps) {
  const fsb = useFullScreenBrowser();
  const hoverTemplate = "%{y} %{fullData.name}<extra></extra>"
  const filterAA = () => {
    let result: any = {};
    for (let key in props.aa) {
      result[key] = props.aa[key].slice(1);
    }
    return result;
  };
  const [filteredAA, setFilteredAA] = useState<any>(filterAA());
  const [filteredRR, setFilteredRR] = useState<Array<number>>(
    props.rr.slice(0, 1)
  );
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
      hovertemplate: hoverTemplate
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
      hovertemplate: hoverTemplate
    };
  };

  const createBarTraces = () => {
    let arr: Array<any> = [];
    Object.keys(filteredAA).forEach((key) => {
      let desc = key;
      if (desc.endsWith("Bonds")) desc += " Fund";
      else if (
        desc !== ASSET_TYPES.SAVINGS &&
        desc !== ASSET_TYPES.DEPOSITS
      )
        desc += " ETF";
      arr.push(createBarTrace(filteredAA[key], desc, getAssetColour(key)));
    });
    return arr;
  };

  useEffect(() => {
    if (!isMobileDevice(fsb))
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 300);
  }, [props.fullScreen]);

  useEffect(() => {
    setFilteredAA(filterAA());
    setFilteredRR([...props.rr.slice(1)]);
  }, [props.rr]);

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
            y: -0.5,
          },
        }}
        useResizeHandler
        style={getCommonStyle()}
        data={[
          ...createBarTraces(),
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
