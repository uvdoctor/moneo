import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import CalcHeader from '../calc/CalcHeader';
import TextInput from '../form/textinput';
import { GoalContext } from './GoalContext';

export default function GoalHeader() {
	const { isPublicCalc }: any = useContext(CalcContext);
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
