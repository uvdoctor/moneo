import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import CalcHeader from '../calc/CalcHeader';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { GoalContext } from './GoalContext';
import { getGoalTypes, getImpLevels } from './goalutils';

export default function GoalHeader() {
	const typesList: any = getGoalTypes();
	const { goal, addCallback, updateCallback }: any = useContext(CalcContext);
	const { name, setName, impLevel, setImpLevel }: any = useContext(GoalContext);
	return (
		<CalcHeader
			title={
				addCallback &&
				updateCallback && (
					<TextInput
						name="name"
						pre={typesList[goal.type]}
						placeholder="Goal Name"
						value={name}
						changeHandler={setName}
						width="150px"
					/>
				)
			}
		>
			{addCallback &&
			updateCallback && (
				<SelectInput pre="Importance" value={impLevel} changeHandler={setImpLevel} options={getImpLevels()} />
			)}
		</CalcHeader>
	);
}
