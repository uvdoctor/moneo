import React, { useState, useEffect, useContext } from 'react';
import NumberInput from '../form/numberinput';
import { toCurrency, toStringArr, initYearOptions } from '../utils';
import SelectInput from '../form/selectinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import ItemDisplay from './ItemDisplay';
import { COLORS } from '../../CONSTANTS';
import { isTaxCreditEligible } from '../goals/goalutils';
import HSwitch from '../HSwitch';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import { GoalType } from '../../api/goals';
import LoanInterest from './LoanInterest';

export default function LoanEmi() {
	const { goal, currency, startYear, rangeFactor, endYear }: any = useContext(CalcContext);
	const {
		duration,
		loanRepaymentSY,
		loanYears,
		loanPer,
		loanSIPayPer,
		loanSICapitalize,
		setLoanPer,
		setLoanSIPayPer,
		setLoanSICapitalize,
		setLoanYears,
		setLoanRepaymentSY,
		taxBenefitInt,
		setTaxBenefitInt,
		taxRate,
		maxTaxDeductionInt,
		setMaxTaxDeductionInt,
		totalITaxBenefit,
		isLoanMandatory,
		simpleInts,
		remSI,
		loanBorrowAmt
	}: any = useContext(GoalContext);

	const getRYFirstYear = () => (goal.type === GoalType.E ? endYear + 1 : startYear);

	const getRYDuration = () => (goal.type === GoalType.B && duration <= 3 ? duration - 1 : 3);

	const getRYRange = () => initYearOptions(getRYFirstYear(), getRYDuration());

	const [ ryOptions, setRYOptions ] = useState(getRYRange());
	const loanLimitPer = goal.type === GoalType.E ? 100 : 80;
	const [ totalSI, setTotalSI ] = useState<number>(0);

	useEffect(
		() => {
			setRYOptions(getRYRange());
		},
		[ startYear, endYear ]
	);

	useEffect(
		() => {
			if (goal.type === GoalType.E && taxRate && taxBenefitInt < 1) setTaxBenefitInt(1);
		},
		[ taxRate ]
	);

	useEffect(
		() => {
			let totalSI = 0;
			simpleInts.forEach((int: number) => (totalSI += int));
			setTotalSI(totalSI);
		},
		[ simpleInts ]
	);

	return (
		<Section
			title="Loan Details"
			videoSrc={`https://www.youtube.com/watch?v=NuJdxuIsYl4&t=320s`}
			toggle={
				!isTaxCreditEligible(goal.type) && taxRate ? (
					<HSwitch rightText="Claim Interest Tax Deduction" value={taxBenefitInt} setter={setTaxBenefitInt} />
				) : (
					<div />
				)
			}
		>
			<RadialInput
				width={120}
				unit="%"
				data={toStringArr(isLoanMandatory ? 10 : 0, loanLimitPer, 5)}
				value={loanPer}
				changeHandler={setLoanPer}
				step={5}
				labelBottom={true}
				label="of Cost"
				post={
					<ItemDisplay
						label="Loan Amount"
						result={loanBorrowAmt}
						currency={currency}
						footer={
							<SelectInput
								pre="Repay from"
								options={ryOptions}
								value={loanRepaymentSY}
								changeHandler={(year: string) => setLoanRepaymentSY(parseInt(year))}
							/>
						}
					/>
				}
			/>
			{loanBorrowAmt && (
				<NumberInput
					pre="Loan Duration"
					unit="Years"
					value={loanYears}
					changeHandler={setLoanYears}
					min={0.5}
					max={30}
					step={0.5}
				/>
			)}
			{loanBorrowAmt && <LoanInterest />}
			{loanBorrowAmt &&
			goal.type === GoalType.E && (
				<RadialInput
					width={120}
					unit="%"
					data={toStringArr(0, 100, 5)}
					value={loanSIPayPer as number}
					changeHandler={setLoanSIPayPer}
					step={5}
					labelBottom
					colorFrom={COLORS.RED}
					colorTo={COLORS.GREEN}
					pre="Pay While Studying"
					label="of Interest"
					post={
						<ItemDisplay
							label="Total Simple Interest"
							result={totalSI}
							currency={currency}
							info={simpleInts.map((int: number, i: number) => (
								<p key={'int' + i}>
									Monthly {toCurrency(Math.round(int / 12), currency)} in {startYear + i}
								</p>
							))}
							footer={`${startYear} to ${endYear}`}
						/>
						/*!!loanSIPayPer && (
							<Collapse defaultActiveKey={[ '0' ]} ghost>
								<Panel key="1" header="Monthly Simple Interest">
									{simpleInts.map((int: number, i: number) => (
										<p key={'int' + i}>
											Monthly {toCurrency(Math.round(int / 12), currency)} in {startYear + i}
										</p>
									))}
								</Panel>
							</Collapse>
						)*/
					}
				/>
			)}
			{loanBorrowAmt &&
			goal.type === GoalType.E &&
			!Number.isNaN(loanSIPayPer) && //@ts-ignore
			loanSIPayPer < 100 && (
				<HSwitch
					rightText={`Pay ${toCurrency(remSI, currency)} in ${endYear + 1} Grace Period`}
					value={loanSICapitalize as number}
					setter={setLoanSICapitalize}
				/>
			)}
			{loanBorrowAmt &&
			taxRate &&
			taxBenefitInt &&
			!isTaxCreditEligible(goal.type) && (
				<NumberInput
					pre="Max Interest"
					post="Deduction"
					rangeFactor={rangeFactor}
					value={maxTaxDeductionInt}
					changeHandler={setMaxTaxDeductionInt}
					currency={currency}
					min={0}
					max={30000}
					step={1000}
					note={
						<ItemDisplay
							label="Total Interest Tax Benefit"
							result={totalITaxBenefit}
							currency={currency}
							footer={`${loanRepaymentSY} to ${startYear + duration - 1}`}
						/>
					}
				/>
			)}
		</Section>
	);
}
