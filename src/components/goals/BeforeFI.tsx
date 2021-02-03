import React, { useContext, useEffect } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import { getMonthName, getRangeFactor, toCurrency } from '../utils';
import { FIGoalContext } from './FIGoalContext';
import { CalcContext } from '../calc/CalcContext';
import ItemDisplay from '../calc/ItemDisplay';
import HSwitch from '../HSwitch';
import { PlanContext } from './PlanContext';

export function BeforeFI() {
	const { isPublicCalc }: any = useContext(PlanContext);
	const { currency, dr, setDR }: any = useContext(CalcContext);
	const {
		avgMonthlySavings,
		setAvgMonthlySavings,
		monthlyMaxSavings,
		setMonthlyMaxSavings,
		monthlySavingsRate,
		setMonthlySavingsRate,
		needTEBonds,
		setNeedTEBonds,
		emergencyFund,
		setEmergencyFund,
		emergencyFundChgRate,
		setEmergencyFundChgRate,
		setEmergencyFundBY
	}: any = useContext(FIGoalContext);

	useEffect(
		() => {
			setEmergencyFundBY(new Date().getFullYear());
		},
		[ emergencyFund ]
	);

	const getThisMonthTarget = () => {
		let target = avgMonthlySavings * (1 + monthlySavingsRate / 100);
		if (target > monthlyMaxSavings) target = monthlyMaxSavings;
		return target;
	};

	return (
		<Section
			title="Before Financial Independence"
			videoSrc={`https://www.youtube.com/watch?v=9I8bMqMPfrc`}
			toggle={<HSwitch value={needTEBonds} setter={setNeedTEBonds} rightText="I Pay more than 12% Income Tax" />}
		>
			<NumberInput
				info={`Average Monthly Investment including retirement Contribution. This will be used to forecast Your Future Savings.`}
				value={avgMonthlySavings}
				pre="Average Monthly Investment"
				min={0}
				max={10000}
				changeHandler={setAvgMonthlySavings}
				step={100}
				currency={currency}
			/>
			{avgMonthlySavings && (
				<NumberInput
					info={`Given Average Monthly Investment of ${toCurrency(
						avgMonthlySavings,
						currency
					)}, ${monthlySavingsRate}% monthly increase in investment comes to about 
          ${toCurrency(Math.round(avgMonthlySavings * (1 + monthlySavingsRate / 100)), currency)} 
          for this month. Due to the power of compounding, even small regular increase in investment can make a significant impact in the long term.`}
					pre="Increase Investment Monthly by"
					unit="%"
					value={monthlySavingsRate}
					changeHandler={setMonthlySavingsRate}
					min={0}
					max={3}
					step={0.1}
					note={
						monthlySavingsRate ? (
							<NumberInput
								pre="Up to Maximum Monthly Investment of"
								value={monthlyMaxSavings}
								changeHandler={setMonthlyMaxSavings}
								currency={currency}
								min={avgMonthlySavings}
								max={avgMonthlySavings + 5000 * getRangeFactor(currency)}
								step={100}
								noRangeFactor
								info={`This is the maximum possible Monthly Investment amount You can achieve.`}
							/>
						) : null
					}
				/>
			)}
			{avgMonthlySavings && (
				<ItemDisplay
					label="Target Investment"
					result={getThisMonthTarget()}
					pl
					footer={`for ${getMonthName(new Date().getMonth() + 1)} ${new Date().getFullYear()}`}
				/>
			)}
			{isPublicCalc && (
				<NumberInput
					value={dr as number}
					changeHandler={setDR}
					min={0}
					max={10}
					step={0.1}
					pre="Investment Earns Yearly"
					unit="%"
					note="after taxes & fees"
				/>
			)}
			<NumberInput
				pre="Emergency Fund"
				currency={currency}
				value={emergencyFund}
				changeHandler={setEmergencyFund}
				min={0}
				max={25000}
				step={500}
				info="Amount needed for Emergency Fund needs to be set aside in High Yield Savings Account & Deposits, so that it is readily available when needed. Ideally, it should be about 6 months of Expenses for You and Your family."
			/>
			<NumberInput
				pre="Increase Emergency Fund by"
				value={emergencyFundChgRate}
				changeHandler={setEmergencyFundChgRate}
				min={0}
				max={10}
				step={0.1}
				unit="%"
				info="Emergency Fund should be increased every year based on inflation."
			/>
		</Section>
	);
}
