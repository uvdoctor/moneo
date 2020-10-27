import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { CalcContext } from '../calc/CalcContext';
import CalcHeader from '../calc/CalcHeader';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { GoalContext } from './GoalContext';
import { getGoalTypes, getImpLevels } from './goalutils';

export default function GoalHeader() {
	const typesList: any = getGoalTypes();
	const { allInputDone, goal, addCallback, updateCallback }: any = useContext(CalcContext);
	const { name, setName, impLevel, setImpLevel }: any = useContext(GoalContext);
	return addCallback && updateCallback ? (
		<Row align="middle" justify="space-between" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
			<Col span={11}>
				<TextInput
					name="name"
					pre={typesList[goal.type]}
					placeholder="Goal Name"
					value={name}
					changeHandler={setName}
					width="150px"
				/>
			</Col>
			<Col span={11}>
				<SelectInput pre="Importance" value={impLevel} changeHandler={setImpLevel} options={getImpLevels()} />
			</Col>
		</Row>
	) : !allInputDone ? (
		<CalcHeader />
	) : null;
}
