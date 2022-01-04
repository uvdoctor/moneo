import React, { useContext, useEffect } from 'react';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import { FIGoalContext } from './FIGoalContext';

export function AfterFI() {
	const {
		currency,
		setEndYear
	}: any = useContext(CalcContext);
	const {
		expenseAfterFF,
		setExpenseAfterFF,
		expenseChgRate,
		setExpenseChgRate,
		taxRate,
		setTaxRate
	}: any = useContext(FIGoalContext);
	const nowYear = new Date().getFullYear();

	useEffect(
		() => {
			setEndYear(nowYear);
		},
		[ expenseAfterFF ]
	);

	return (
		<Section title="After Financial Independence">
			<NumberInput
				info="Today's yearly cost for living the desired lifestyle after achieving financial independence."
				pre="Desired lifestyle costs"
				post="yearly in today's money"
				currency={currency}
				value={expenseAfterFF}
				changeHandler={setExpenseAfterFF}
				min={1000}
				max={50000}
				step={100}
			/>
			<NumberInput
				info="Rate at which your living expenses increase every year."
				pre="Expense increases"
				unit="% yearly"
				min={0}
				max={10}
				step={0.1}
				value={expenseChgRate}
				changeHandler={setExpenseChgRate}
			/>
			<NumberInput
				info="Applicable tax rate, in case you have to pay capital gains tax or income tax for withdrawing from retirement accounts beyond the allowed yearly limit."
				pre="Tax rate"
				min={0}
				max={30}
				step={0.1}
				value={taxRate}
				changeHandler={setTaxRate}
				unit="%"
			/>
		</Section>
	);
}
