import React, { useEffect, useState } from "react";
import { Rate } from "antd";
import simpleStorage from "simplestorage.js";
import { LOCAL_INDEX_PERF_KEY } from "../../CONSTANTS";

interface PerfHistFeedbackProps {
  instrument: any;
  performance: any;
}

export default function PerfHistFeedback({
  instrument,
  performance,
}: PerfHistFeedbackProps) {
  const indexPerf = simpleStorage.get(LOCAL_INDEX_PERF_KEY);
  const [star, setStar] = useState<number>(1);

  const calcDiff = (curr: number, prev: number, years: number) => {
    return (curr - prev) / years;
  };

  useEffect(() => {
    let star = 1;
    const diffOne = calcDiff(instrument?.price, performance.p1y, 1);
    const diffThree = calcDiff(instrument?.price, performance.p3y, 3);
    const diffFive = calcDiff(instrument?.price, performance.p5y, 5);
    const indexDiffOne = indexPerf && indexPerf["NIFTY 50"]?.p1y;
    const indexDiffThree = indexPerf && indexPerf["NIFTY 50"]?.p3y;
    const indexDiffFive = indexPerf && indexPerf["NIFTY 50"]?.p5y;
    if (diffOne > indexDiffOne) star += 2;
    if (diffThree > indexDiffThree) star += 1;
    if (diffFive > indexDiffFive) star += 1;
    setStar(star);
  }, []);

  return <Rate value={star} />;
}
