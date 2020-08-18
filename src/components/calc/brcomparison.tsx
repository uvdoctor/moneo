import React, { useState, useEffect } from "react";
import { getNPV } from "../calc/finance";
import { BRCompChart } from "../goals/brcompchart";
import { toCurrency } from "../utils";

interface BRComparisonProps {
  taxRate: number;
  currency: string;
  sellAfter: number;
  startYear: number;
  analyzeFor: number;
  rr: Array<number>;
  rentAmt: number;
  rentAmtHandler: Function;
  rentChgPer: number;
  rentChgPerHandler: Function;
  rentTaxBenefit: number;
  rentTaxBenefitHandler: Function;
  answer: string;
  answerHandler: Function;
  rentAns: string;
  rentAnsHandler: Function;
  allBuyCFs: Array<Array<number>>;
  showChart: boolean;
  fullScreen: boolean
}

export default function BRComparison(props: BRComparisonProps) {
  const [compData, setCompData] = useState<Array<any>>([]);
  const firstRRIndex = props.startYear - (new Date().getFullYear() + 1);

  const getNextTaxAdjRentAmt = (val: number) => {
    return (
      val *
      (1 + props.rentChgPer / 100) *
      (props.rentTaxBenefit > 0 ? 1 - props.taxRate / 100 : 1)
    );
  };

  const initAllRentCFs = (allBuyCFs: Array<Array<number>>) => {
    if (props.rentAmt <= 0) return [];
    let taxAdjustedRentAmt = props.rentAmt * (1 - props.taxRate / 100);
    if (!allBuyCFs || allBuyCFs.length < 1) return [];
    let x: Array<number> = [];
    let y: Array<number> = [];
    for (let i = 0; i < props.analyzeFor; i++) {
      let cfs = [];
      let buyCFs = allBuyCFs[i];
      if (buyCFs && buyCFs.length > 0) {
        let inv = 0;
        for (
          let j = 0, value = taxAdjustedRentAmt;
          j < buyCFs.length;
          j++, value = getNextTaxAdjRentAmt(value)
        ) {
          let buyAmt = buyCFs[j];
          let rentAmt = 0
          if(j <= i) rentAmt = -1 * value;
          let diff = buyAmt - rentAmt;
          inv -= diff;
          if (inv > 0) {
            let dr = props.rr[firstRRIndex + j];
            if (!dr) dr = 3;
            inv += inv * (dr / 100);
          }
          cfs.push(rentAmt)
        }
        cfs[cfs.length - 1] += inv;
      }
      if (cfs.length > 0) {
        x.push(i + 1);
        y.push(getNPV(props.rr, cfs, firstRRIndex));
      }
    }
    return { x: x, y: y };
  };

  const initAllBuyCFs = (allBuyCFs: Array<Array<number>>) => {
    let x: Array<number> = [];
    let y: Array<number> = [];
    for (let i = 0; i < props.analyzeFor; i++) {
      let buyCFs = allBuyCFs[i];
      if (buyCFs && buyCFs.length > 0) {
        x.push(i + 1);
        y.push(getNPV(props.rr, buyCFs, firstRRIndex));
      }
    }
    return { x: x, y: y };
  };

  const buildComparisonData = () => {
    let results: Array<any> = [];
    if (props.allBuyCFs && props.allBuyCFs.length > 0) {
      results.push({
        name: "Buy",
        values: initAllBuyCFs(props.allBuyCFs),
      });
      results.push({
        name: "Rent",
        values: initAllRentCFs(props.allBuyCFs),
      });
    }
    console.log("Results are: ", results);
    return results;
  };

  const provideRentAns = (data: Array<any>) => {
    let buyValues = data[0].values.y;
    let rentValues = data[1].values.y;
    if (buyValues.length >= props.sellAfter) {
      let diff =
        rentValues[props.sellAfter - 1] - buyValues[props.sellAfter - 1];
      let rentAns = `Over ${props.sellAfter} ${
        props.sellAfter === 1 ? "year" : "years"
      }, `;
      if (diff === 0) rentAns += `Renting costs similar to Buying.`;
      else
        rentAns += `Rent is ${
          diff > 0 ? "cheaper" : "costlier"
        } by ${toCurrency(Math.abs(diff), props.currency)}`;
      props.rentAnsHandler(rentAns);
      return;
    }
    props.rentAnsHandler("");
  };

  const findAnswer = (data: Array<any>) => {
    let answer = "";
    let condition = "";
    let buyValues = data[0].values.y;
    let rentValues = data[1].values.y;
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
        condition = ` till ${i} ${i === 1 ? "year" : "years"}`;
        break;
      }
    }
    return answer + condition;
  };

  useEffect(() => {
    if (compData && compData.length === 2) {
      props.answerHandler(findAnswer(compData));
      provideRentAns(compData);
    } else {
      props.answerHandler("");
      props.rentAnsHandler("");
    }
  }, [compData, props.sellAfter]);

  useEffect(() => {
    if (props.rentAmt > 0) {
      let data = buildComparisonData();
      console.log("Chart data is ", data);
      if (data && data.length == 2) setCompData([...data]);
    } else setCompData([...[]]);
  }, [
    props.taxRate,
    props.rr,
    props.rentAmt,
    props.rentChgPer,
    props.rentTaxBenefit,
    props.allBuyCFs,
    props.analyzeFor,
  ]);

  return (
    <div>
      {compData && compData.length === 2 && props.showChart &&
      <BRCompChart
        data={compData}
        rentAns={props.rentAns}
        sellAfter={props.sellAfter}
        title={props.answer}
        fullScreen={props.fullScreen}
      />}
    </div>
  );
}
