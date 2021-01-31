import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import CalcHeader from '../calc/CalcHeader';
import TextInput from '../form/textinput';
import { GoalContext } from './GoalContext';

export default function GoalHeader() {
	const { addCallback, updateCallback }: any = useContext(CalcContext);
	const { name, setName }: any = useContext(GoalContext);
	return (
		<CalcHeader>
			{addCallback && updateCallback ? (
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
