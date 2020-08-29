import React, { useState, useEffect } from "react";
import NumberInput from "../form/numberinput";
import { getEmi, getTotalInt } from "../calc/finance";
import { toCurrency, toStringArr, initYearOptions } from "../utils";
import SelectInput from "../form/selectinput";
import RadialInput from "../form/radialinput";
import Section from "../form/section";
import ExpandCollapse from "../form/expandcollapse";
import {
  getLoanPaidForMonths,
  calculateInterestTaxBenefit,
  adjustAccruedInterest,
  createEduLoanDPWithSICFs,
  getTaxBenefit,
} from "../goals/cfutils";
import HToggle from "../horizontaltoggle";
import { GoalType } from "../../api/goals";
import ResultItem from "./resultitem";
import { COLORS } from "../../CONSTANTS";
interface EmiProps {
  inputOrder: number;
  currentOrder: number;
  nextStepDisabled: boolean;
  nextStepHandler: Function;
  allInputDone: boolean;
  price: number;
  priceChgRate: number;
  currency: string;
  rangeFactor: number;
  startYear: number;
  endYear: number;
  duration: number;
  repaymentSY: number;
  loanYears: number;
  loanAnnualInt: number;
  loanPer: number;
  loanSIPayPer: number | undefined | null;
  loanBorrowAmt: number;
  taxBenefitInt: number;
  maxTaxDeductionInt: number;
  taxRate: number;
  goalType: GoalType;
  repaymentSYHandler: Function;
  loanMonthsHandler: Function;
  loanPerHandler: Function;
  loanSIPayPerHandler: Function;
  loanAnnualIntHandler: Function;
  taxBenefitIntHandler: Function;
  maxTaxDeductionIntHandler: Function;
}

export default function EmiCost(props: EmiProps) {
  const [totalIntAmt, setTotalIntAmt] = useState<number>(0);
  const [totalIntTaxBenefit, setTotalIntTaxBenefit] = useState<number>(0);
  const [ryOptions, setRYOptions] = useState(
    initYearOptions(
      props.goalType === GoalType.E ? props.endYear + 1 : props.startYear,
      10
    )
  );
  const [emi, setEMI] = useState<number>(0);
  const [simpleInts, setSimpleInts] = useState<Array<number>>([]);
  const [showIntSchedule, setShowIntSchedule] = useState<boolean>(false);

  const calculateEmi = () => {
    let borrowAmt = props.loanBorrowAmt;
    let simpleInts: Array<number> = [];
    if (props.goalType === GoalType.E) {
      let result = createEduLoanDPWithSICFs(
        props.price,
        props.priceChgRate,
        props.loanPer,
        props.startYear,
        props.endYear,
        props.loanAnnualInt,
        props.loanSIPayPer as number
      );
      borrowAmt = result.borrowAmt;
      simpleInts = result.ints;
      setSimpleInts([...simpleInts]);
    }
    borrowAmt = adjustAccruedInterest(
      borrowAmt,
      props.goalType === GoalType.E ? props.endYear + 1 : props.startYear,
      props.repaymentSY,
      props.loanAnnualInt
    );
    let loanPaidForMonths = getLoanPaidForMonths(
      props.endYear,
      props.repaymentSY,
      props.loanYears,
      props.goalType
    );
    let emi = getEmi(
      borrowAmt,
      props.loanAnnualInt,
      props.loanYears * 12
    ) as number;
    setEMI(Math.round(emi));
    if (props.taxBenefitInt > 0) {
      let intTaxBenefit = calculateInterestTaxBenefit(
        borrowAmt,
        props.loanAnnualInt,
        props.loanYears,
        props.repaymentSY,
        props.startYear,
        props.duration,
        props.taxRate,
        props.maxTaxDeductionInt
      );
      let simpleTaxBenefit = 0;
      simpleInts.forEach(
        (int) =>
          (simpleTaxBenefit += getTaxBenefit(
            int,
            props.taxRate,
            props.maxTaxDeductionInt
          ))
      );
      setTotalIntTaxBenefit(Math.round(intTaxBenefit + simpleTaxBenefit));
    } else setTotalIntTaxBenefit(0);
    let totalSimpleIntAmt = 0;
    simpleInts.forEach((int) => (totalSimpleIntAmt += int));
    let totalIntAmt = 0;
    if (props.goalType !== GoalType.B) {
      totalIntAmt =
        emi * loanPaidForMonths + totalSimpleIntAmt - props.loanBorrowAmt;
    } else
      totalIntAmt = getTotalInt(
        borrowAmt,
        emi,
        props.loanAnnualInt,
        loanPaidForMonths
      );
    setTotalIntAmt(Math.round(totalIntAmt));
  };

  useEffect(() => calculateEmi(), [props]);

  useEffect(() => {
    setRYOptions(
      initYearOptions(
        props.goalType === GoalType.E ? props.endYear + 1 : props.startYear,
        10
      )
    );
  }, [props.startYear, props.endYear]);

  return (
    <div className="flex w-full justify-around">
      {(props.allInputDone || props.inputOrder <= props.currentOrder) && (
        <Section
          title="Loan Details"
          insideForm
          toggle={
            props.taxRate ? (
              <HToggle
                rightText="Claim Interest Tax Deduction"
                value={props.taxBenefitInt}
                setter={props.taxBenefitIntHandler}
              />
            ) : (
              <div />
            )
          }
          left={
            <RadialInput
              inputOrder={props.inputOrder}
              currentOrder={props.currentOrder}
              nextStepDisabled={false}
              nextStepHandler={props.nextStepHandler}
              allInputDone={props.allInputDone}
              width={120}
              unit="%"
              data={toStringArr(0, 80, 5)}
              value={props.loanPer}
              changeHandler={props.loanPerHandler}
              step={5}
              labelBottom={true}
              label="of Amount"
              pre="Principal"
              post={`${toCurrency(props.loanBorrowAmt, props.currency)}`}
            />
          }
          right={
            props.loanBorrowAmt ? (
              <div className="flex flex-col">
                <SelectInput
                  name="repaymentSY"
                  inputOrder={props.inputOrder + 1}
                  currentOrder={props.currentOrder}
                  nextStepDisabled={false}
                  nextStepHandler={props.nextStepHandler}
                  allInputDone={props.allInputDone}
                  options={ryOptions}
                  value={props.repaymentSY}
                  pre="Repay From"
                  post="Onwards"
                  changeHandler={(year: string) =>
                    props.repaymentSYHandler(parseInt(year))
                  }
                />
                <div className="mt-4">
                  <NumberInput
                    name="duration"
                    inputOrder={props.inputOrder + 2}
                    currentOrder={props.currentOrder}
                    nextStepDisabled={false}
                    nextStepHandler={props.nextStepHandler}
                    allInputDone={props.allInputDone}
                    pre="Term"
                    unit="years"
                    note={`EMI ${toCurrency(emi, props.currency)}`}
                    value={props.loanYears}
                    changeHandler={props.loanMonthsHandler}
                    min={0.5}
                    max={30}
                    step={0.5}
                  />
                </div>
              </div>
            ) : (
              !props.allInputDone &&
              props.currentOrder === props.inputOrder + 1 &&
              props.nextStepHandler(2)
            )
          }
          bottom={
            props.loanBorrowAmt ? (
              <div className="flex flex-wrap justify-around items-center w-full">
                <div className="mt-2">
                  <NumberInput
                    name="intRate"
                    inputOrder={props.inputOrder + 3}
                    currentOrder={props.currentOrder}
                    nextStepDisabled={false}
                    nextStepHandler={props.nextStepHandler}
                    allInputDone={props.allInputDone}
                    pre="Yearly"
                    post="Interest"
                    unit="%"
                    feedback={{
                      0: {label: "YAY!!!", color: COLORS.GREEN},
                      1: {label: "CHEAP", color: "#3182ce"},
                      3.5: {label: "", color: ""},
                      8: {label: "COSTLY", color: "#dd6b20"},
                      10: {label: "COSTLY!!!", color: COLORS.RED} 
                    }}
                    note={
                      <ResultItem
                        label="Total Interest"
                        result={totalIntAmt}
                        currency={props.currency}
                        footer={`Over ${props.duration} Years`}
                      />
                    }
                    value={props.loanAnnualInt}
                    changeHandler={props.loanAnnualIntHandler}
                    min={0.0}
                    max={25.0}
                    step={0.1}
                  />
                </div>
                {props.goalType === GoalType.E && (
                  <div className="mt-2">
                    <RadialInput
                      inputOrder={props.inputOrder}
                      currentOrder={props.currentOrder}
                      nextStepDisabled={false}
                      nextStepHandler={props.nextStepHandler}
                      allInputDone={props.allInputDone}
                      width={120}
                      unit="%"
                      data={toStringArr(0, 100, 5)}
                      value={props.loanSIPayPer as number}
                      changeHandler={props.loanSIPayPerHandler}
                      step={5}
                      labelBottom
                      colorFrom={COLORS.RED}
                      colorTo={COLORS.GREEN}
                      pre="Pay While Studying"
                      label="of Interest"
                      post={
                        !!props.loanSIPayPer && (
                          <div className="flex flex-col cursor-pointer text-blue-600 justify-center w-full">
                            <ExpandCollapse
                              title="Interest Schedule"
                              value={showIntSchedule}
                              handler={setShowIntSchedule}
                            />
                            {showIntSchedule &&
                              simpleInts.map((int, i) => (
                                <p key={"si" + i} className="text-gray-800">
                                  Monthly{" "}
                                  {toCurrency(
                                    Math.round(int / 12),
                                    props.currency
                                  )}{" "}
                                  in {props.startYear + i}
                                </p>
                              ))}
                          </div>
                        )
                      }
                    />
                  </div>
                )}
                {props.taxRate && props.taxBenefitInt ? (
                  <div className="mt-2">
                    <NumberInput
                      name="maxTaxDeductionInt"
                      inputOrder={props.inputOrder + 4}
                      currentOrder={props.currentOrder}
                      nextStepDisabled={false}
                      nextStepHandler={props.nextStepHandler}
                      allInputDone={props.allInputDone}
                      pre="Max Interest"
                      post="Deduction"
                      rangeFactor={props.rangeFactor}
                      value={props.maxTaxDeductionInt}
                      changeHandler={props.maxTaxDeductionIntHandler}
                      currency={props.currency}
                      min={0}
                      max={30000}
                      step={1000}
                      note={
                        <ResultItem
                          label="Total Tax Benefit"
                          result={totalIntTaxBenefit}
                          currency={props.currency}
                          footer={`Over ${props.duration} Years`}
                        />
                      }
                      width="100px"
                    />
                  </div>
                ) : (
                  !props.allInputDone &&
                  props.currentOrder === props.inputOrder + 4 &&
                  props.nextStepHandler()
                )}
              </div>
            ) : (
              !props.allInputDone &&
              props.currentOrder === props.inputOrder + 3 &&
              props.nextStepHandler(2)
            )
          }
        />
      )}
    </div>
  );
}
