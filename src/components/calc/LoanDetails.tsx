import React, { Fragment, useContext, useState } from 'react';
import NumberInput from '../form/numberinput';
import { toCurrency, toReadableNumber } from '../utils';
import SelectInput from '../form/selectinput';
import Section from '../form/section';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import { GoalType } from '../../api/goals';
import LoanAdvOptions from './LoanAdvOptions';
import { Button, Modal, Tooltip } from 'antd';
import MonthlyLoanSchedule from './MonthlyLoanSchedule';
import Draggable from 'react-draggable';
import { PlanContext } from '../goals/PlanContext';
import { SettingOutlined } from '@ant-design/icons';

export default function LoanDetails() {
	const { isPublicCalc }: any = useContext(PlanContext);
	const { goal, fsb, currency }: any = useContext(CalcContext);
	const {
		loanRepaymentMonths,
		loanMonths,
		loanPer,
		setLoanPer,
		setLoanMonths,
		setLoanRepaymentMonths,
		loanBorrowAmt,
		loanIntRate,
		setLoanIntRate,
		emi
	}: any = useContext(GoalContext);

	const loanMinLimitPer = goal.type === GoalType.E && isPublicCalc ? 10 : 0;

	const loanMaxLimitPer = goal.type === GoalType.E ? 100 : 90;

	const [ loanScheduleModal, setLoanScheduleModal ] = useState<boolean>(false);

	const showLoanSchedule = () => setLoanScheduleModal(true);

	const hideLoanSchedule = () => setLoanScheduleModal(false);

	return (
		<Fragment>
			<Section title="Loan Details" toggle={
				emi ? <Tooltip title="Adjust loan schedule">
							<Button type="link" onClick={showLoanSchedule} icon={<SettingOutlined />} />
						</Tooltip>
					: null
			}>
				<NumberInput
						unit="%"
						pre="Borrow"
						value={loanPer}
						changeHandler={setLoanPer}
						min={loanMinLimitPer}
						max={loanMaxLimitPer}
						post={toCurrency(loanBorrowAmt, currency)}
				/>
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
				{loanBorrowAmt && <NumberInput
					pre="Yearly Interest"
					unit="%"
					value={loanIntRate}
					changeHandler={setLoanIntRate}
					max={25}
					step={0.01}
					post={emi ? `Monthly installment ${toCurrency(emi, currency)}` :''}
				/>}
				{loanBorrowAmt && goal.type !== GoalType.E &&
					<SelectInput
					pre="Repayment delay"
					info="Delay in starting repayment of the loan, as agreed with the lender"
					options={{
						0: 'None',
						1: '1 Month',
						2: '2 Months',
						3: '3 Months'
					}}
					value={loanRepaymentMonths}
					changeHandler={(months: string) => setLoanRepaymentMonths(parseInt(months))}
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
