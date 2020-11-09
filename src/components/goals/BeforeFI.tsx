import React, { useContext } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import { changeSelection, toCurrency } from '../utils';
import { getRAOptions } from './goalutils';
import { FIGoalContext } from './FIGoalContext';
import { CalcContext } from '../calc/CalcContext';
import { PLAN_DURATION } from '../../CONSTANTS';

export function BeforeFI() {
	const { currency, rangeFactor, dr, setDR, addCallback, endYear, setEndYear, eyOptions }: any = useContext(
		CalcContext
	);
	const {
		nw,
		setNW,
		avgMonthlySavings,
		setAvgMonthlySavings,
		monthlySavingsRate,
		setMonthlySavingsRate,
		riskProfile,
		setRiskProfile
	}: any = useContext(FIGoalContext);

	return (
		<Section title="Before Financial Independence" videoSrc={`https://www.youtube.com/watch?v=9I8bMqMPfrc`}>
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
				min={1000}
				max={900000}
				post="Portfolio"
				changeHandler={setNW}
				step={1000}
				currency={currency}
				rangeFactor={rangeFactor}
			/>
			<NumberInput
				info={`Average Monthly Savings after paying all taxes & expenses. 
                  Include Your Retirement Contributions as a part of Your Savings. 
                  You Can Put Negative Value if Your Expenses are More than Income. 
                  This will be used to forecast Your Future Savings.`}
				value={avgMonthlySavings}
				pre="Average Monthly Investment"
				min={500}
				max={10000}
				changeHandler={setAvgMonthlySavings}
				step={100}
				currency={currency}
				rangeFactor={rangeFactor}
			/>
			<NumberInput
				info={`Given Average Monthly Investment of ${toCurrency(
					avgMonthlySavings,
					currency
				)}, ${monthlySavingsRate}% monthly increase in investment comes to about 
          ${toCurrency(Math.round(avgMonthlySavings * (1 + monthlySavingsRate / 100)), currency)} 
          for this month. Due to the power of compounding, even small regular increase in investment can make a significant impact in the long term.`}
				pre="Increase Investment Monthly"
				unit="%"
				value={monthlySavingsRate}
				changeHandler={setMonthlySavingsRate}
				min={0}
				max={3}
				step={0.1}
				note={`Total ${toCurrency(
					Math.round(avgMonthlySavings * (1 + monthlySavingsRate / 100)),
					currency
				)} this month`}
			/>
			<SelectInput
				info="How much Risk are You willing to take in order to achieve higher Investment Return?"
				pre="Can Tolerate"
				post="Loss"
				value={riskProfile}
				changeHandler={setRiskProfile}
				options={getRAOptions()}
			/>
			{!addCallback && (
				<NumberInput
					value={dr as number}
					changeHandler={setDR}
					min={0}
					max={10}
					step={0.1}
					pre="Investment Earns About"
					unit="%"
					note="Yearly after taxes & fees"
				/>
			)}
		</Section>
	);
}
