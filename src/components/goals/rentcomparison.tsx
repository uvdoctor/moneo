import React, { useState, useEffect } from "react";
import { TargetInput } from "../../api/goals";
import { getNPV } from "../calc/finance";
import ResultItem from "../calc/resultitem";
import SVGBalance from "../calc/svgbalance";
import NumberInput from "../form/numberinput";
import Section from "../form/section";
import HToggle from "../horizontaltoggle";

interface RentComparisonProps {
  allInputDone: boolean
  inputOrder: number
  currentOrder: number
  currency: string;
  rangeFactor: number;
  rentAmt: number;
  rentAmtHandler: Function;
  rentChgPer: number;
  rentChgPerHandler: Function;
  taxRate: number;
  rentTaxBenefit: number;
  rentTaxBenefitHandler: Function;
  startYear: number;
  buyCFsHandler: Function;
  rr: Array<number>;
  manualMode: number;
  manualTgts: Array<TargetInput>;
  sellAfter: number;
  brChartData: Array<any>;
  brChartDataHandler: Function;
  nextStepHandler: Function
}
export default function RentComparison({
  allInputDone,
  inputOrder,
  currentOrder,
  currency,
  rangeFactor,
  rentAmt,
  rentAmtHandler,
  rentChgPer,
  rentChgPerHandler,
  taxRate,
  rentTaxBenefit,
  rentTaxBenefitHandler,
  startYear,
  buyCFsHandler,
  rr,
  manualMode,
  manualTgts,
  sellAfter,
  brChartData,
  brChartDataHandler,
  nextStepHandler
}: RentComparisonProps) {
  const firstRRIndex = startYear - (new Date().getFullYear() + 1);
  const [rentDiff, setRentDiff] = useState<number | null>(null);
  const [analyzeFor, setAnalyzeFor] = useState<number>(20);
  const [allBuyCFs, setAllBuyCFs] = useState<Array<Array<number>>>([]);

  const getNextTaxAdjRentAmt = (val: number) => {
    return (
      val *
      (1 + rentChgPer / 100) *
      (rentTaxBenefit > 0 ? 1 - taxRate / 100 : 1)
    );
  };

  const initAllRentCFs = (buyCFs: Array<number>) => {
    if (rentAmt <= 0) return [];
    let taxAdjustedRentAmt = rentAmt * (1 - taxRate / 100);
    if (!buyCFs || buyCFs.length === 0) return [];
    let npv: Array<number> = [];
    for (let i = 0; i < analyzeFor; i++) {
      let cfs = [];
      let inv = 0;
      for (
        let j = 0, value = taxAdjustedRentAmt;
        j <= i;
        j++, value = getNextTaxAdjRentAmt(value)
      ) {
        if (buyCFs[j]) inv += buyCFs[j];
        inv -= value;
        if (inv > 0) {
          let dr = rr[firstRRIndex + j];
          if (!dr) dr = 3;
          inv += inv * (dr / 100);
        }
        cfs.push(-value);
      }
      cfs.push(inv);
      if (cfs.length > 0) {
        npv.push(getNPV(rr, cfs, firstRRIndex));
      }
    }
    return npv;
  };

  const initAllBuyCFs = (allBuyCFs: Array<Array<number>>) => {
    let npv: Array<number> = [];
    for (let i = 0; i < analyzeFor; i++) {
      let buyCFs = allBuyCFs[i];
      if (buyCFs && buyCFs.length > 0) {
        npv.push(getNPV(rr, buyCFs, firstRRIndex));
      }
    }
    return npv;
  };

  const getBuyCFForRentAnalysis = () => {
    let arr: Array<number> = [];
    if (!allBuyCFs || allBuyCFs.length === 0) return arr;
    if (manualMode < 1) arr.push(-allBuyCFs[0][0]);
    else manualTgts.forEach((t) => arr.push(t.val));
    return arr;
  };

  const buildComparisonData = () => {
    let results: Array<any> = [];
    const buyCFforRentComp = getBuyCFForRentAnalysis();
    if (allBuyCFs && allBuyCFs.length > 0) {
      results.push({
        name: "Buy",
        values: initAllBuyCFs(allBuyCFs),
      });
      results.push({
        name: "Rent",
        values: initAllRentCFs(buyCFforRentComp),
      });
    }
    return results;
  };

  const provideRentAns = () => {
    if (
      !brChartData ||
      brChartData.length === 0 ||
      brChartData[0].values.length < sellAfter
    ) {
      setRentDiff(null);
      return;
    }
    setRentDiff(
      brChartData[1].values[sellAfter - 1] -
        brChartData[0].values[sellAfter - 1]
    );
  };

  useEffect(() => {
    provideRentAns();
  }, [brChartData, sellAfter]);

  useEffect(() => {
    if (rentAmt > 0) {
      let data = buildComparisonData();
      if (data && data.length == 2) brChartDataHandler([...data]);
    } else {
      brChartDataHandler([...[]]);
    }
  }, [taxRate, rr, rentAmt, rentChgPer, rentTaxBenefit, allBuyCFs, analyzeFor]);

  useEffect(() => {
    let allBuyCFs: Array<Array<number>> = [];
    for (let i = 1; i <= analyzeFor; i++)
      allBuyCFs.push(buyCFsHandler(i, false));
    setAllBuyCFs([...allBuyCFs]);
  }, [analyzeFor]);

  return (
    <div className="flex w-full justify-around">
      {(allInputDone || inputOrder <= currentOrder) && (
      <Section
        title="If You Rent Instead of Buying"
        insideForm
        left={
          <NumberInput
            inputOrder={inputOrder}
            currentOrder={currentOrder}
            nextStepDisabled={false}
            nextStepHandler={nextStepHandler}
            allInputDone={allInputDone}
            name="rentAmt"
            pre="Yearly"
            post="Rent"
            value={rentAmt as number}
            changeHandler={rentAmtHandler}
            min={0}
            max={100000}
            step={1000}
            currency={currency}
            rangeFactor={rangeFactor}
          />
        }
        right={
          rentAmt > 0 && (
            <NumberInput
              name="rentChg"
              inputOrder={0}
              currentOrder={-1}
              nextStepDisabled={false}
              nextStepHandler={() => true}
              allInputDone={true}
              pre="Yearly"
              post="Change"
              value={rentChgPer as number}
              changeHandler={rentChgPerHandler}
              min={-10}
              max={10}
              step={0.5}
              unit="%"
            />
          )
        }
        bottom={
          !!rentAmt && (
            <div className="flex flex-col justify-center">
              <NumberInput
                name="af"
                pre="Analyze up to"
                value={analyzeFor}
                changeHandler={setAnalyzeFor}
                currentOrder={-1}
                inputOrder={0}
                nextStepDisabled={false}
                nextStepHandler={() => true}
                allInputDone
                min={20}
                max={50}
                step={5}
                unit="Years"
              />  
              {rentDiff && (
                <ResultItem
                  svg={<SVGBalance />}
                  result={rentDiff}
                  label={`Rent is ${rentDiff < 0 ? "Costlier" : "Cheaper"} by`}
                  footer={`Over ${sellAfter} Years`}
                  currency={currency}
                  pl
                />
              )}
            </div>
          )
        }
        toggle={
          taxRate ? (
            <HToggle
              rightText="Claim Tax Deduction"
              value={rentTaxBenefit}
              setter={rentTaxBenefitHandler}
            />
          ) : (
            <div />
          )
        }
      />)}
    </div>
  );
}
