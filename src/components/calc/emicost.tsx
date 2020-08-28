import React, { useState, useEffect } from "react";
import NumberInput from "../form/numberinput";
import { getEmi, getTotalInt } from "../calc/finance";
import { toCurrency, toStringArr, initYearOptions } from "../utils";
import SelectInput from "../form/selectinput";
import RadialInput from "../form/radialinput";
import Section from "../form/section";
import {
  getLoanPaidForMonths,
  calculateInterestTaxBenefit, adjustAccruedInterest
} from "../goals/cfutils";
import HToggle from "../horizontaltoggle";
import { GoalType } from "../../api/goals";
interface EmiProps {
  inputOrder: number;
  currentOrder: number;
  nextStepDisabled: boolean;
  nextStepHandler: Function;
  allInputDone: boolean;
  price: number;
  currency: string;
  rangeFactor: number;
  startYear: number;
  endYear: number;
  duration: number;
  repaymentSY: number;
  loanYears: number;
  loanAnnualInt: number;
  loanPer: number;
  loanBorrowAmt: number;
  taxBenefitInt: number;
  maxTaxDeductionInt: number;
  taxRate: number;
  goalType: GoalType;
  repaymentSYHandler: Function;
  loanMonthsHandler: Function;
  loanPerHandler: Function;
  loanAnnualIntHandler: Function;
  taxBenefitIntHandler: Function;
  maxTaxDeductionIntHandler: Function;
}

export default function EmiCost(props: EmiProps) {
  const [totalIntAmt, setTotalIntAmt] = useState<number>(0);
  const [totalIntTaxBenefit, setTotalIntTaxBenefit] = useState<number>(0);
  const [ryOptions, setRYOptions] = useState(
    initYearOptions(props.startYear, 10)
  );
  const [emi, setEMI] = useState<number>(0);

  const calculateEmi = () => {
    let borrowAmt = adjustAccruedInterest(props.loanBorrowAmt, props.startYear, 
        props.repaymentSY, props.loanAnnualInt)   
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
    let totalIntAmt = getTotalInt(
      borrowAmt,
      emi,
      props.loanAnnualInt,
      loanPaidForMonths
    );
    setTotalIntAmt(Math.round(totalIntAmt));
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
      setTotalIntTaxBenefit(Math.round(intTaxBenefit));
    } else setTotalIntTaxBenefit(0);
  };

  useEffect(() => calculateEmi(), [props]);

  useEffect(() => {
    setRYOptions(initYearOptions(props.startYear, 10));
  }, [props.startYear]);

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
                  note={`Total ${toCurrency(totalIntAmt, props.currency)}`}
                  value={props.loanAnnualInt}
                  changeHandler={props.loanAnnualIntHandler}
                  min={0.0}
                  max={25.0}
                  step={0.1}
                />
                {props.taxRate ? (
                  <NumberInput
                    name="maxTaxDeductionInt"
                    inputOrder={props.inputOrder + 4}
                    currentOrder={props.currentOrder}
                    nextStepDisabled={false}
                    nextStepHandler={props.nextStepHandler}
                    allInputDone={props.allInputDone}
                    pre="Max Yearly"
                    post="Deduction"
                    rangeFactor={props.rangeFactor}
                    value={props.maxTaxDeductionInt}
                    changeHandler={props.maxTaxDeductionIntHandler}
                    currency={props.currency}
                    min={0}
                    max={50000}
                    step={1000}
                    note={`Total ${toCurrency(
                      totalIntTaxBenefit,
                      props.currency
                    )}`}
                    width="100px"
                  />
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
