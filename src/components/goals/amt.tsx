import React, { useContext, useState } from 'react';
import SelectInput from '../form/selectinput';
import { initYearOptions } from '../utils';
import Cost from './cost';
import { Col } from 'antd';
import { GoalContext } from './GoalContext';
import Section from '../form/section';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';

export default function Amt() {
	const { goal, startYear, changeStartYear, endYear, changeEndYear, eyOptions }: any = useContext(CalcContext);
	const { ffGoalEndYear, manualMode }: any = useContext(GoalContext);
	const [ syOptions ] = useState(initYearOptions(goal.by + 1, ffGoalEndYear - 20 - (goal.by + 1)));

	return (
		<Col span={24}>
			<Section title="Payment Schedule">
				<SelectInput
					pre="From Year"
					info="Year in which You Start Paying"
					value={startYear}
					changeHandler={changeStartYear}
					options={syOptions}
				/>
				<SelectInput
					pre="To Year"
					value={endYear}
					info="Year in which You End Paying"
					disabled={goal.type === GoalType.B && manualMode < 1}
					changeHandler={changeEndYear}
					options={eyOptions}
				/>
			</Section>
			<Cost />
		</Col>
	);
}
