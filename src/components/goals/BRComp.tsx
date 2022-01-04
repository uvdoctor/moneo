import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import HSwitch from '../HSwitch';
import { GoalContext } from './GoalContext';
import { PlanContext } from './PlanContext';

export default function BRComp() {
	const { dr, setDR }: any = useContext(PlanContext);
	const { currency }: any = useContext(CalcContext);
	const {
		rentAmt,
		setRentAmt,
		rentChgPer,
		setRentChgPer,
		taxRate,
		rentTaxBenefit,
		setRentTaxBenefit,
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
				pre="Monthly rent"
				value={rentAmt as number}
				changeHandler={setRentAmt}
				step={10}
				currency={currency}
			/>
			{rentAmt && (
				<NumberInput
					pre="Yearly rent change"
					value={rentChgPer as number}
					changeHandler={setRentChgPer}
					min={-5}
					max={10}
					step={0.1}
					unit="%"
				/>
			)}
			{dr && (
				<NumberInput
					value={dr}
					changeHandler={setDR}
					min={1}
					max={15}
					step={0.1}
					pre="Investment earns"
					unit="% yearly"
					post="after taxes & fees"
				/>
			)}
		</Section>
	);
}
