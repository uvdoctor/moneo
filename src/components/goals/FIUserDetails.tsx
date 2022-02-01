import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import DateInput from '../form/DateInput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import TaxLiabilityInput from '../TaxLiabilityInput';
import { getRiskProfileOptions } from '../utils';
import { FIGoalContext } from './FIGoalContext';

export default function FIUserDetails() {
	const { startYear, changeStartYear }: any = useContext(CalcContext);
	const { riskProfile, setRiskProfile, taxLiability, setTaxLiability }: any = useContext(FIGoalContext);
	const nowYear = new Date().getFullYear();

	return (
		<Section title="Your Details">
			<DateInput
				info="Your birth year is used to calculate the duration for which financial planning is needed."
				title="Birth year"
				startYearValue={startYear}
				startYearHandler={changeStartYear}
				initialValue={nowYear - 60}
				endValue={nowYear - 15}
			/>
			<TaxLiabilityInput value={taxLiability} changeHandler={setTaxLiability} />
			<SelectInput
				info="How much risk are you willing to take in order to achieve higher investment return?"
				pre="Can tolerate"
				unit="loss"
				value={riskProfile}
				changeHandler={setRiskProfile}
				options={getRiskProfileOptions()}
			/>
		</Section>
	);
}
