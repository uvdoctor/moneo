import React, { useContext } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import HSwitch from '../HSwitch';
import { GoalType, TargetInput } from '../../api/goals';
import { toCurrency } from '../utils';
import { GoalContext } from './GoalContext';
import { CalcContext } from '../calc/CalcContext';
import { useRouter } from 'next/router';
import { ROUTES } from '../../CONSTANTS';
import SelectInput from '../form/selectinput';

export default function Cost() {
	const { goal, currency, setCurrency, startYear }: any = useContext(CalcContext);
	const {
		startingPrice,
		setStartingPrice,
		wipTargets,
		setWIPTargets,
		price,
		priceChgRate,
		setPriceChgRate,
		manualMode,
		eduCostSemester,
		setEduCostSemester
	}: any = useContext(GoalContext);
	const router = useRouter();
	const isLoanPublicCalc = router.pathname === ROUTES.LOAN;

	const changeTargetVal = (val: number, i: number) => {
		if (!wipTargets || !setWIPTargets) return;
		wipTargets[i].val = val;
		setWIPTargets([
			...wipTargets
		]);
	};

	return manualMode ? (
		<Section
			title={`${isLoanPublicCalc ? 'Borrow' : 'Cost'} in `}
			toggle={<SelectInput pre="" value={currency} changeHandler={setCurrency} currency />}>
			{wipTargets.map((t: TargetInput, i: number) => (
				<NumberInput
					pre={t.num}
					currency={currency}
					value={t.val}
					changeHandler={(val: number) => changeTargetVal(val, i)}
					min={0}
					max={900000}
					step={500}
					key={'t' + i}
				/>
			))}
		</Section>
	) : (
		<Section
			title={`${isLoanPublicCalc ? 'Borrow' : 'Cost'} in `}
			toggle={<SelectInput pre="" value={currency} changeHandler={setCurrency} currency />}>
			<NumberInput
				pre={
					isLoanPublicCalc ? (
						'Borrow Amount'
					) : (
						`Today's cost ${goal.type !== GoalType.D && 'including taxes & fees'}`
					)
				}
				currency={currency}
				value={startingPrice}
				changeHandler={setStartingPrice}
				min={100}
				max={goal.type === GoalType.B || isLoanPublicCalc ? 1500000 : 50000}
				step={100}
				post={
					goal.type === GoalType.E ? (
						<HSwitch value={eduCostSemester} setter={setEduCostSemester} rightText="Every 6 Months" />
					) : null
				}
			/>
			{startYear > goal.by &&
			!isLoanPublicCalc && (
				<NumberInput
					pre="Yearly Cost Changes by"
					unit="%"
					min={-10}
					max={10}
					step={0.1}
					value={priceChgRate}
					changeHandler={setPriceChgRate}
					info="Rate at which cost is expected to change on Yearly basis considering inflation and other factors."
					post={
						priceChgRate ? (
							`In ${startYear}, ${isLoanPublicCalc ? 'Borrow' : 'Cost'} ~ ${toCurrency(price, currency)}`
						) : (
							''
						)
					}
				/>
			)}
		</Section>
	);
}
