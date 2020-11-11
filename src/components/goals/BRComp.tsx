import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import HSwitch from '../HSwitch';
import { GoalContext } from './GoalContext';

export default function BRComp() {
	const { currency, rangeFactor, dr, setDR }: any = useContext(CalcContext);
	const {
		rentAmt,
		setRentAmt,
		rentChgPer,
		setRentChgPer,
		taxRate,
		rentTaxBenefit,
		setRentTaxBenefit
	}: any = useContext(GoalContext);

	return (
		<Section
			title="If You Rent Instead of Buying"
			toggle={
				taxRate ? (
					<HSwitch rightText="Claim Tax Deduction" value={rentTaxBenefit} setter={setRentTaxBenefit} />
				) : null
			}
		>
			<NumberInput
				pre="Yearly Rent"
				value={rentAmt as number}
				changeHandler={setRentAmt}
				min={0}
				max={100000}
				step={1000}
				currency={currency}
				rangeFactor={rangeFactor}
			/>
			{rentAmt > 0 && (
				<NumberInput
					pre="Rent Changes Yearly by"
					value={rentChgPer as number}
					changeHandler={setRentChgPer}
					min={-10}
					max={10}
					step={0.5}
					unit="%"
				/>
			)}
			{dr !== null && (
				<NumberInput
					value={dr}
					changeHandler={setDR}
					min={0}
					max={15}
					step={0.1}
					pre="Invest Remaining Money At"
					unit="%"
					note="Yearly After paying taxes & fees"
				/>
			)}
		</Section>
	);
}
