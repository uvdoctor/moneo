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
		<>
		<Section title={`Claim Tax ${isTaxCreditEligible(goal.type) ? 'Credit' : 'Deduction'}`}>
			{!isTaxCreditEligible(goal.type) && (
				<NumberInput
					info="Income tax rate applicable based on your income"
					pre="Applicable tax rate"
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
					info={`Maximum yearly ${isTaxCreditEligible(goal.type)
						? 'credit'
						: 'deduction'} allowed`}
					pre={`Max yearly ${loanBorrowAmt && manualMode < 1 ? 'principal' : ''} ${isTaxCreditEligible(
						goal.type
					)
						? 'credit'
						: 'deduction'}`}
					currency={currency}
					value={maxTaxDeduction}
					changeHandler={setMaxTaxDeduction}
					max={30000}
					step={10}
				/>
			)}
			{totalPTaxBenefit && 
				<ItemDisplay
					label={`Total ${loanBorrowAmt && manualMode < 1 ? 'principal related' : ''} tax benefit`}
					result={totalPTaxBenefit}
					currency={currency}
					footer={`${startYear} to ${startYear + duration - 1}`}
				/>
			}
		</Section>
		{taxRate && loanBorrowAmt && goal.type !== GoalType.E && !isTaxCreditEligible(goal.type) ? 
			<Section title="Interest tax deduction" toggle={
				<HSwitch rightText="" value={taxBenefitInt} setter={setTaxBenefitInt} />
			}>
				{taxBenefitInt && <NumberInput
					pre="Max yearly deduction allowed"
					value={maxTaxDeductionInt}
					changeHandler={setMaxTaxDeductionInt}
					currency={currency}
					max={30000}
					step={10}
				/>}
				{taxBenefitInt && totalITaxBenefit && 
					<ItemDisplay
					label="Total interest related tax benefit"
					result={totalITaxBenefit}
					currency={currency}
					footer={`${startYear} to ${startYear + duration - 1}`}
				/>}
		</Section> : null}
		</>
	);
}
