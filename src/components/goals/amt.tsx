import React, { useContext, useState } from 'react';
import SelectInput from '../form/selectinput';
import { initYearOptions } from '../utils';
import Cost from './cost';
import { Row, Col } from 'antd';
import { GoalContext } from './GoalContext';

export default function Amt() {
	const {
		goal,
		ffGoalEndYear,
		startYear,
		changeStartYear,
		endYear,
		changeEndYear,
		manualMode,
		eyOptions,
	}: any = useContext(GoalContext);
	const [ syOptions ] = useState(initYearOptions(goal.by + 1, ffGoalEndYear - 20 - (goal.by + 1)));

	return (
		<Col span={24}>
			<Col span={24}><h3>Payment Schedule</h3></Col>
			<Row align="middle" justify="space-around" style={{ marginBottom: '1rem' }}>
				<Col>
					<SelectInput
						pre="From"
						info="Year in which You Start Paying for the Goal"
						value={startYear}
						changeHandler={changeStartYear}
						options={syOptions}
					/>
				</Col>
				<Col>
					<SelectInput
						pre="To"
						value={endYear}
						info="Year in which You End Paying for the Goal"
						disabled={goal.type === goal.type.B && manualMode < 1}
						changeHandler={changeEndYear}
						options={eyOptions}
					/>
				</Col>
			</Row>
			<Cost />
		</Col>
	);
}
