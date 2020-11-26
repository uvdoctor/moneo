import React, { useContext, useEffect } from 'react';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import { FIGoalContext } from './FIGoalContext';

export function AfterFI() {
	const {
		currency,
	}: any = useContext(CalcContext);
	const {
		expenseAfterFF,
		setExpenseAfterFF,
		expenseChgRate,
		setExpenseChgRate,
		taxRate,
		setTaxRate,
		setExpenseBY
	}: any = useContext(FIGoalContext);
	const nowYear = new Date().getFullYear();

	useEffect(
		() => {
			setExpenseBY(nowYear);
		},
		[ expenseAfterFF ]
	);

	return (
		<Section title="After Financial Independence">
			<NumberInput
				info="If You had already achieved Financial Independence this year, How Much Money Would You Need for Your Living Expenses?"
				pre="Yearly Expenses in today's money"
				currency={currency}
				value={expenseAfterFF}
				changeHandler={setExpenseAfterFF}
				min={10000}
				max={50000}
				step={100}
			/>
			<NumberInput
				info="Rate at which Your Living Expenses increase every Year."
				pre="Yearly Expense Increases"
				unit="%"
				min={0}
				max={10}
				step={0.1}
				value={expenseChgRate}
				changeHandler={setExpenseChgRate}
			/>
			<NumberInput
				info="Tax Rate, in case You have to pay tax for Investment Gains and Withdrawing from Retirement Accounts beyond the allowed Yearly Limit."
				pre="Tax"
				post="Rate"
				min={0}
				max={20}
				step={0.1}
				value={taxRate}
				changeHandler={setTaxRate}
				unit="%"
			/>
		</Section>
	);
}
