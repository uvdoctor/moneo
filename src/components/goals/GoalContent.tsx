import React, { Fragment, useContext } from 'react'
import { GoalType } from '../../api/goals';
import { CalcContext } from '../calc/CalcContext';
import CalcTemplate from '../calc/CalcTemplate';
import ItemDisplay from '../calc/ItemDisplay';
import OppCost from '../calc/oppcost';
import FFImpact from './ffimpact';
import { GoalContext } from './GoalContext';
import GoalHeader from './GoalHeader';

export default function GoalContent() {
  const {
    allInputDone,
    startYear,
    dr,
    goal
  }: any = useContext(CalcContext);
  const { brAns }: any = useContext(GoalContext)
  const nowYear = new Date().getFullYear();

  return (
  <Fragment>
    {!allInputDone && <GoalHeader />}
    <CalcTemplate results={
      nowYear < startYear ? [
        (dr === null || dr === undefined) ? 
          <FFImpact />
          : goal.type === GoalType.B && <ItemDisplay label="Buy or Rent?" result={brAns} />,
        <OppCost />
        ] : []}
      />
      </Fragment>
  )
}