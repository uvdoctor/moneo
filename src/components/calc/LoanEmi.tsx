import React, { useState, useEffect, Fragment } from "react";
import NumberInput from "../form/numberinput";
import { getEmi, getTotalInt } from "./finance";
import { toCurrency, toStringArr, initYearOptions } from "../utils";
import SelectInput from "../form/selectinput";
import RadialInput from "../form/radialinput";
import Section from "../form/section";
import ExpandCollapse from "../form/expandcollapse";
import {
  getLoanPaidForMonths,
  adjustAccruedInterest,
  createEduLoanDPWithSICFs,
} from "../goals/cfutils";
import HToggle from "../horizontaltoggle";
import { GoalType } from "../../api/goals";
import ItemDisplay from "./ItemDisplay";
import { COLORS } from "../../CONSTANTS";
import { isTaxCreditEligible } from "../goals/goalutils";
interface LoanEmiProps {
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
  loanSICapitalize: number | undefined | null;
  loanGracePeriod: number | undefined | null;
  loanBorrowAmt: number;
  taxBenefitInt: number;
  maxTaxDeductionInt: number;
  taxRate: number;
  iTaxBenefit: number;
  goalType: GoalType;
  repaymentSYHandler: Function;
  loanMonthsHandler: Function;
  loanPerHandler: Function;
  loanSIPayPerHandler: Function;
  loanSICapitalizeHandler: Function;
  loanGracePeriodHandler: Function;
  loanAnnualIntHandler: Function;
  taxBenefitIntHandler: Function;
  maxTaxDeductionIntHandler: Function;
}

export default function LoanEmi(props: LoanEmiProps) {
  const [totalIntAmt, setTotalIntAmt] = useState<number>(0);
  const [ryOptions, setRYOptions] = useState(
    initYearOptions(
      props.goalType === GoalType.E ? props.endYear + 1 : props.startYear,
      10
    )
  );
  const [emi, setEMI] = useState<number>(0);
  const [simpleInts, setSimpleInts] = useState<Array<number>>([]);
  const [remIntAmt, setRemIntAmt] = useState<number>(0);
  const loanLimitPer = props.goalType === GoalType.E ? 100 : 80;

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
        props.loanSIPayPer as number,
        (props.loanSICapitalize as number) < 1
      );
      borrowAmt = result.borrowAmt;
      simpleInts = result.ints;
      setRemIntAmt(Math.round(result.remIntAmt));
      setSimpleInts([...simpleInts]);
    }
    borrowAmt = adjustAccruedInterest(
      borrowAmt,
      props.goalType === GoalType.E ? props.endYear + 1 : props.startYear,
      props.repaymentSY,
      props.loanAnnualInt
    );
    let loanPaidForMonths = getLoanPaidForMonths(
      props.startYear + props.duration - 1,
      props.repaymentSY,
      props.loanYears
    );
    let emi = getEmi(
      borrowAmt,
      props.loanAnnualInt,
      props.loanYears * 12
    ) as number;
    setEMI(Math.round(emi));
    let totalSimpleIntAmt = 0;
    simpleInts.forEach((int) => (totalSimpleIntAmt += int));
    let totalIntAmt = 0;
    if (props.goalType !== GoalType.B) {
      totalIntAmt =
        emi * loanPaidForMonths +
        totalSimpleIntAmt +
        remIntAmt -
        props.loanBorrowAmt;
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

  useEffect(() => {
    if (
      props.goalType === GoalType.E &&
      props.taxRate &&
      props.taxBenefitInt < 1
    )
      props.taxBenefitIntHandler(1);
  }, [props.taxRate]);

  return (
    <div className="flex w-full justify-around">
      {(props.allInputDone || props.inputOrder <= props.currentOrder) && (
        <Section
          title="Loan Details"
          insideForm
          videoSrc={`https://www.youtube.com/watch?v=NuJdxuIsYl4&t=320s`}
          toggle={
            !isTaxCreditEligible(props.goalType) && props.taxRate ? (
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
              data={toStringArr(0, loanLimitPer, 5)}
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
                <div
                  className={`${
                    props.goalType === GoalType.E ? "mt-2" : "mt-4"
                  }`}
                >
                  <NumberInput
                    name="duration"
                    inputOrder={props.inputOrder + 2}
                    currentOrder={props.currentOrder}
                    nextStepDisabled={false}
                    nextStepHandler={props.nextStepHandler}
                    allInputDone={props.allInputDone}
                    pre="Term"
                    unit="years"
                    note={`Monthly ${toCurrency(emi, props.currency)}`}
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
                    /*feedback={{
                      0: {
                        label: (
                          <Tooltip
                            text="YAY!!!"
                            info={`It is ideal to get a loan with interest rate lesser than what You can earn from Your Investment with Minimal Risk. 
                            As it is Very Easy for Your Investment to recover this Yearly Interest with Minimal Risk, this is an Excellent Deal!`}
                            color={COLORS.GREEN}
                          />
                        ),
                        color: COLORS.GREEN,
                      },
                      1: {
                        label: (
                          <Tooltip
                            text="CHEAP"
                            info={`It is ideal to get a loan with interest rate lesser than what You can earn from Your Investment with Minimal Risk. 
                            As it is Easy for Your Investment to recover this Yearly Interest with Minimal Risk, this is a Good Deal!`}
                            color={COLORS.BLUE}
                          />
                        ),
                        color: COLORS.BLUE,
                      },
                      3.5: { label: "", color: "" },
                      8: {
                        label: (
                          <Tooltip
                            text="COSTLY"
                            info={`It is ideal to get a loan with interest rate lesser than what You can earn from Your Investment with Minimal Risk. 
                            As it is Difficult for Your Investment to recover this Yearly Interest even with High Risk, this is an Expensive Loan!`}
                            color="#dd6b20"
                            error
                          />
                        ),
                        color: "#dd6b20",
                      },
                      10: {
                        label: (
                          <Tooltip
                            text="COSTLY!!!"
                            info={`It is ideal to get a loan with interest rate lesser than what You can earn from Your Investment with Minimal Risk. 
                            As it is Very Difficult for Your Investment to recover this Yearly Interest even with Very High Risk, 
                            this is a Very Expensive Loan!!!`}
                            color={COLORS.RED}
                            error
                          />
                        ),
                        color: COLORS.RED,
                      },
                    }}*/
                    note={
                      <ItemDisplay
                        label="Total Interest"
                        result={totalIntAmt}
                        currency={props.currency}
                        footer={`Over ${getLoanPaidForMonths(
                          props.startYear + props.duration - 1,
                          props.repaymentSY,
                          props.loanYears
                        ) / 12} Years`}
                      />
                    }
                    value={props.loanAnnualInt}
                    changeHandler={props.loanAnnualIntHandler}
                    min={0.0}
                    max={25.0}
                    step={0.1}
                  />
                </div>
                {props.goalType === GoalType.E &&
                  (props.allInputDone ||
                    props.currentOrder === props.inputOrder + 4) && (
                    <Fragment>
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
                              <div className="flex flex-col justify-center w-full">
                                <ExpandCollapse title="Interest Schedule">
                                  {simpleInts.map((int, i) => (
                                    <p key={"si" + i} className="text-gray-800">
                                      Monthly{" "}
                                      {toCurrency(
                                        Math.round(int / 12),
                                        props.currency
                                      )}{" "}
                                      in {props.startYear + i}
                                    </p>
                                  ))}
                                </ExpandCollapse>
                              </div>
                            )
                          }
                        />
                      </div>
                      {!Number.isNaN(props.loanSIPayPer) && //@ts-ignore
                        props.loanSIPayPer < 100 && (
                          <div className="mt-2">
                            <HToggle
                              rightText={`Pay ${toCurrency(
                                remIntAmt,
                                props.currency
                              )} in ${props.endYear + 1}`}
                              value={props.loanSICapitalize as number}
                              setter={props.loanSICapitalizeHandler}
                            />
                          </div>
                        )}
                    </Fragment>
                  )}
                {props.taxRate &&
                props.taxBenefitInt &&
                !isTaxCreditEligible(props.goalType) ? (
                  <div className="mt-4">
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
                        <ItemDisplay
                          label="Total Interest Tax Benefit"
                          result={props.iTaxBenefit}
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
