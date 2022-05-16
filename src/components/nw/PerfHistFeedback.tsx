import React, { useState } from "react";
import { Rate, Tooltip } from "antd";
import simpleStorage from "simplestorage.js";
import { LOCAL_INDEX_PERF_KEY } from "../../CONSTANTS";
import SelectInput from "../form/selectinput";

interface PerfHistFeedbackProps {
  instrument: any;
  performance: any;
}

const calcDiff = (curr: number, prev: number, years: number) =>
  (curr - prev) / years;

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
    const diffOne = calcDiff(instrument?.price, performance?.p1y, 1);
    const diffThree = calcDiff(instrument?.price, performance?.p3y, 3);
    const diffFive = calcDiff(instrument?.price, performance?.p5y, 5);
    const perfData = indicePerfData.find((item: any) => item.name === index);
    const indexDiffOne = perfData && perfData?.p1y;
    const indexDiffThree = perfData && perfData?.p3y;
    const indexDiffFive = perfData && perfData?.p5y;
    if (diffOne > indexDiffOne) niftyRating += 2;
    if (diffThree > indexDiffThree) niftyRating += 1;
    if (diffFive > indexDiffFive) niftyRating += 1;
    return niftyRating;
  };

  const niftyRating = calculateOverallRating(index);

  return (
    <>
      <Tooltip title={`Performance consistency compared to ${index} index over last 5 years`}>
        <SelectInput
          pre={""}
          value={index}
          changeHandler={setIndex}
          options={indexMap}
        />
        <Rate value={niftyRating} disabled />
      </Tooltip>
      &nbsp;&nbsp;
    </>
  );
}
