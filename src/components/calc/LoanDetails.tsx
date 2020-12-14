import React, { Fragment, useContext, useState } from 'react';
import NumberInput from '../form/numberinput';
import { toHumanFriendlyCurrency, toReadableNumber } from '../utils';
import SelectInput from '../form/selectinput';
import Section from '../form/section';
import ItemDisplay from './ItemDisplay';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import { GoalType } from '../../api/goals';
import LoanInterest from './LoanInterest';
import LoanAdvOptions from './LoanAdvOptions';
import { Button, Col, Modal, Row } from 'antd';
import MonthlyLoanSchedule from './MonthlyLoanSchedule';
import Draggable from 'react-draggable';

export default function LoanDetails() {
	const { fsb, goal, currency, isPublicCalc, startYear, endYear }: any = useContext(CalcContext);
	const {
		loanRepaymentMonths,
		loanMonths,
		loanPer,
		price,
		setLoanPer,
		setLoanMonths,
		setLoanRepaymentMonths,
		isEndYearHidden,
		loanBorrowAmt,
		emi
	}: any = useContext(GoalContext);

	const loanMinLimitPer = goal.type === GoalType.E && isPublicCalc ? 10 : 0;

	const loanMaxLimitPer = goal.type === GoalType.E ? 100 : 90;

	const [ loanScheduleModal, setLoanScheduleModal ] = useState<boolean>(false);

	const showLoanSchedule = () => setLoanScheduleModal(true);

	const hideLoanSchedule = () => setLoanScheduleModal(false);

	return (
		<Fragment>
			<Section title="Loan Details" videoSrc={`https://www.youtube.com/watch?v=NuJdxuIsYl4&t=320s`}>
				{!isEndYearHidden && (
					<NumberInput
						unit={`% (${toHumanFriendlyCurrency(Math.round(loanPer * price / 100), currency)})`}
						pre="Borrow"
						value={loanPer}
						changeHandler={setLoanPer}
						step={1}
						min={loanMinLimitPer}
						max={loanMaxLimitPer}
						additionalMarks={[ 20, 50, 70 ]}
					/>
				)}
				{loanBorrowAmt && (
					<NumberInput
						pre="Duration"
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
				{loanBorrowAmt && (
					<Row justify="space-between">
						<Col>
							<ItemDisplay
								label={`Loan Principal${goal.type === GoalType.E ? ' Due' : ''}`}
								result={loanBorrowAmt}
								currency={currency}
								precise
								footer={
									goal.type !== GoalType.E ? (
										<SelectInput
											pre="Delay"
											options={{
												0: 'None',
												1: '1 Month',
												2: '2 Months',
												3: '3 Months'
											}}
											value={loanRepaymentMonths}
											changeHandler={(months: string) => setLoanRepaymentMonths(parseInt(months))}
										/>
									) : (
										`${startYear} to ${endYear}`
									)
								}
							/>
						</Col>
						<Col>
							<ItemDisplay
								label="Monthly Installment"
								result={emi}
								currency={currency}
								precise
								decimal={2}
								footer={
									<Button type="link" onClick={showLoanSchedule}>
										Adjust Schedule
									</Button>
								}
							/>
						</Col>
					</Row>
				)}
				{emi && <LoanAdvOptions />}
			</Section>
			{loanScheduleModal && (
				<Modal
					title="Adjust Loan Schedule"
					onCancel={hideLoanSchedule}
					footer={null}
					visible={loanScheduleModal}
					centered
					width={700}
					//@ts-ignore
					modalRender={(modal: any) => <Draggable disabled={fsb.info.innerWidth < 1200}>{modal}</Draggable>}
				>
					<MonthlyLoanSchedule editable />
				</Modal>
			)}
		</Fragment>
	);
}
