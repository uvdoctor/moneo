import React, { useState } from "react";
import { Rate } from "antd";
import simpleStorage from "simplestorage.js";
import { LOCAL_INDEX_PERF_KEY } from "../../CONSTANTS";
import SelectInput from "../form/selectinput";
import { toReadableNumber } from "../utils";

interface PerfHistFeedbackProps {
  instrument: any;
  performance: any;
}

const calcDiff = (curr: number, prev: number, years: number) =>
  ((curr / prev - 1) * 100) / years;

export default function PerfHistFeedback({
  instrument,
  performance,
}: PerfHistFeedbackProps) {
  const [index, setIndex] = useState<string>("NIFTY 50");
  const indicePerfData = simpleStorage.get(LOCAL_INDEX_PERF_KEY) || [];
  const indexMap: { [key: string]: string } = {};
  indicePerfData.forEach((item: any) => (indexMap[item.name] = item.name));

  const calculateOverallRating = (index: string) => {
    let niftyRating = 1;
    const ins1y = calcDiff(instrument?.price, performance?.p1y, 1);
    const ins3y = calcDiff(instrument?.price, performance?.p3y, 3);
    const ins5y = calcDiff(instrument?.price, performance?.p5y, 5);
    const perfData = indicePerfData.find((item: any) => item.name === index);
    const index1y = perfData && perfData?.p1y;
    const index3y = perfData && perfData?.p3y;
    const index5y = perfData && perfData?.p5y;
    if (ins1y > index1y) niftyRating += 2;
    if (ins3y > index3y) niftyRating += 1;
    if (ins5y > index5y) niftyRating += 1;
    return { niftyRating, ins1y, ins3y, ins5y, index1y, index5y, index3y };
  };

  const { niftyRating, ins1y, ins3y, ins5y, index1y, index5y, index3y } =
    calculateOverallRating(index);

  const info = () => {
    const calculateDiff = (insPerf: number, indPerf: number, yr: number) => {
      const perf = insPerf > indPerf ? "OutPerformed" : "Underperformed";
      const color = insPerf > indPerf ? "green" : "red";
      const diff = toReadableNumber(Math.abs(insPerf - indPerf), 2);
      return (
        <>
          {yr} {yr === 1 ? "year" : "years"}: {perf} index by{" "}
          <strong style={{ color: `${color}` }}>{diff}%</strong>
        </>
      );
    };
    const diff1 = () => calculateDiff(ins1y, index1y, 1);
    const diff3 = () => calculateDiff(ins3y, index3y, 3);
    const diff5 = () => calculateDiff(ins5y, index5y, 5);

    return (
      <>
        {`Performance consistency compared to ${index} index over last 5 years`}
        <br />
        {diff1()}
        <br />
        {diff3()}
        <br />
        {diff5()}
      </>
    );
  };

  return (
    <>
      <SelectInput
        pre="Relative performance"
        value={index}
        changeHandler={setIndex}
        options={indexMap}
        inline
        // @ts-ignore
        info={info()}
      />
      &nbsp;
      <Rate value={niftyRating} disabled />
    </>
  );
}
