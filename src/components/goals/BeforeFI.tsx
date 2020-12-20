import React, { useContext } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import { toCurrency } from '../utils';
import { FIGoalContext } from './FIGoalContext';
import { CalcContext } from '../calc/CalcContext';
import ItemDisplay from '../calc/ItemDisplay';

export function BeforeFI() {
	const { currency, dr, setDR, addCallback }: any = useContext(CalcContext);
	const { avgMonthlySavings, setAvgMonthlySavings, monthlySavingsRate, setMonthlySavingsRate }: any = useContext(
		FIGoalContext
	);

	return (
		<Section title="Before Financial Independence" videoSrc={`https://www.youtube.com/watch?v=9I8bMqMPfrc`}>
			<NumberInput
				info={`Average Monthly Savings after paying all taxes & expenses. 
                  Include Your Retirement Contributions as a part of Your Savings. 
                  This will be used to forecast Your Future Savings.`}
				value={avgMonthlySavings}
				pre="Average Monthly Investment"
				min={0}
				max={10000}
				changeHandler={setAvgMonthlySavings}
				step={100}
				currency={currency}
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
				note={<ItemDisplay label="Target Investment" result={avgMonthlySavings * (1 + monthlySavingsRate / 100)} pl footer="for this Month" />}
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
