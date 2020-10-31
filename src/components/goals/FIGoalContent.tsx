import React, { Fragment, useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import CalcTemplate from '../calc/CalcTemplate';
import ItemDisplay from '../calc/ItemDisplay';
import { isFFPossible } from './cfutils';
import { FIGoalContext } from './FIGoalContext';
import FIGoalHeader from './FIGoalHeader';
import { getAge } from './goalutils';

export default function FIGoalContent() {
	const { allInputDone, currency, endYear, ffResult }: any = useContext(CalcContext);
  const { leaveBehind }: any = useContext(FIGoalContext);

	return (
		<Fragment>
			{!allInputDone && <FIGoalHeader />}
			<CalcTemplate
        results={
          isFFPossible(ffResult, leaveBehind) ? 
                [<ItemDisplay
                  label="Earliest At"
                  result={getAge(ffResult.ffYear, endYear).toString()}
                  noResultFormat
                  info={`You May achieve Financial Independence earliest at an age of ${
                    getAge(ffResult.ffYear, endYear)
                  } Years.`}
                  unit="Years"
                  imp={
                    ffResult.oom
                      ? `You May Not Have Enough Savings in Years ${ffResult.oom.map(
                          (year: number) => ` ${year}`
                        )}`
                      : ""
                  }
                />,
              <ItemDisplay
                result={ffResult.ffAmt}
                label={`Potential Savings`}
                currency={currency}
                info="You can Withdraw from this Savings for Your expenses after gaining Financial Independence."
              />]
          : (
              <label>Financial Independence May not be possible till You turn 70. Please try
              again with different Goals / Inputs.</label>
          )
        }
			/>
		</Fragment>
	);
}
