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
				pre="Yearly Rent including taxes, fees & moving costs"
				value={rentAmt as number}
				changeHandler={setRentAmt}
				min={0}
				max={100000}
				step={1000}
				currency={currency}
			/>
			{rentAmt && (
				<NumberInput
					pre="Rent changes Yearly"
					value={rentChgPer as number}
					changeHandler={setRentChgPer}
					min={-5}
					max={10}
					step={0.5}
					additionalMarks={[5]}
					unit="%"
				/>
			)}
			{dr && (
				<NumberInput
					value={dr}
					changeHandler={setDR}
					min={1}
					max={10}
					step={0.1}
					pre="After taxes & fees, Remaining Money Earns"
					unit="% Yearly"
					additionalMarks={[4, 7]}
				/>
			)}
		</Section>
	);
}
