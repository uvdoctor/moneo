import React, { Fragment, useContext, useState } from 'react';
import NumberInput from '../form/numberinput';
import { toReadableNumber } from '../utils';
import SelectInput from '../form/selectinput';
import Section from '../form/section';
import ItemDisplay from './ItemDisplay';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import { GoalType } from '../../api/goals';
import LoanInterest from './LoanInterest';
import LoanAdvOptions from './LoanAdvOptions';
import { Button, Modal } from 'antd';
import MonthlyLoanSchedule from './MonthlyLoanSchedule';
import Draggable from 'react-draggable';
import { PlanContext } from '../goals/PlanContext';

export default function LoanDetails() {
	const { isPublicCalc }: any = useContext(PlanContext);
	const { goal, fsb, currency, startYear, endYear }: any = useContext(CalcContext);
	const {
		loanRepaymentMonths,
		loanMonths,
		loanPer,
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
			<Section title="Loan Details">
				{!isEndYearHidden && (
					<NumberInput
						unit="%"
						pre="Borrow"
						value={loanPer}
						changeHandler={setLoanPer}
						min={loanMinLimitPer}
						max={loanMaxLimitPer}
					/>
				)}
				{loanBorrowAmt && (
					<NumberInput
						pre="Duration"
						unit="months"
						value={loanMonths}
						changeHandler={setLoanMonths}
						min={6}
						max={360}
						step={1}
						post={<div>&nbsp;&nbsp;&nbsp;{`${toReadableNumber(loanMonths / 12, 2)} years`}</div>}
					/>
				)}
				{loanBorrowAmt && <LoanInterest />}
				{loanBorrowAmt && 
					<ItemDisplay
						label={`Loan Principal${goal.type === GoalType.E ? ' Due' : ''}`}
								result={loanBorrowAmt}
								currency={currency}
								precise
								footer={
									goal.type !== GoalType.E ? (
										<>
										Delay&nbsp;
										<SelectInput
											pre=""
											options={{
												0: 'None',
												1: '1 Month',
												2: '2 Months',
												3: '3 Months'
											}}
											value={loanRepaymentMonths}
											changeHandler={(months: string) => setLoanRepaymentMonths(parseInt(months))}
										/>
										</>
									) : (
										`${startYear} to ${endYear}`
									)
						}
					/>}
				{loanBorrowAmt && 
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
					/>}
				{emi && <LoanAdvOptions />}
			</Section>
			{loanScheduleModal && (
				<Modal
					title="Adjust loan schedule"
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
