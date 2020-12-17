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
		<Section title="Savings from Work Income" videoSrc={`https://www.youtube.com/watch?v=NuJdxuIsYl4&t=320s`}>
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
				pre="Total Paid Work Weeks in a Year"
				value={paidWeeks}
				changeHandler={setPaidWeeks}
				min={4}
				max={52}
				step={1}
				unit="Weeks"
				info="Total Number of Weeks You get Paid in a Year. If You are employed full-time & don't take any unpaid leave in a Year, then this implies 52 weeks."
			/>
			<NumberInput
				pre="Average Work-week including travel"
				value={hoursPerWeek}
				changeHandler={setHoursPerWeek}
				min={10}
				max={80}
				step={1}
				unit={'Hours'}
				info="Average Number of Hours You Spend for Work in a Week, including commute time, business travel, and time spent for any other work-related activity."
			/>
		</Section>
	);
}
