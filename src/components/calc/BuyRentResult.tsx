import React, { useContext } from 'react'
import { GoalContext } from '../goals/GoalContext';
import ItemDisplay from './ItemDisplay';

export default function BuyRentResult() {
  const { brAns }: any = useContext(GoalContext);
  
  return (
    <ItemDisplay label="Buy or Rent?" result={brAns} />
  )
}