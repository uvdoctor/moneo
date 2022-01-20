import React, { Fragment, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  getCommonMeta,
  getCommonXAxis,
  getCommonYAxis,
  getDefaultSliderProps,
} from "../chartutils";
import { isMobileDevice, toCurrency } from "../utils";
import { GoalContext } from "./GoalContext";
import { Col } from "antd";
import { CalcContext } from "../calc/CalcContext";
import { useFullScreenBrowser } from "react-browser-hooks";
import YearsRange from "./YearsRange";
import { BuyType } from "../../api/goals";

const ColumnChart = dynamic(() => import("bizcharts/lib/plots/ColumnChart"), {
  ssr: false,
});
const Slider = dynamic(() => import("bizcharts/lib/components/Slider"), {
  ssr: false,
});

export default function BuyRentChart() {
  const { currency }: any = useContext(CalcContext);
  const { brChartData, buyType }: any = useContext(GoalContext);
  const [stackedData, setStackedData] = useState<Array<any>>([]);
  const fsb = useFullScreenBrowser();

  useEffect(() => {
    if (!brChartData || brChartData.length !== 2) {
      setStackedData([...[]]);
      return;
    }
    let chartData: Array<any> = [];
    for (let i = 0; i < brChartData[0].values.length; i++) {
      chartData.push({
        name: brChartData[0].name,
        years: "" + (i + 3),
        value: brChartData[0].values[i],
      });
      chartData.push({
        name: brChartData[1].name,
        years: "" + (i + 3),
        value: brChartData[1].values[i],
      });
    }
    setStackedData([...chartData]);
  }, [brChartData]);

  const getAns = (buyVal: number, rentVal: number) =>
    buyVal > rentVal ? "Buy" : "Rent";

  return (
    <Fragment>
      {!buyType || buyType === BuyType.P ? <YearsRange /> : null}
      <Col span={24} style={{ minHeight: "400px" }}>
        <ColumnChart
          meta={getCommonMeta(currency)}
          xField="years"
          yField="value"
          seriesField="name"
          data={stackedData}
          yAxis={getCommonYAxis(!isMobileDevice(fsb))}
          xAxis={getCommonXAxis("Number of Years")}
          legend={{
            position: "top",
          }}
          tooltip={{
            fields: ["years", "name", "value"],
            showTitle: false,
            formatter: ({ years, name, value }: any) => {
              const y = parseInt(years);
              const isAns =
                name ===
                getAns(
                  brChartData[0].values[y - 3],
                  brChartData[1].values[y - 3]
                );
              const valueStr = `${value >= 0 ? "Gain" : "Loss"} of ${toCurrency(
                Math.abs(value),
                currency
              )} over ${years} Years`;
              return {
                name: isAns ? `<b>${name}</b>` : name,
                value: isAns ? `<b>${valueStr}</b>` : valueStr,
              };
            },
          }}
          isGroup>
          <Slider {...getDefaultSliderProps()} />
        </ColumnChart>
      </Col>
    </Fragment>
  );
}
