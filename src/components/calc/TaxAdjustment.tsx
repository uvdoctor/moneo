import React, { useContext, useEffect } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import ItemDisplay from './ItemDisplay';
import { isTaxCreditEligible } from '../goals/goalutils';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import HSwitch from '../HSwitch';
import { GoalType } from '../../api/goals';

export default function TaxAdjustment() {
	const { goal, currency, startYear }: any = useContext(CalcContext);
	const {
		duration,
		taxRate,
		maxTaxDeduction,
		setTaxRate,
		setMaxTaxDeduction,
		totalPTaxBenefit,
		maxTaxDeductionInt,
		setMaxTaxDeductionInt,
		totalITaxBenefit,
		loanBorrowAmt,
		manualMode,
		taxBenefitInt,
		setTaxBenefitInt
	}: any = useContext(GoalContext);

	useEffect(
		() => {
			if (goal.type === GoalType.E && taxRate && taxBenefitInt < 1) setTaxBenefitInt(1);
		},
		[ taxRate ]
	);

	return (
		<Section title={`Claim Tax ${isTaxCreditEligible(goal.type) ? 'Credit' : 'Deduction'}`}>
			{!isTaxCreditEligible(goal.type) && (
				<NumberInput
					info="Marginal Income Tax slab based on Your Income"
					pre="Marginal Tax Rate"
					min={0}
					max={50}
					step={0.1}
					unit="%"
					value={taxRate}
					changeHandler={setTaxRate}
				/>
			)}
			{(isTaxCreditEligible(goal.type) || taxRate) && goal.type !== GoalType.E && (
				<NumberInput
					info={`Maximum Yearly Income Tax ${isTaxCreditEligible(goal.type)
						? 'Credit'
						: 'Deduction'} Allowed`}
					pre={`Max Yearly ${loanBorrowAmt && manualMode < 1 ? 'Loan Principal' : ''} ${isTaxCreditEligible(
						goal.type
					)
						? 'Credit'
						: 'Deduction'}`}
					currency={currency}
					value={maxTaxDeduction}
					changeHandler={setMaxTaxDeduction}
					min={0}
					max={30000}
					step={1000}
					post={
						<ItemDisplay
							label={`Total ${loanBorrowAmt && manualMode < 1 ? 'Loan Principal' : ''} Tax Benefit`}
							result={totalPTaxBenefit}
							currency={currency}
							footer={`${startYear} to ${startYear + duration - 1}`}
						/>
					}
				/>
			)}
			{!isTaxCreditEligible(goal.type) && goal.type !== GoalType.E &&
			taxRate &&
			loanBorrowAmt && (
				<HSwitch rightText="Claim Loan Interest Tax Deduction" value={taxBenefitInt} setter={setTaxBenefitInt} />
			)}
			{!isTaxCreditEligible(goal.type) &&
			taxRate &&
			loanBorrowAmt &&
			taxBenefitInt && (
				<NumberInput
					pre="Max Yearly Loan Interest Deduction"
					value={maxTaxDeductionInt}
					changeHandler={setMaxTaxDeductionInt}
					currency={currency}
					min={0}
					max={30000}
					step={1000}
					post={
						<ItemDisplay
							label="Total Loan Interest Tax Benefit"
							result={totalITaxBenefit}
							currency={currency}
							footer={`${startYear} to ${startYear + duration - 1}`}
						/>
					}
				/>
			)}
		</Section>
	);
}
