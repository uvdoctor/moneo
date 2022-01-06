import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import { initOptions, toStringArr } from '../utils';
import { FIGoalContext } from './FIGoalContext';
import { getRAOptions } from './goalutils';

export default function FIUserDetails() {
	const { currency, setCurrency, startYear, changeStartYear }: any = useContext(CalcContext);
	const {
		nw,
		setNW,
		riskProfile,
		setRiskProfile,
		retirementAge,
		setRetirementAge
	}: any = useContext(FIGoalContext);
	const nowYear = new Date().getFullYear();

	return (
		<Section
			title="Your Details"
			toggle={<SelectInput pre="" value={currency} changeHandler={setCurrency} currency />}>
			<SelectInput
				info="Your birth year is used to calculate the duration for which Financial Planning is needed."
				pre="Birth Year"
				value={startYear}
				changeHandler={changeStartYear}
				options={initOptions(nowYear - 60, 45)}
			/>
			<NumberInput
				info={`Total portfolio value across cash, deposits, real estate, gold, stocks, bonds, retirement accounts, etc. Please do NOT include your Home value.`}
				value={nw}
				pre="Total portfolio value"
				min={500}
				max={900000}
				changeHandler={setNW}
				step={100}
				currency={currency}
			/>
			<SelectInput
				info="How much Risk are You willing to take in order to achieve higher Investment Return?"
				pre="Can Tolerate"
				unit="Loss"
				value={riskProfile}
				changeHandler={setRiskProfile}
				options={getRAOptions()}
			/>
			<RadialInput
				pre="FI Target Age"
				label="Years"
				value={retirementAge}
				changeHandler={setRetirementAge}
				step={1}
				data={toStringArr(40, 67, 1)}
				labelBottom
				info="This is the age by which You wish to achieve Financial Independence (FI)."
			/>
		</Section>
	);
}
