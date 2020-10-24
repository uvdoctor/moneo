import React, { useState, useEffect } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import { changeSelection, initYearOptions, toStringArr } from '../utils';
import RadialInput from '../form/radialinput';
import ItemDisplay from '../calc/ItemDisplay';
import { calculateTotalCP, calculateTotalCPTaxBenefit } from '../goals/cfutils';
import { COLORS, PLAN_DURATION } from '../../CONSTANTS';
import { getAge } from './goalutils';

interface CareInsuranceProps {
	currency: string;
	rangeFactor: number;
	endYear: number;
	carePremium: number;
	carePremiumHandler: Function;
	carePremiumSY: number;
	carePremiumSYHandler: Function;
	chgPer: number;
	chgPerHandler: Function;
	maxTaxDed: number;
	maxTaxDedHandler: Function;
	taxRate: number;
	premiumDur: number;
	premiumDurHandler: Function;
	cpBY: number;
	cpBYHandler: Function;
}

export default function CareInsurance({
	currency,
	rangeFactor,
	endYear,
	carePremium,
	carePremiumHandler,
	carePremiumSY,
	carePremiumSYHandler,
	chgPer,
	chgPerHandler,
	maxTaxDed,
	maxTaxDedHandler,
	taxRate,
	premiumDur,
	premiumDurHandler,
	cpBY,
	cpBYHandler
}: CareInsuranceProps) {
	const [ totalCP, setTotalCP ] = useState<number>(0);
	const [ totalTaxBenefit, setTotalTaxBenfit ] = useState<number>(0);
	const nowYear = new Date().getFullYear();

	useEffect(
		() => {
			carePremium > 0
				? setTotalCP(Math.round(calculateTotalCP(carePremiumSY, carePremium, chgPer, premiumDur, cpBY)))
				: setTotalCP(0);
		},
		[ carePremiumSY, carePremium, chgPer, premiumDur ]
	);

	useEffect(
		() => {
			taxRate > 0
				? setTotalTaxBenfit(
						calculateTotalCPTaxBenefit(
							taxRate,
							maxTaxDed,
							carePremiumSY,
							carePremium,
							chgPer,
							premiumDur,
							cpBY
						)
					)
				: setTotalTaxBenfit(0);
		},
		[ taxRate, maxTaxDed, carePremiumSY, carePremium, chgPer, premiumDur ]
	);

	useEffect(
		() => {
			if (carePremiumSY > endYear - 35 || carePremiumSY < endYear - 45) carePremiumSYHandler(endYear - 40);
		},
		[ endYear ]
	);

	useEffect(
		() => {
			cpBYHandler(nowYear);
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
				changeHandler={carePremiumHandler}
				rangeFactor={rangeFactor}
				pre="Yearly"
				post="Premium"
				note="In Today's Money"
				min={0}
				max={7000}
				step={100}
				currency={currency}
			/>
			{carePremium && (
				<SelectInput
					info="It may be a good option to buy this insurance when You are healthier (between 60 to 65 years of age) to get lower premiums."
					value={getAge(carePremiumSY, endYear)}
					options={initYearOptions(55, 10)}
					pre="Buy Policy At"
					unit="Years"
					post="Age"
					changeHandler={(val: string) => changeSelection(val, carePremiumSYHandler, endYear - PLAN_DURATION)}
				/>
			)}
			{carePremium && (
				<SelectInput
					value={premiumDur}
					options={initYearOptions(1, 15)}
					pre="Pay For"
					unit="Years"
					changeHandler={(val: string) => changeSelection(val, premiumDurHandler)}
				/>
			)}
			{carePremium && (
				<RadialInput
					value={chgPer}
					changeHandler={chgPerHandler}
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
					changeHandler={maxTaxDedHandler}
					min={0}
					max={5000}
					step={500}
					rangeFactor={rangeFactor}
					note={<ItemDisplay label="Total Tax Benefit" currency={currency} result={totalTaxBenefit} />}
				/>
			)}
		</Section>
	);
}
