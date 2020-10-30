import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import HSwitch from '../HSwitch';
import { GoalContext } from './GoalContext';

export default function RentComparison() {
	const {
		currency,
		rangeFactor,
		rentAmt,
		setRentAmt,
		rentChgPer,
		setRentChgPer,
		taxRate,
		rentTaxBenefit,
		setRentTaxBenefit,
		analyzeFor,
		setAnalyzeFor,
		dr,
		setDR
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
			{rentAmt > 0 &&
			dr !== null && (
				<NumberInput
					value={dr as number}
					changeHandler={setDR}
					min={0}
					max={15}
					step={0.1}
					pre="Remaining Money Earns"
					unit="%"
					note="Yearly After paying taxes & fees"
				/>
			)}
			{rentAmt > 0 &&
			dr !== null && (
				<NumberInput
					pre="Analyze from 1 to "
					value={analyzeFor}
					changeHandler={setAnalyzeFor}
					min={10}
					max={50}
					step={5}
					unit="Years"
				/>
			)}
		</Section>
	);
}
