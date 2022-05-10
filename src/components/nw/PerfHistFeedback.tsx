import React, { useEffect, useState } from "react";
import { Rate } from "antd";
import { calculateDiffPercent } from "./valuationutils";
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

  useEffect(() => {
    let star = 1;
    const diffOne = calculateDiffPercent(instrument?.price, performance.p1y);
    const diffThree = calculateDiffPercent(instrument?.price, performance.p3y);
    const diffFive = calculateDiffPercent(instrument?.price, performance.p5y);
    const indexDiffOne = indexPerf["NIFTY 50"]?.p1y;
    const indexDiffTwo = indexPerf["NIFTY 50"]?.p3y;
    const indexDiffThree = indexPerf["NIFTY 50"]?.p5y;
    if(diffOne > indexDiffOne) star += 2;
    if(diffThree > indexDiffTwo) star += 1;
    if(diffFive > indexDiffThree) star += 1;
    setStar(star);
  }, []);


  return <Rate value={star} />;
}
