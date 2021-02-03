import { Button } from 'antd';
import React, { useContext } from 'react';
import { GoalType } from '../../api/goals';
import { AppContext } from '../AppContext';
import { createNewGoalInput } from './goalutils';
import { PlanContext } from './PlanContext';

export default function SetPlanIndex() {
	const { defaultCurrency }: any = useContext(AppContext);
	const { setWIPGoal }: any = useContext(PlanContext);
	
	return (
		<div style={{ textAlign: 'center' }}>
			<h3>First Things First.</h3>
			<h3>Set Financial Independence Target.</h3>
			<Button type="primary" onClick={() => setWIPGoal(createNewGoalInput(GoalType.FF, defaultCurrency))}>
				Get Started
			</Button>
		</div>
	);
}
