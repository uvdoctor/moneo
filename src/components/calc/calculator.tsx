import React, { useEffect } from "react";
import { useState } from "react";
import SelectInput from "../form/selectinput";
import { getTabLabelByOrder } from "../goals/goalutils";
import InputSection from "../goals/inputsection";
import ResultSection from "../goals/resultsection";
import StickyHeader from "../goals/stickyheader";
import { getRangeFactor } from "../utils";
import TrueCost from "./truecost";

interface CalculatorProps {
  calc: any;
  cancelCallback: Function;
}

export interface CalcTypeProps {
  currency: string;
  rangeFactor: number;
  tabOptions: Array<any>;
  tabOptionsHandler: Function;
  resultTabOptions: Array<any>;
  resultTabOptionsHandler: Function;
  resultChartsHandler: Function;
  dr: number;
  drHandler: Function;
  chartFullScreen: boolean;
  cfs: Array<number>;
  cfsHandler: Function;
  showTab: string;
  showTabHandler: Function;
  showResultTab: string;
  showResultTabHandler: Function;
  currentOrder: number;
  allInputDone: boolean;
  nextStepHandler: Function;
}

export const TRUE_COST = "tc";

export default function Calculator({ calc, cancelCallback }: CalculatorProps) {
  const [currency, setCurrency] = useState<string>("USD");
  const [rangeFactor, setRangeFactor] = useState<number>(
    getRangeFactor(currency)
  );
  const [dr, setDR] = useState<number>(5);
  const [currentOrder, setCurrentOrder] = useState<number>(0);
  const [allInputDone, setAllInputDone] = useState<boolean>(false);
  const [tabOptions, setTabOptions] = useState<Array<any>>([]);
  const [resultTabOptions, setResultTabOptions] = useState<Array<any>>([]);
  const [resultCharts, setResultCharts] = useState<Array<any>>([]);
  const [showTab, setShowTab] = useState<string>("");
  const [showResultTab, setShowResultTab] = useState<string>("");
  const [chartFullScreen, setChartFullScreen] = useState<boolean>(false);
  const [cfs, setCFs] = useState<Array<number>>([]);

  const calcTypes: any = {
    TRUE_COST: TrueCost,
  };

  const getCalculator = () => {
    const CalcComp = calcTypes[calc.type];
    return (
      <CalcComp
        currency={currency}
        rangeFactor={rangeFactor}
        tabOptionsHandler={setTabOptions}
        resultTabOptionsHandler={setResultTabOptions}
        resultChartsHandler={setResultCharts}
        dr={dr}
        drHandler={setDR}
        chartFullScreen={chartFullScreen}
        cfs={cfs}
        cfsHandler={setCFs}
      />
    );
  };

  const changeCurrency = (curr: string) => {
    setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(currency)));
    setCurrency(curr);
  };

  const handleNextStep = (count: number = 1) => {
    if (allInputDone || tabOptions.length === 0) return;
    let co = currentOrder + count;
    let label = getTabLabelByOrder(tabOptions, co);
    if (label) setShowTab(label);
    setCurrentOrder(co);
    if (label === tabOptions[tabOptions.length - 1].order + 1)
      setAllInputDone(true);
  };

  useEffect(() => {
    if (tabOptions.length === 0) return;
    setShowTab(tabOptions[0].label);
  }, [tabOptions]);

  useEffect(() => {
    if (resultTabOptions.length === 0) return;
    setShowResultTab(resultTabOptions[0].label);
  }, [resultTabOptions]);

  return (
    <div>
      <StickyHeader cancelCallback={cancelCallback}>
        <h1 className="w-full text-center font-bold mt-4 mb-2 text-lg md:text-xl lg:text-2xl">
          {calc.name}
        </h1>
        <SelectInput
          name="ccy"
          inputOrder={0}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={handleNextStep}
          pre="Currency"
          value={currency}
          changeHandler={changeCurrency}
          currency
        />
      </StickyHeader>
      {tabOptions.length > 0 && (
        <div
          className={`container mx-auto flex flex-1 lg:flex-row ${
            allInputDone && "flex-col-reverse"
          } items-start`}
        >
          <InputSection
            currentOrder={currentOrder}
            allInputDone={allInputDone}
            showTab={showTab}
            showTabHandler={setShowTab}
            tabOptions={tabOptions}
            cancelCallback={cancelCallback}
            handleSubmit={null}
            submitDisabled={false}
            cancelDisabled={false}
          >
            {getCalculator()}
          </InputSection>
        </div>
      )}
      {allInputDone && resultTabOptions.length > 0 && (
        <ResultSection
          resultTabOptions={resultTabOptions}
          showResultTab={showResultTab}
          showResultTabHandler={setShowResultTab}
          chartFullScreenHandler={(fs: boolean) => setChartFullScreen(!fs)}
          result={<div />}
        >
          {resultCharts.map((chart) => chart)}
        </ResultSection>
      )}
    </div>
  );
}
