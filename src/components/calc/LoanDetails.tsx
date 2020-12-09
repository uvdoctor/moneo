import React, { useState, useEffect, useContext } from 'react';
import NumberInput from '../form/numberinput';
import { toCurrency, toStringArr, toReadableNumber, initOptions } from '../utils';
import SelectInput from '../form/selectinput';
import RadialInput from '../form/radialinput';
import Section from '../form/section';
import ItemDisplay from './ItemDisplay';
import { COLORS } from '../../CONSTANTS';
import HSwitch from '../HSwitch';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import { GoalType } from '../../api/goals';
import LoanInterest from './LoanInterest';
import { Collapse, Row } from 'antd';

export default function LoanDetails() {
	const { Panel } = Collapse;
	const { goal, currency, startYear, endYear }: any = useContext(CalcContext);
	const {
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
		isEndYearHidden,
		simpleInts,
		remSI,
		loanBorrowAmt,
		emi,
		loanPMI,
		setLoanPMI,
		loanPMIEndPer,
		setLoanPMIEndPer
	}: any = useContext(GoalContext);

	const loanLimitPer = goal.type === GoalType.E ? 100 : 90;
	const [ totalSI, setTotalSI ] = useState<number>(0);

	useEffect(
		() => {
			let totalSI = 0;
			simpleInts.forEach((int: number) => (totalSI += int));
			setTotalSI(totalSI);
		},
		[ simpleInts ]
	);

	return (
		<Section title="Loan Details" videoSrc={`https://www.youtube.com/watch?v=NuJdxuIsYl4&t=320s`}>
			{!isEndYearHidden && (
				<NumberInput
					unit="%"
					pre="Cost % to be Borrowed"
					value={loanPer}
					changeHandler={setLoanPer}
					step={1}
					min={0}
					max={loanLimitPer}
					additionalMarks={[ 20, 50, 70 ]}
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
							0: 'No Delay',
							1: '1 Month',
							2: '2 Months',
							3: '3 Months'
						}}
						value={loanRepaymentMonths}
						changeHandler={(months: string) => setLoanRepaymentMonths(parseInt(months))}
					/>
				}
			/>
			{loanBorrowAmt &&
			loanPer > 80 && (
				<NumberInput
					currency={currency}
					pre="Monthly Insurance for Repayment Protection"
					value={loanPMI}
					changeHandler={setLoanPMI}
					min={0}
					max={Math.round(emi * 0.1)}
					step={1}
					note={
						loanPMI ? (
							<SelectInput
								pre="Ends when Outstanding Principal is"
								value={loanPMIEndPer}
								changeHandler={setLoanPMIEndPer}
								options={initOptions(75, 10)}
								unit="%"
							/>
						) : (
							<div />
						)
					}
				/>
			)}
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
			{loanBorrowAmt && (
				<Row align="middle" justify="center">
					<ItemDisplay label="Monthly Installment" result={emi} currency={currency} decimal={2} />
				</Row>
			)}
			{goal.type === GoalType.E &&
			!Number.isNaN(loanSIPayPer) && //@ts-ignore
			loanSIPayPer < 100 && (
				<HSwitch
					rightText={`Pay ${toCurrency(remSI, currency)} in ${endYear + 1} Grace Period`}
					value={loanSICapitalize as number}
					setter={setLoanSICapitalize}
				/>
			)}

			<Collapse defaultActiveKey={[ '1' ]}>
				<Panel header="Loan Duration" key="1">
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
				</Panel>
				<Panel header="Monthly Installment" key="2">
					{loanBorrowAmt && (
						<ItemDisplay label="Monthly Installment" result={emi} currency={currency} decimal={2} />
					)}
				</Panel>
			</Collapse>
		</Section>
	);
}
