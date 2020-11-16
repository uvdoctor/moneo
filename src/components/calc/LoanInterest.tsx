import React, { Fragment, useContext, useEffect } from 'react';
import { Col, Row } from 'antd';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';
import NumberInput from '../form/numberinput';
import HSwitch from '../HSwitch';
import { getIR } from './finance';
import { GoalType } from '../../api/goals';

export default function LoanInterest() {
	const { goal, currency }: any = useContext(CalcContext);
	const { price, loanBorrowAmt, loanYears, loanIntRate, setLoanIntRate, emi, setEMI, noIR, setNoIR }: any = useContext(GoalContext);

	useEffect(
		() => {
			if (goal.type === GoalType.E || noIR < 1) return;
			setLoanIntRate(getIR(loanBorrowAmt, emi, loanYears * 12));
		},
		[ noIR, loanBorrowAmt, emi, loanYears ]
	);

	return (
		<Fragment>
      {goal.type !== GoalType.E && <HSwitch rightText="Input Monthly Installment" value={noIR} setter={setNoIR} />}
			<Col span={24}>
				{noIR < 1 ? (
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
				) : (
					<NumberInput
						pre="Monthly Installment"
						value={emi}
						changeHandler={setEMI}
						min={100}
						step={100}
						max={price}
						currency={currency}
					/>
				)}
			</Col>
			<Row align="middle" justify="center">
				{noIR < 1 ? (
					<ItemDisplay label="Monthly Installment" result={emi} currency={currency} />
				) : (
					<ItemDisplay label="Interest Rate" result={loanIntRate} unit="%" />
				)}
			</Row>
		</Fragment>
	);
}
