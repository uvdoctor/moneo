import React, { useContext, useEffect, useState } from "react";
import { Rate, Tooltip } from "antd";
import simpleStorage from "simplestorage.js";
import { LOCAL_INDEX_PERF_KEY } from "../../CONSTANTS";
import { initializeFundata, isStock } from "./nwutils";
import { NWContext } from "./NWContext";

interface PerfHistFeedbackProps {
  instrument: any;
  performance: any;
}

export default function PerfHistFeedback({
  instrument,
  performance,
}: PerfHistFeedbackProps) {
  const { instruments }: any = useContext(NWContext);
  const indexPerf = simpleStorage.get(LOCAL_INDEX_PERF_KEY);
  const [niftyRating, setNiftyRating] = useState<number>(1);
  const [sectorRating, setSectorRating] = useState<number>(1);

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
      HealthCare: "NIFTY Healthcare Index",
      Energy: "NIFTY Energy",
      "Communication Services": "NIFTY Media",
      "Real Estate": "NIFTY Realty",
    };
    return data[ind] ? data[ind] : null;
  };

  const calcDiff = (curr: number, prev: number, years: number) => {
    return (curr - prev) / years;
  };

  const setRating = async () => {
    let niftyRating = 1;
    const diffOne = calcDiff(instrument?.price, performance.p1y, 1);
    const diffThree = calcDiff(instrument?.price, performance.p3y, 3);
    const diffFive = calcDiff(instrument?.price, performance.p5y, 5);
    const indexDiffOne = indexPerf && indexPerf["NIFTY 50"]?.p1y;
    const indexDiffThree = indexPerf && indexPerf["NIFTY 50"]?.p3y;
    const indexDiffFive = indexPerf && indexPerf["NIFTY 50"]?.p5y;
    if (diffOne > indexDiffOne) niftyRating += 2;
    if (diffThree > indexDiffThree) niftyRating += 1;
    if (diffFive > indexDiffFive) niftyRating += 1;
    setNiftyRating(niftyRating);

    let sectorRating = 1;
    let fundata = await initializeFundata(instruments);
    let data =
      fundata && fundata[instrument.sid as string]
        ? fundata[instrument.sid as string]
        : null;
    if (!data) return;
    const sectorIndex = getIndexBySector(data.sector);
    if (!sectorIndex) return;
    const sectorDiffOne = indexPerf && indexPerf[sectorIndex]?.p1y;
    const setorDiffThree = indexPerf && indexPerf[sectorIndex]?.p3y;
    const sectorDiffFive = indexPerf && indexPerf[sectorIndex]?.p5y;
    if (diffOne > sectorDiffOne) niftyRating += 2;
    if (diffThree > setorDiffThree) niftyRating += 1;
    if (diffFive > sectorDiffFive) niftyRating += 1;
    setSectorRating(sectorRating);
  };

  useEffect(() => {
    setRating();
  }, []);

  return (
    <>
      <Tooltip title="Performance history feedback in comparison with NIFTY 50">
        &nbsp;&nbsp;
        <Rate value={niftyRating} disabled />
      </Tooltip>
      &nbsp;&nbsp;
      {instrument?.itype !== "ETF" &&
      isStock(instrument.subt, instrument.id) ? (
        <Tooltip title="Performance history feedback in comparison with respective sector">
          &nbsp;&nbsp;
          <Rate value={sectorRating} disabled />
        </Tooltip>
      ) : (
        <></>
      )}
    </>
  );
}
