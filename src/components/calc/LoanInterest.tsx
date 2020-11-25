import React, { Fragment, useContext } from 'react';
import { Col } from 'antd';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import NumberInput from '../form/numberinput';
import HSwitch from '../HSwitch';
import { GoalType, LoanType } from '../../api/goals';

export default function LoanInterest() {
	const { goal }: any = useContext(CalcContext);
	const { loanIntRate, setLoanIntRate, loanType, setLoanType }: any = useContext(GoalContext);

	const changeLoanType = (val: number) => setLoanType(val < 1 ? LoanType.A : LoanType.B);

	return (
		<Fragment>
			{goal.type !== GoalType.E && (
				<HSwitch
					rightText="Balloon Payment"
					value={loanType === LoanType.A ? 0 : 1}
					setter={changeLoanType}
				/>
			)}
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
					min={0}
					max={25}
					step={0.1}
					additionalMarks={[ 5, 10, 15, 20 ]}
				/>
			</Col>
		</Fragment>
	);
}
