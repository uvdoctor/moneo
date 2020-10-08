import React from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import { GoalType } from '../../api/goals';
import ItemDisplay from './ItemDisplay';
import { isTaxCreditEligible } from '../goals/goalutils';
interface TaxAdjustmentProps {
	goalType: GoalType;
	taxRate: number;
	maxTaxDeduction: number;
	duration: number;
	taxRateHandler: Function;
	maxTaxDeductionHandler: Function;
	currency: string;
	rangeFactor: number;
	pTaxBenefit: number;
}

export default function TaxAdjustment(props: TaxAdjustmentProps) {
	return (
		<Section
			title={`Claim Tax ${isTaxCreditEligible(props.goalType) ? 'Credit' : 'Deduction'}`}
			insideForm
			left={
				!isTaxCreditEligible(props.goalType) && (
					<NumberInput
						name="tr"
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
				)
			}
			right={
				isTaxCreditEligible(props.goalType) ||
				(props.taxRate && (
					<NumberInput
						info={`Maximum Yearly Income Tax ${isTaxCreditEligible(props.goalType)
							? 'Credit'
							: 'Deduction'} Allowed`}
						name="tbLimit"
						pre="Max Yearly"
						post={`${isTaxCreditEligible(props.goalType) ? 'Credit' : 'Deduction'}`}
						currency={props.currency}
						value={props.maxTaxDeduction}
						changeHandler={props.maxTaxDeductionHandler}
						min={0}
						max={30000}
						step={1000}
						note={
							<ItemDisplay
								label="Total Tax Benefit"
								result={props.pTaxBenefit}
								currency={props.currency}
								footer={`For this Goal`}
							/>
						}
						rangeFactor={props.rangeFactor}
						width="100px"
					/>
				))
			}
		/>
	);
}
