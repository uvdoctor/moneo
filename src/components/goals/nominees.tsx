import React, { useContext } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import { toCurrency } from '../utils';
import { FIGoalContext } from './FIGoalContext';

export default function Nominees() {
	const {
		currency,
		rangeFactor,
		leaveBehind,
		setLeaveBehind,
		successionTaxRate,
		setSuccessionTaxRate,
		endYear
	}: any = useContext(FIGoalContext);
	
	return (
		<Section
			title={`Nominees Inherit ~ ${toCurrency(
				Math.round(leaveBehind * (1 - successionTaxRate / 100)),
				currency
			)}`}
		>
			<NumberInput
				value={leaveBehind}
				changeHandler={setLeaveBehind}
				rangeFactor={rangeFactor}
				min={0}
				max={500000}
				pre="Amount"
				currency={currency}
				step={1000}
				post={`in ${endYear + 1}`}
			/>
			{leaveBehind > 0 && (
				<NumberInput
					pre="Inheritance"
					post="Tax Rate"
					min={0}
					max={20}
					step={0.1}
					value={successionTaxRate}
					changeHandler={setSuccessionTaxRate}
					unit="%"
					note={`Total ${toCurrency(Math.round(leaveBehind * (successionTaxRate / 100)), currency)}`}
				/>
			)}
		</Section>
	);
}
