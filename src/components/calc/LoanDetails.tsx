import React, { useState, useEffect, useContext } from 'react';
import NumberInput from '../form/numberinput';
import { toCurrency, toStringArr, toReadableNumber } from '../utils';
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
import { Row } from 'antd';

export default function LoanDetails() {
	const { goal, currency, startYear, endYear }: any = useContext(CalcContext);
	const {
		duration,
		loanRepaymentMonths,
		loanMonths,
		loanPer,
		loanSIPayPer,
		loanSICapitalize,
		setLoanPer,
		setLoanSIPayPer,
		setLoanSICapitalize,
		setLoanMonths,
		setLoanRepaymentMonths,
		taxBenefitInt,
		setTaxBenefitInt,
		taxRate,
		maxTaxDeductionInt,
		setMaxTaxDeductionInt,
		totalITaxBenefit,
		isEndYearHidden,
		simpleInts,
		remSI,
		loanBorrowAmt,
		emi
	}: any = useContext(GoalContext);

	const loanLimitPer = goal.type === GoalType.E ? 100 : 90;
	const [ totalSI, setTotalSI ] = useState<number>(0);

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
			{!isEndYearHidden && (
				<NumberInput
					unit="%"
					pre="Cost % to be Borrowed"
					value={loanPer}
					changeHandler={setLoanPer}
					step={1}
					min={0}
					max={loanLimitPer}
					additionalMarks={[20, 50, 70]}
				/>
			)}
			<ItemDisplay
				label="Loan Amount"
				result={loanBorrowAmt}
				currency={currency}
				footer={
					<SelectInput
						pre="Repayment Delay"
						options={{
							0: "No Delay",
							1: "1 Month",
							2: "2 Months",
							3: "3 Months"
						}}
						value={loanRepaymentMonths}
						changeHandler={(months: string) => setLoanRepaymentMonths(parseInt(months))}
					/>
				}
			/>
			{loanBorrowAmt && (
				<NumberInput
					pre="Loan Duration"
					unit={`Months (${toReadableNumber(loanMonths / 12, 2)} Years)`}
					value={loanMonths}
					changeHandler={setLoanMonths}
					min={6}
					max={360}
					step={1}
					additionalMarks={[ 60, 120, 180, 240 ]}
				/>
			)}
			{loanBorrowAmt && <LoanInterest />}
			{loanBorrowAmt &&
			goal.type === GoalType.E && (
				<RadialInput
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
							footer={`${startYear} to ${startYear + duration - 1}`}
						/>
					}
				/>
			)}
			{loanBorrowAmt && (
				<Row align="middle" justify="center">
					<ItemDisplay label="Monthly Installment" result={emi} currency={currency} decimal={2} />
				</Row>
			)}
		</Section>
	);
}
