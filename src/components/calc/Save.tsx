import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import { CalcContext } from './CalcContext';
import { TrueCostContext } from './TrueCostContext';

export default function Save() {
	const { currency }: any = useContext(CalcContext);
	const {
		hoursPerWeek,
		setHoursPerWeek,
		savings,
		setSavings,
		paidWeeks,
		setPaidWeeks
	}: any = useContext(TrueCostContext);
	return (
		<Section title="Savings from Work Income">
			<NumberInput
				pre="Yearly Savings"
				value={savings}
				changeHandler={setSavings}
				currency={currency}
				min={1000}
				max={200000}
				step={1000}
				info="Amount You Save Yearly from Your Work Income after deducting taxes & all expenses."
			/>
			<NumberInput
				pre="Yearly work weeks"
				value={paidWeeks}
				changeHandler={setPaidWeeks}
				min={4}
				max={52}
				unit="weeks"
				info="Total number of weeks you get paid in a year. If you are employed full-time & don't take any unpaid leave in a Year, then this implies 52 weeks."
			/>
			<NumberInput
				pre="Average work-week"
				value={hoursPerWeek}
				changeHandler={setHoursPerWeek}
				min={10}
				max={80}
				unit="hours"
				info="Average number of hours you spend for work in a week, including commute time, business travel, and time spent for any other work-related activity."
			/>
		</Section>
	);
}
