import React, { Fragment, useEffect, useState } from "react";
import { getOrderByTabLabel } from "../goals/goalutils";
import LineChart from "../goals/linechart";
import SVGChart from "../svgchart";
import SVGPay from "../svgpay";
import { CalcTypeProps } from "./calculator";
import SpendAmt from "./spendamt";
import SVGMoneyBag from "./svgmoneybag";

export default function TrueCost(props: CalcTypeProps) {
  const [amt, setAmt] = useState<number>(0);
  const [freq, setFreq] = useState<string>("one");
  const [duration, setDuration] = useState<number>(0);
  const spendLabel = "Spend";
  const earnLabel = "Earn";
  const chartLabel = "Yearly Cash Flows If Invested";
  const tabOptions: Array<any> = [
    { label: spendLabel, order: 1, active: true, svg: SVGPay },
    { label: earnLabel, order: 2, active: true, svg: SVGMoneyBag },
  ];
  const resultTabOptions: Array<any> = [
    {
      label: chartLabel,
      order: 1,
      active: true,
      svg: SVGChart,
    },
  ];
  const resultCharts: Array<any> = [
    <LineChart
      cfs={props.cfs}
      startYear={1}
      fullScreen={props.chartFullScreen}
    />,
  ];

  useEffect(() => {
    props.tabOptionsHandler([...tabOptions]);
    props.resultTabOptionsHandler([...resultTabOptions]);
    props.resultChartsHandler([...resultCharts]);
  }, []);

  useEffect(() => {
    props.cfsHandler([])
  }, [props.currency, props.dr, amt, freq])

  return (
    <Fragment>
      {props.showTab === spendLabel && (
        <SpendAmt
          currency={props.currency}
          rangeFactor={props.rangeFactor}
          allInputDone={props.allInputDone}
          currentOrder={props.currentOrder}
          inputOrder={getOrderByTabLabel(props.tabOptions, spendLabel)}
          nextStepHandler={props.nextStepHandler}
          freq={freq}
          freqHandler={setFreq}
          amt={amt}
          amtHandler={setAmt}
          duration={duration}
          durationHandler={setDuration}
        />
      )}
    </Fragment>
  );
}
