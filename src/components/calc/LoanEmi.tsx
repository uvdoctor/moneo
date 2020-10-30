import React, { useState, useEffect, useContext } from 'react';
import NumberInput from '../form/numberinput';
import { getEmi, getTotalInt } from './finance';
import { toCurrency, toStringArr, initYearOptions } from '../utils';
import SelectInput from '../form/selectinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import {
	getLoanPaidForMonths,
	adjustAccruedInterest,
	createEduLoanDPWithSICFs,
	getLoanBorrowAmt
} from '../goals/cfutils';
import ItemDisplay from './ItemDisplay';
import { COLORS } from '../../CONSTANTS';
import { isTaxCreditEligible } from '../goals/goalutils';
import HSwitch from '../HSwitch';
import { Collapse } from 'antd';
import { GoalContext } from '../goals/GoalContext';

export default function LoanEmi() {
	const {
		price,
		priceChgRate,
		currency,
		startYear,
		duration,
		loanRepaymentSY,
		endYear,
		rangeFactor,
		loanYears,
		loanIntRate,
		loanPer,
		goal,
		loanSIPayPer,
		loanSICapitalize,
		loanGracePeriod,
		manualMode,
		setLoanIntRate,
		setLoanPer,
		setLoanSIPayPer,
		setLoanSICapitalize,
		setLoanYears,
		setLoanloanRepaymentSY,
		taxBenefitInt,
		setTaxBenefitInt,
		taxRate,
		maxTaxDeductionInt,
		setMaxTaxDeductionInt,
		totalITaxBenefit,
		setTotalIntAmt
	}: any = useContext(GoalContext);
	const loanBorrowAmt = getLoanBorrowAmt(
		price,
		goal.type,
		manualMode,
		priceChgRate,
		endYear - startYear,
		loanPer as number
	);
	const [ ryOptions, setRYOptions ] = useState(
		initYearOptions(goal.type === goal.type.E ? endYear + 1 : startYear, 10)
	);
	const [ emi, setEMI ] = useState<number>(0);
	const [ simpleInts, setSimpleInts ] = useState<Array<number>>([]);
	const [ remIntAmt, setRemIntAmt ] = useState<number>(0);
	const loanLimitPer = goal.type === goal.type.E ? 100 : 80;
	const { Panel } = Collapse;

	const calculateEmi = () => {
		let borrowAmt = loanBorrowAmt;
		let simpleInts: Array<number> = [];
		if (goal.type === goal.type.E) {
			let result = createEduLoanDPWithSICFs(
				price,
				priceChgRate,
				loanPer,
				startYear,
				endYear,
				loanIntRate,
				loanSIPayPer as number,
				(loanSICapitalize as number) < 1
			);
			borrowAmt = result.borrowAmt;
			simpleInts = result.ints;
			setRemIntAmt(Math.round(result.remIntAmt));
			setSimpleInts([ ...simpleInts ]);
		}
		borrowAmt = adjustAccruedInterest(
			borrowAmt,
			goal.type === goal.type.E ? endYear + 1 : startYear,
			loanRepaymentSY,
			loanIntRate
		);
		let loanPaidForMonths = getLoanPaidForMonths(startYear + duration - 1, loanRepaymentSY, loanYears);
		let emi = getEmi(borrowAmt, loanIntRate, loanYears * 12) as number;
		setEMI(Math.round(emi));
		let totalSimpleIntAmt = 0;
		simpleInts.forEach((int) => (totalSimpleIntAmt += int));
		let totalIntAmt = 0;
		if (goal.type !== goal.type.B) {
			totalIntAmt = emi * loanPaidForMonths + totalSimpleIntAmt + remIntAmt - loanBorrowAmt;
		} else totalIntAmt = getTotalInt(borrowAmt, emi, loanIntRate, loanPaidForMonths);
		setTotalIntAmt(Math.round(totalIntAmt));
	};

	useEffect(() => calculateEmi(), [
		price,
		priceChgRate,
		currency,
		startYear,
		duration,
		loanRepaymentSY,
		endYear,
		rangeFactor,
		loanYears,
		loanIntRate,
		loanPer,
		goal,
		loanSIPayPer,
		loanSICapitalize,
		loanGracePeriod,
		manualMode,
		taxBenefitInt,
		taxRate,
		maxTaxDeductionInt,
		totalITaxBenefit
	]);

	useEffect(
		() => {
			setRYOptions(initYearOptions(goal.type === goal.type.E ? endYear + 1 : startYear, 10));
		},
		[ startYear, endYear ]
	);

	useEffect(
		() => {
			if (goal.type === goal.type.E && taxRate && taxBenefitInt < 1) setTaxBenefitInt(1);
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
				data={toStringArr(0, loanLimitPer, 5)}
				value={loanPer}
				changeHandler={setLoanPer}
				step={5}
				labelBottom={true}
				label="of Cost"
				pre="Loan Amount"
				post={`${toCurrency(loanBorrowAmt, currency)}`}
			/>
			{loanBorrowAmt && (
				<SelectInput
					pre="Repay from"
					options={ryOptions}
					value={loanRepaymentSY}
					changeHandler={(year: string) => setLoanloanRepaymentSY(parseInt(year))}
				/>)}
			{loanBorrowAmt && (	
				<NumberInput
					pre="For"
					unit="Years"
					value={loanYears}
					changeHandler={setLoanYears}
					min={0.5}
					max={30}
					step={0.5}
					/>
			)}
			{loanBorrowAmt && (
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
			)}
			{loanBorrowAmt &&
			goal.type === goal.type.E && (
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
									{simpleInts.map((int, i) => (
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
			goal.type === goal.type.E &&
			!Number.isNaN(loanSIPayPer) && //@ts-ignore
			loanSIPayPer < 100 && (
				<HSwitch
					rightText={`Pay ${toCurrency(remIntAmt, currency)} in ${endYear + 1}`}
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
							footer={`Over ${duration} Years`}
						/>
					}
				/>
			)}
		</Section>
	);
}
