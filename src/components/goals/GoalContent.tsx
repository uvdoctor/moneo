import React, { Fragment, useContext } from 'react'
import { GoalType } from '../../api/goals';
import CalcTemplate from '../calc/CalcTemplate';
import ItemDisplay from '../calc/ItemDisplay';
import OppCost from '../calc/oppcost';
import FFImpact from './ffimpact';
import { GoalContext } from './GoalContext';
import GoalHeader from './GoalHeader';

export default function GoalContent() {
  const {
    allInputDone,
    brAns,
    startYear,
    dr,
    goal
  }: any = useContext(GoalContext);
  const nowYear = new Date().getFullYear();

  return (
  <Fragment>
    {!allInputDone && <GoalHeader />}
    <CalcTemplate results={
      nowYear < startYear ? [
        (dr === null || dr === undefined) ? 
          <FFImpact />
          : goal.type === GoalType.B && <ItemDisplay label="Buy v/s Rent" result={brAns} info={brAns} />,
        <OppCost contextType={GoalContext} />
        ] : []}
      />
      </Fragment>
  )
}