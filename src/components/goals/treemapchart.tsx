import React from "react";
import dynamic from "next/dynamic";
import {
  getCommonConfig,
  getCommonLayoutProps,
  getCommonStyle,
} from "../chartutils";

interface TreeMapChartProps {
  aa: any;
}

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function TreeMapChart({ aa }: TreeMapChartProps) {
  return (
    <Plot
      //@ts-ignore
      layout={{
        ...getCommonLayoutProps(),
        hoverlabel: { labelformat: "%"}
      }}
      useResizeHandler
      style={getCommonStyle()}
      data={[
        {
          type: "treemap",
          labels: [
            "Cash",
            "Savings",
            "Deposits",
            "Bonds",
            "Short-term",
            "Intermediate-term",
            "Tax Exempt",
            "Stocks",
            "Dividend-growth",
            "Large-cap",
            "Multi-cap",
            "International",
            "Alternative",
            "Domestic REIT",
            "International REIT",
            "Gold",
            "Digital Currencies",
          ],
          values: [
            "0",
            aa["savings"][0],
            aa["deposits"][0],
            "0",
            aa["sbonds"][0],
            aa["mbonds"][0],
            aa["mtebonds"][0],
            "0",
            aa["divstocks"][0],
            aa["largecapstocks"][0],
            aa["multicapstocks"][0],
            aa["istocks"][0],
            "0",
            aa["dreit"][0],
            aa["ireit"][0],
            aa["gold"][0],
            aa["digitalcurrency"][0],
          ],
          parents: [
            "",
            "Cash",
            "Cash",
            "",
            "Bonds",
            "Bonds",
            "Bonds",
            "",
            "Stocks",
            "Stocks",
            "Stocks",
            "Stocks",
            "",
            "Alternative",
            "Alternative",
            "Alternative",
            "Alternative",
          ],
          marker: {
            colors: [
              "green",
              "#68d391",
              "#38a169",
              "blue",
              "#4299e1",
              "#3182ce",
              "#2b6cb0",
              "orange",
              "#ed8936",
              "#dd6b20",
              "#c05621",
              "#9c4221",
              "brown",
              "#805ad5",
              "#b794f4",
              "gold",
              "#e53e3e",
            ],
          },
          textinfo: "label+percent entry",
          name: "Total Investment",
          hoverinfo: "label+parent entry" 
        },
      ]}
      config={getCommonConfig()}
    />
  );
}
