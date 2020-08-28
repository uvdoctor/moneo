import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  getCommonConfig,
  getCommonLayoutProps,
  getCommonStyle,
} from "../chartutils";
import { getAllAssetCategories, getAllAssetTypesByCategory, getAssetColour } from "../utils";
import { ASSET_CATEGORIES, ASSET_TYPES } from "../../CONSTANTS";

interface TreeMapChartProps {
  aa: any;
  rr: Array<number>
}

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function TreeMapChart({ aa, rr }: TreeMapChartProps) {
  const [labels, setLabels] = useState<Array<string>>([])
  const [values, setValues] = useState<Array<string>>([])
  const [colors, setColors] = useState<Array<string>>([])
  const [parents, setParents] = useState<Array<string>>([])
  
  const initChartData = () => {
      let labels: Array<string> = []
      let values: Array<string> = []
      let colors: Array<string> = []
      let parents: Array<string> = []
      getAllAssetCategories().forEach(cat => {
        labels.push(cat)
        values.push("0")
        colors.push(getAssetColour(cat))
        parents.push("")
        getAllAssetTypesByCategory(cat).forEach(at => {
          values.push(aa[at][0])
          colors.push(getAssetColour(at))
          if(at.endsWith("nds") || at.endsWith("cks")) {
            labels.push(at.split(" ")[0])
            parents.push(at.split(" ")[1])
          } else {
            labels.push(at)
            if(at === ASSET_TYPES.SAVINGS || at === ASSET_TYPES.DEPOSITS)
              parents.push(ASSET_CATEGORIES.CASH)
            else parents.push(ASSET_CATEGORIES.ALTERNATIVE)
          }
        })
      })
      setLabels([...labels])
      setValues([...values])
      setColors([...colors])
      setParents([...parents])
  }

  useEffect(() => {
    initChartData()
  }, [rr])

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
          labels: labels,
          values: values,
          parents: parents,
          marker: {
            colors: colors,
          },
          hovertext: "Portfolio",
          textinfo: "label+percent entry",
          hoverinfo: "label+percent entry+text"
        },
      ]}
      config={getCommonConfig()}
    />
  );
}
