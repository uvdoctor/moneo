import React from "react";
import NumberInput from "../form/numberinput";
import Section from "../form/section";
interface ExpenseAfterFFProps {
  inputOrder: number;
  currentOrder: number;
  allInputDone: boolean;
  nextStepHandler: Function;
  currency: string;
  rangeFactor: number;
  expenseAfterFF: number;
  expenseAfterFFHandler: Function;
  expenseChgRate: number;
  expenseChgRateHandler: Function;
  taxRate: number;
  taxRateHandler: Function;
}

export function ExpenseAfterFF({
  inputOrder,
  currentOrder,
  allInputDone,
  nextStepHandler,
  currency,
  rangeFactor,
  expenseAfterFF,
  expenseAfterFFHandler,
  expenseChgRate,
  expenseChgRateHandler,
  taxRate,
  taxRateHandler,
}: ExpenseAfterFFProps) {
  return (
    <Section
      title="After Financial Freedom"
      left={
        <NumberInput
          name="currExpense"
          inputOrder={inputOrder}
          currentOrder={currentOrder}
          nextStepDisabled={expenseAfterFF < 5000}
          allInputDone={allInputDone}
          nextStepHandler={nextStepHandler}
          info="If You had already achieved Financial Freedom this year, How Much Money Would You Need for Your Living Expenses?"
          pre="Yearly"
          post="Expenses"
          note="In Today's Money"
          currency={currency}
          rangeFactor={rangeFactor}
          value={expenseAfterFF}
          changeHandler={expenseAfterFFHandler}
          min={0}
          max={50000}
          step={100}
          width="120px"
        />
      }
      right={
        <NumberInput
          name="expChgRate"
          inputOrder={inputOrder + 1}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={nextStepHandler}
          info="Rate at which Your Living Expenses increase every Year."
          pre="Expense"
          post="Increases"
          note="Yearly"
          unit="%"
          min={0}
          max={10}
          step={0.1}
          value={expenseChgRate}
          changeHandler={expenseChgRateHandler}
        />
      }
      bottom={
        <NumberInput
          name="tr"
          inputOrder={inputOrder + 2}
          currentOrder={currentOrder}
          nextStepDisabled={false}
          allInputDone={allInputDone}
          nextStepHandler={nextStepHandler}
          info="Tax Rate, in case You have to pay tax for Investment Gains and Withdrawing from Retirement Accounts beyond the allowed Yearly Limit."
          pre="Tax"
          post="Rate"
          min={0}
          max={20}
          step={0.1}
          value={taxRate}
          changeHandler={taxRateHandler}
          unit="%"
        />
      }
      insideForm
    />
  );
}
