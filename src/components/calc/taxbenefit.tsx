import React from "react";
import NumberInput from "../form/numberinput";
import Section from "../form/section";
import { GoalType } from "../../api/goals";
import ResultItem from "./resultitem";
import { isTaxCreditEligible } from "../goals/goalutils";
interface TaxBenefitProps {
  inputOrder: number;
  currentOrder: number;
  nextStepDisabled: boolean;
  nextStepHandler: Function;
  allInputDone: boolean;
  actionCount?: number;
  goalType: GoalType;
  taxRate: number;
  maxTaxDeduction: number;
  duration: number
  taxRateHandler: Function;
  maxTaxDeductionHandler: Function;
  currency: string;
  rangeFactor: number;
  pTaxBenefit: number
}

export default function TaxBenefit(props: TaxBenefitProps) {

  return (
    <div className="flex w-full justify-around">
      {((!props.allInputDone && props.inputOrder <= props.currentOrder) ||
        props.allInputDone) && (
        <Section
          title={`Claim Tax ${
            isTaxCreditEligible(props.goalType) ? "Credit" : "Deduction"
          }`}
          insideForm
          left={
            !isTaxCreditEligible(props.goalType) ? (
              <NumberInput
                name="tr"
                inputOrder={props.inputOrder}
                currentOrder={props.currentOrder}
                nextStepDisabled={false}
                nextStepHandler={props.nextStepHandler}
                allInputDone={props.allInputDone}
                info="Income Tax slab based on Your Income"
                pre="Tax"
                post="Rate"
                min={0}
                max={50}
                step={0.1}
                unit="%"
                value={props.taxRate}
                changeHandler={props.taxRateHandler}
              />
            ) : (
              !props.allInputDone &&
              props.currentOrder === props.inputOrder &&
              props.nextStepHandler()
            )
          }
          right={
            isTaxCreditEligible(props.goalType) || props.taxRate ? (
              <NumberInput
                inputOrder={props.inputOrder + 1}
                currentOrder={props.currentOrder}
                nextStepDisabled={false}
                nextStepHandler={props.nextStepHandler}
                allInputDone={props.allInputDone}
                info={`Maximum Yearly Income Tax ${
                  isTaxCreditEligible(props.goalType) ? "Credit" : "Deduction"
                } Allowed`}
                name="tbLimit"
                pre="Max Yearly"
                post={`${
                  isTaxCreditEligible(props.goalType) ? "Credit" : "Deduction"
                }`}
                currency={props.currency}
                value={props.maxTaxDeduction}
                changeHandler={props.maxTaxDeductionHandler}
                min={0}
                max={30000}
                step={1000}
                note={
                  <ResultItem
                    label="Total Tax Benefit"
                    result={props.pTaxBenefit}
                    currency={props.currency}
                    footer={`For this Goal`}
                  />
                }
                rangeFactor={props.rangeFactor}
                width="100px"
              />
            ) : (
              !props.allInputDone &&
              props.currentOrder === props.inputOrder + 1 &&
              props.nextStepHandler()
            )
          }
        />
      )}
    </div>
  );
}
