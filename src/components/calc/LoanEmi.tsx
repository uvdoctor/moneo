import React, { useState, useEffect, useContext, Fragment } from 'react';
import NumberInput from '../form/numberinput';
import { toCurrency, toStringArr, initYearOptions } from '../utils';
import SelectInput from '../form/selectinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import ItemDisplay from './ItemDisplay';
import { COLORS } from '../../CONSTANTS';
import { isTaxCreditEligible } from '../goals/goalutils';
import HSwitch from '../HSwitch';
import { Col, Collapse, Row } from 'antd';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import { GoalType } from '../../api/goals';

export default function LoanEmi() {
	const { goal, currency, startYear, rangeFactor, endYear }: any = useContext(CalcContext);
	const {
		duration,
		loanRepaymentSY,
		loanYears,
		loanIntRate,
		loanPer,
		loanSIPayPer,
		loanSICapitalize,
		setLoanIntRate,
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
		totalIntAmt,
		isLoanMandatory,
		emi,
		simpleInts,
		remSI,
		loanBorrowAmt
	}: any = useContext(GoalContext);
	const [ ryOptions, setRYOptions ] = useState(
		initYearOptions(
			goal.type === GoalType.E ? endYear + 1 : startYear,
			goal.type === GoalType.B ? duration - 1 : 10
		)
	);
	const loanLimitPer = goal.type === GoalType.E ? 100 : 80;
	const { Panel } = Collapse;

	useEffect(
		() => {
			setRYOptions(
				initYearOptions(
					goal.type === GoalType.E ? endYear + 1 : startYear,
					goal.type === GoalType.B ? duration - 1 : 10
				)
			);
		},
		[ startYear, endYear ]
	);

	useEffect(
		() => {
			if (goal.type === GoalType.E && taxRate && taxBenefitInt < 1) setTaxBenefitInt(1);
		},
		[ taxRate ]
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
					<Fragment>
						<ItemDisplay label="Loan Amount" result={loanBorrowAmt} currency={currency} />
					</Fragment>
				}
			/>
			{loanBorrowAmt && (
				<NumberInput
					pre={
						<Row align="middle">
							<SelectInput
								pre="Repay from"
								options={ryOptions}
								value={loanRepaymentSY}
								changeHandler={(year: string) => setLoanRepaymentSY(parseInt(year))}
							/>
							for
						</Row>
					}
					unit="Years"
					value={loanYears}
					changeHandler={setLoanYears}
					min={0.5}
					max={30}
					step={0.5}
				/>
			)}
			{loanBorrowAmt && (
				<Fragment>
					<Col span={24}>
						<NumberInput
							pre="Yearly Interest"
							unit="%"
							/*feedback={{
							0: {
								label: (
									<Tooltip
										title={`It is ideal to get a loan with interest rate lesser than what You can earn from Your Investment with Minimal Risk. 
												As it is Very Easy for Your Investment to recover this Yearly Interest with Minimal Risk, this is an Excellent Deal!`}
										color={COLORS.GREEN}
									/>
								),
								color: COLORS.GREEN
							},
							1: {
								label: (
									<Tooltip
										title={`It is ideal to get a loan with interest rate lesser than what You can earn from Your Investment with Minimal Risk. 
												As it is Easy for Your Investment to recover this Yearly Interest with Minimal Risk, this is a Good Deal!`}
										color={COLORS.BLUE}
									/>
								),
								color: COLORS.BLUE
							},
							3.5: { label: '', color: '' },
							8: {
								label: (
									<Tooltip
										text="COSTLY"
										info={`It is ideal to get a loan with interest rate lesser than what You can earn from Your Investment with Minimal Risk. 
												As it is Difficult for Your Investment to recover this Yearly Interest even with High Risk, this is an Expensive Loan!`}
										color="#dd6b20"
										error
									/>
								),
								color: '#dd6b20'
							},
							10: {
								label: (
									<Tooltip
										text="COSTLY!!!"
										info={`It is ideal to get a loan with interest rate lesser than what You can earn from Your Investment with Minimal Risk. 
												As it is Very Difficult for Your Investment to recover this Yearly Interest even with Very High Risk, 
												this is a Very Expensive Loan!!!`}
										color={COLORS.RED}
										error
									/>
								),
								color: COLORS.RED
							}
						}}*/
							value={loanIntRate}
							changeHandler={setLoanIntRate}
							min={0.0}
							max={25.0}
							step={0.1}
						/>
					</Col>
					<Row align="middle" justify="space-between">
						<Col>
							<ItemDisplay label="Pay" result={emi} currency={currency} footer="Monthly" />
						</Col>
						<Col>
							<ItemDisplay
								label="Total Interest"
								result={totalIntAmt}
								currency={currency}
								footer={`${loanRepaymentSY} to ${startYear + duration - 1}`}
							/>
						</Col>
					</Row>
				</Fragment>
			)}
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
						!!loanSIPayPer && (
							<Collapse defaultActiveKey={[ '0' ]} ghost>
								<Panel key="1" header="Interest Schedule">
									{simpleInts.map((int: number, i: number) => (
										<p key={'int' + i}>
											Monthly {toCurrency(Math.round(int / 12), currency)} in {startYear + i}
										</p>
									))}
								</Panel>
							</Collapse>
						)
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
