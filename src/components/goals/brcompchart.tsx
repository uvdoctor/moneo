import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {useFullScreenBrowser} from "react-browser-hooks"
import {
  getCommonConfig,
  getCommonLayoutProps,
  getCommonStyle,
} from "../chartutils";
import { buildYearsArray, isMobileDevice } from "../utils";
interface BRCompChartProps {
  data: Array<any>;
  fullScreen: boolean;
}

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function BRCompChart(props: BRCompChartProps) {
  const fsb = useFullScreenBrowser()
  const [answer, setAnswer] = useState<string>("");
  const [numOfYears, setNumOfYears] = useState<Array<number>>(
    buildYearsArray(1, props.data[0].values.length)
  );

  const findAnswer = (data: Array<any>) => {
    let answer = "";
    let condition = "";
    let buyValues = data[0].values;
    let rentValues = data[1].values;
    if (buyValues[0] < rentValues[0]) {
      answer += "Renting costs lesser";
    } else if (buyValues[0] > rentValues[0]) answer += "Buying costs lesser";
    else if (buyValues[0] === rentValues[0])
      answer += "Both options cost similar";
    for (let i = 1; i < buyValues.length; i++) {
      let alternative = "";
      if (buyValues[i] < rentValues[i]) alternative += "Renting";
      else if (buyValues[i] > rentValues[i]) alternative += "Buying";
      else if (buyValues[i] === rentValues[i]) alternative += "Both";
      if (!answer.startsWith(alternative)) {
        condition = ` till ${i} ${i === 1 ? "year" : "years"}.<br>${alternative} costs lesser after that.`;
        break;
      }
    }
    setAnswer(answer + condition);
  };

  useEffect(() => {
    setNumOfYears([...buildYearsArray(1, props.data[0].values.length)]);
    findAnswer(props.data)
  }, [props.data])

  useEffect(() => {
    if (!isMobileDevice(fsb))
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 700);
  }, [props.fullScreen]);

  useEffect;
  return (
    <div className="w-full">
      <Plot
        //@ts-ignore
        layout={{
          ...getCommonLayoutProps(answer, ","),
          xaxis: {
            title: "Number of Years",
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
