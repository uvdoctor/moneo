import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import ItemDisplay from './ItemDisplay';
import { isTaxCreditEligible } from '../goals/goalutils';
import { GoalContext } from '../goals/GoalContext';

export default function TaxAdjustment() {
	const { goal, taxRate, maxTaxDeduction, setTaxRate, setMaxTaxDeduction, currency, rangeFactor, pTaxBenefit }: any = useContext(GoalContext);
	return (
		<Section title={`Claim Tax ${isTaxCreditEligible(goal.type) ? 'Credit' : 'Deduction'}`}>
			{!isTaxCreditEligible(goal.type) && (
				<NumberInput
					info="Income Tax slab based on Your Income"
					pre="Tax Rate is "
					min={0}
					max={50}
					step={0.1}
					unit="%"
					value={taxRate}
					changeHandler={setTaxRate}
				/>
			)}
			{(isTaxCreditEligible(goal.type) || taxRate) && (
				<NumberInput
					info={`Maximum Yearly Income Tax ${isTaxCreditEligible(goal.type)
						? 'Credit'
						: 'Deduction'} Allowed`}
					pre="Max Yearly "
					post={`${isTaxCreditEligible(goal.type) ? 'Credit' : 'Deduction'}`}
					currency={currency}
					value={maxTaxDeduction}
					changeHandler={setMaxTaxDeduction}
					min={0}
					max={30000}
					step={1000}
					note={
						<ItemDisplay
							label="Total Tax Benefit"
							result={pTaxBenefit}
							currency={currency}
							footer={`For this Goal`}
						/>
					}
					rangeFactor={rangeFactor}
				/>
			)}
		</Section>
	);
}
