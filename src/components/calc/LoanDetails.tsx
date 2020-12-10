import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import { toReadableNumber } from '../utils';
import SelectInput from '../form/selectinput';
import Section from '../form/section';
import ItemDisplay from './ItemDisplay';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import { GoalType } from '../../api/goals';
import LoanInterest from './LoanInterest';
import LoanAdvOptions from './LoanAdvOptions';

export default function LoanDetails() {
	const { goal, currency }: any = useContext(CalcContext);
	const {
		loanRepaymentMonths,
		loanMonths,
		loanPer,
		setLoanPer,
		setLoanMonths,
		setLoanRepaymentMonths,
		isEndYearHidden,
		loanBorrowAmt,
		emi,
	}: any = useContext(GoalContext);

	const loanLimitPer = goal.type === GoalType.E ? 100 : 90;

	return (
		<Section title="Loan Details" videoSrc={`https://www.youtube.com/watch?v=NuJdxuIsYl4&t=320s`}>
			{!isEndYearHidden && (
				<NumberInput
					unit="%"
					pre="Cost % to be Borrowed"
					value={loanPer}
					changeHandler={setLoanPer}
					step={1}
					min={0}
					max={loanLimitPer}
					additionalMarks={[ 20, 50, 70 ]}
				/>
			)}
			<ItemDisplay
				label="Loan Amount"
				result={loanBorrowAmt}
				currency={currency}
				footer={
					<SelectInput
						pre="Repayment Delay"
						options={{
							0: 'No Delay',
							1: '1 Month',
							2: '2 Months',
							3: '3 Months'
						}}
						value={loanRepaymentMonths}
						changeHandler={(months: string) => setLoanRepaymentMonths(parseInt(months))}
					/>
				}
			/>
			{loanBorrowAmt && (
				<NumberInput
					pre="Loan Duration"
					unit={`Months (${toReadableNumber(loanMonths / 12, 2)} Years)`}
					value={loanMonths}
					changeHandler={setLoanMonths}
					min={6}
					max={360}
					step={1}
					additionalMarks={[ 60, 120, 180, 240 ]}
				/>
			)}
			{loanBorrowAmt && <LoanInterest />}
			{loanBorrowAmt && <ItemDisplay label="Monthly Installment" result={emi} currency={currency} decimal={2} />}
			{emi && <LoanAdvOptions />}
		</Section>
	);
}
