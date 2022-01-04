import React, { useContext, useEffect } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import { getMonthName, getRangeFactor, toCurrency } from '../utils';
import { FIGoalContext } from './FIGoalContext';
import { CalcContext } from '../calc/CalcContext';
import HSwitch from '../HSwitch';

export function BeforeFI() {
	const { currency }: any = useContext(CalcContext);
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
		return toCurrency(target, currency);
	};

	return (
		<Section
			title="Before Financial Independence"
			toggle={<HSwitch value={needTEBonds} setter={setNeedTEBonds} rightText="Applicable tax rate more than 12%" />}
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
					pre="Increase investment"
					unit="% monthly"
					value={monthlySavingsRate}
					changeHandler={setMonthlySavingsRate}
					min={0}
					max={3}
					step={0.1}
					post={
						`Target for ${getMonthName(new Date().getMonth() + 1)} ${new Date().getFullYear()} is ${getThisMonthTarget()}`
					}
				/>
			)}
			{avgMonthlySavings && monthlySavingsRate && 
				<NumberInput
				pre="Maximum monthly investment"
				value={monthlyMaxSavings}
				changeHandler={setMonthlyMaxSavings}
				currency={currency}
				min={avgMonthlySavings}
				max={avgMonthlySavings + 5000 * getRangeFactor(currency)}
				step={100}
				noRangeFactor
				info={`This is the maximum possible monthly investment amount you can achieve.`}
		/>
			}
			
			<NumberInput
				pre="Emergency fund"
				currency={currency}
				value={emergencyFund}
				changeHandler={setEmergencyFund}
				min={0}
				max={25000}
				step={500}
				info="Amount needed for emergency fund needs to be set aside in high yield Savings Account & liquid funds, so that money is readily available when needed. Ideally, it should be about 6 months of expenses."
			/>
		</Section>
	);
}
