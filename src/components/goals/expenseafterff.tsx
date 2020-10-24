import React, { useEffect } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
interface ExpenseAfterFFProps {
	currency: string;
	rangeFactor: number;
	expenseAfterFF: number;
	expenseAfterFFHandler: Function;
	expenseChgRate: number;
	expenseChgRateHandler: Function;
	taxRate: number;
	taxRateHandler: Function;
	expenseBYHandler: Function;
}

export function ExpenseAfterFF({
	currency,
	rangeFactor,
	expenseAfterFF,
	expenseAfterFFHandler,
	expenseChgRate,
	expenseChgRateHandler,
	taxRate,
	taxRateHandler,
	expenseBYHandler
}: ExpenseAfterFFProps) {
	const nowYear = new Date().getFullYear();

	useEffect(
		() => {
			expenseBYHandler(nowYear);
		},
		[ expenseAfterFF ]
	);

	return (
		<Section title="After Financial Independence">
			<NumberInput
				info="If You had already achieved Financial Independence this year, How Much Money Would You Need for Your Living Expenses?"
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
			/>
			<NumberInput
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
			<NumberInput
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
		</Section>
	);
}
