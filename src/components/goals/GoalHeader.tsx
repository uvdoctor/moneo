import React, { useContext } from 'react';
import CalcHeader from '../calc/CalcHeader';
import TextInput from '../form/textinput';
import { GoalContext } from './GoalContext';
import { PlanContext } from './PlanContext';

export default function GoalHeader() {
	const { isPublicCalc }: any = useContext(PlanContext);
	const { name, setName }: any = useContext(GoalContext);
	return (
		<CalcHeader>
			{!isPublicCalc ? (
				<TextInput
					name="name"
					pre=""
					placeholder="Goal Name"
					value={name}
					changeHandler={setName}
				/>
			) : null}
		</CalcHeader>
	);
}
