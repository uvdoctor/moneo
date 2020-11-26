import React, { useContext } from 'react';
import { PLAN_DURATION } from '../../CONSTANTS';
import { CalcContext } from '../calc/CalcContext';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import { changeSelection } from '../utils';
import { FIGoalContext } from './FIGoalContext';
import { getRAOptions } from './goalutils';

export default function FIUserDetails() {
	const { currency, endYear, setEndYear, eyOptions }: any = useContext(CalcContext);
	const { nw, setNW, riskProfile, setRiskProfile }: any = useContext(FIGoalContext);

	return (
		<Section title="Your Details" videoSrc={`https://www.youtube.com/watch?v=9I8bMqMPfrc`}>
			<SelectInput
				info="This is needed to find the earliest possible year for Your Financial Independence (FI) before You turn 70. In case it's not possible to achieve FI by 70 years of age, then You will be requested to reconsider Your inputs."
				pre="Birth Year"
				value={endYear - PLAN_DURATION}
				changeHandler={(val: string) => changeSelection(val, setEndYear, 100)}
				options={eyOptions}
			/>
			<NumberInput
				info={`Your Total Portfolio Value across cash, deposits, real estate, gold, stocks, bonds, retirement accounts, etc.`}
				value={nw}
				pre="Total"
				min={5000}
				max={900000}
				post="Portfolio"
				changeHandler={setNW}
				step={1000}
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
		</Section>
	);
}
