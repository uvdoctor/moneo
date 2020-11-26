import React, { useState, useEffect, useContext } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import { changeSelection, initYearOptions, toStringArr } from '../utils';
import RadialInput from '../form/radialinput';
import ItemDisplay from '../calc/ItemDisplay';
import { calculateTotalCP, calculateTotalCPTaxBenefit } from './cfutils';
import { COLORS, MAX_RETIREMENT_AGE, PLAN_DURATION } from '../../CONSTANTS';
import { FIGoalContext } from './FIGoalContext';
import { CalcContext } from '../calc/CalcContext';

export default function CareInsurance() {
	const { currency, endYear }: any = useContext(CalcContext);
	const {
		carePremium,
		setCarePremium,
		carePremiumSY,
		setCarePremiumSY,
		carePremiumChgPer,
		setCarePremiumChgPer,
		maxTaxDed,
		setMaxTaxDed,
		taxRate,
		carePremiumDur,
		setCarePremiumDur,
		cpBY,
		setCPBY
	}: any = useContext(FIGoalContext);
	const [ totalCP, setTotalCP ] = useState<number>(0);
	const [ totalTaxBenefit, setTotalTaxBenfit ] = useState<number>(0);
	const nowYear = new Date().getFullYear();

	useEffect(
		() => {
			carePremium
				? setTotalCP(Math.round(calculateTotalCP(carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur, cpBY)))
				: setTotalCP(0);
		},
		[ carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur ]
	);

	useEffect(
		() => {
			setTotalTaxBenfit(
				taxRate
					? calculateTotalCPTaxBenefit(
							taxRate,
							maxTaxDed,
							carePremiumSY,
							carePremium,
							carePremiumChgPer,
							carePremiumDur,
							cpBY
						)
					: 0
			);
		},
		[ taxRate, maxTaxDed, carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur ]
	);

	useEffect(
		() => {
			if (carePremiumSY > endYear - 35 || carePremiumSY < endYear - 45) setCarePremiumSY(endYear - 40);
		},
		[ endYear ]
	);

	useEffect(
		() => {
			setCPBY(nowYear);
		},
		[ carePremium ]
	);

	return (
		<Section title="Long-term Care Insurance">
			{/*titleInfo="About 70% individuals over age 65 need some form of living assistance for activities such as
			bathing, dressing, eating, toileting, walking, etc. //It isn't covered by traditional health insurance or
	government-sponsored old-age care programs."*/}
			<NumberInput
				info="How much does annual insurance premium cost today? Actual price will be derived based on this price."
				value={carePremium}
				changeHandler={setCarePremium}
				pre="Yearly Premium in Today's Money"
				min={0}
				max={7000}
				step={100}
				currency={currency}
			/>
			{carePremium && (
				<SelectInput
					info="It may be a good option to buy this insurance when You are healthier (between 60 to 65 years of age) to get lower premiums."
					value={carePremiumSY - (endYear - PLAN_DURATION)}
					options={initYearOptions(MAX_RETIREMENT_AGE - 15, 10)}
					pre="Buy Policy At Age"
					unit="Years"
					changeHandler={(val: string) => changeSelection(val, setCarePremiumSY, endYear - PLAN_DURATION)}
				/>
			)}
			{carePremium && (
				<SelectInput
					value={carePremiumDur}
					options={initYearOptions(1, 14)}
					pre="Pay For"
					unit="Years"
					changeHandler={(val: string) => changeSelection(val, setCarePremiumDur)}
				/>
			)}
			{carePremium && (
				<RadialInput
					value={carePremiumChgPer}
					changeHandler={setCarePremiumChgPer}
					pre="Premium Changes"
					label="Yearly"
					labelBottom
					post={<ItemDisplay label="Total Premium" result={totalCP} currency={currency} />}
					data={toStringArr(0, 10, 0.5)}
					step={0.5}
					unit="%"
					colorTo={COLORS.RED}
				/>
			)}
			{carePremium &&
			taxRate && (
				<NumberInput
					pre="Max Yearly Tax Deduction Allowed"
					currency={currency}
					value={maxTaxDed}
					changeHandler={setMaxTaxDed}
					min={0}
					max={5000}
					step={500}
					note={<ItemDisplay label="Total Tax Benefit" currency={currency} result={totalTaxBenefit} pl />}
				/>
			)}
		</Section>
	);
}
