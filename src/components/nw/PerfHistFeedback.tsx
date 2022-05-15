import React from "react";
import { Rate, Tooltip } from "antd";
import simpleStorage from "simplestorage.js";
import { LOCAL_FUN_DATA_KEY, LOCAL_INDEX_PERF_KEY } from "../../CONSTANTS";

interface PerfHistFeedbackProps {
  instrument: any;
  performance: any;
}

const getIndexBySector = (ind: string) => {
  const data: { [key: string]: string } = {
    "Basic Materials": "NIFTY Metal",
    "Consumer Cyclical": "NIFTY India Consumption",
    "Consumer Defensive": "NIFTY Consumer Durables",
    "Consumer Goods": "NIFTY FMCG",
    Financial: "NIFTY Financial Services",
    "Financial Services": "NIFTY Financial Services",
    Services: "NIFTY Services Sector",
    Technology: "NIFTY IT",
    Utilities: "NIFTY Oil & Gas",
    Healthcare: "NIFTY Healthcare Index",
    Energy: "NIFTY Energy",
    "Communication Services": "NIFTY Media",
    "Real Estate": "NIFTY Realty",
  };
  return data[ind] ? data[ind] : null;
};

const calcDiff = (curr: number, prev: number, years: number) =>
  (curr - prev) / years;

export default function PerfHistFeedback({
  instrument,
  performance,
}: PerfHistFeedbackProps) {
  const indexPerf = simpleStorage.get(LOCAL_INDEX_PERF_KEY);

  const calculateOverallRating = () => {
    let niftyRating = 1;
    const diffOne = calcDiff(instrument?.price, performance?.p1y, 1);
    const diffThree = calcDiff(instrument?.price, performance?.p3y, 3);
    const diffFive = calcDiff(instrument?.price, performance?.p5y, 5);
    const indexDiffOne = indexPerf && indexPerf["NIFTY 50"]?.p1y;
    const indexDiffThree = indexPerf && indexPerf["NIFTY 50"]?.p3y;
    const indexDiffFive = indexPerf && indexPerf["NIFTY 50"]?.p5y;
    if (diffOne > indexDiffOne) niftyRating += 2;
    if (diffThree > indexDiffThree) niftyRating += 1;
    if (diffFive > indexDiffFive) niftyRating += 1;
    return niftyRating;
  };

  const performSectorComparison = () => {
    let fundata = simpleStorage.get(LOCAL_FUN_DATA_KEY);
    let data =
      fundata && fundata[instrument.sid as string]
        ? fundata[instrument.sid as string]
        : null;
    if (!data) return null;
    const sectorIndex = getIndexBySector(data.sector);
    if (!sectorIndex) return null;
    let sectorRating = 1;
    const diffOne = calcDiff(instrument?.price, performance?.p1y, 1);
    const diffThree = calcDiff(instrument?.price, performance?.p3y, 3);
    const diffFive = calcDiff(instrument?.price, performance?.p5y, 5);
    const sectorDiffOne = indexPerf && indexPerf[sectorIndex]?.p1y;
    const setorDiffThree = indexPerf && indexPerf[sectorIndex]?.p3y;
    const sectorDiffFive = indexPerf && indexPerf[sectorIndex]?.p5y;
    if (diffOne > sectorDiffOne) sectorRating += 2;
    if (diffThree > setorDiffThree) sectorRating += 1;
    if (diffFive > sectorDiffFive) sectorRating += 1;
    return { index: sectorIndex, rating: sectorRating };
  };

  const niftyRating = calculateOverallRating();
  const sectorPerf = performSectorComparison();

  return (
    <>
      <Tooltip title="Performance consistency compared to NIFTY 50 index over last 5 years">
        Market rating&nbsp;&nbsp;
        <Rate value={niftyRating} disabled />
      </Tooltip>
      &nbsp;&nbsp;
      {sectorPerf ? (
        <Tooltip title="Performance consistency compared to the index of respective sector over last 5 years">
          {sectorPerf.index} rating&nbsp;&nbsp;
          <Rate value={sectorPerf.rating} disabled />
        </Tooltip>
      ) : null}
    </>
  );
}
