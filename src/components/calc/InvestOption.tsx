import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import { toStringArr } from '../utils';
import { TrueCostContext } from './TrueCostContext';

export default function InvestOption() {
	const {
		dr,
		setDR,
		years,
		setYears,
	}: any = useContext(TrueCostContext);

	return (
		<Section title="How much Do Your Investments Earn?">
			<NumberInput
				pre="Investments"
				post="Earn Yearly"
				note="after taxes & fees"
				value={dr}
				changeHandler={setDR}
				min={0}
				max={15}
				step={0.1}
				unit="%"
			/>
			<RadialInput
				pre="Analyze From 1 to"
				data={toStringArr(30, 50, 5)}
				step={5}
				value={years}
				changeHandler={setYears}
				label="Years"
				labelBottom
				width={120}
			/>
		</Section>
	);
}
