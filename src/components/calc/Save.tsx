import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import { TrueCostContext } from './TrueCostContext';

export default function Save() {
	const {
		currency,
		hoursPerWeek,
		setHoursPerWeek,
		savings,
		setSavings,
		paidWeeks,
		setPaidWeeks
	}: any = useContext(TrueCostContext);
	return (
		<Section title="How much Do You Save from Your Work Income?">
			<NumberInput
				pre="Yearly Savings"
				value={savings}
				changeHandler={setSavings}
				currency={currency}
				min={0}
				max={200000}
				step={1000}
			/>
			<NumberInput
				pre="Total Paid Work Weeks in a Year"
				value={paidWeeks}
				changeHandler={setPaidWeeks}
				min={0}
				max={52}
				step={1}
				unit="Weeks"
			/>
			<NumberInput
				pre="Average Work-week including travel"
				value={hoursPerWeek}
				changeHandler={setHoursPerWeek}
				min={0}
				max={80}
				step={1}
				unit={'Hours'}
			/>
		</Section>
	);
}
