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
		eyOptions
	}: any = useContext(GoalContext);
	const [ syOptions ] = useState(initYearOptions(goal.by + 1, ffGoalEndYear - 20 - (goal.by + 1)));

	return (
		<Row align="middle">
			<Col span={24}>
				<Row align="middle" justify="space-between" style={{margin: '1rem'}}>
					<Col span={10}>
						<SelectInput
							pre="When?"
							info="Year in which You Start Paying for the Goal"
							value={startYear}
							changeHandler={changeStartYear}
							options={syOptions}
						/>
					</Col>
					<Col span={10}>
						<SelectInput
							pre={`Pay Until`}
							value={endYear}
							info="Year in which You End Paying for the Goal"
							disabled={goal.type === goal.type.B && manualMode < 1}
							changeHandler={changeEndYear}
							options={eyOptions}
						/>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<Cost/>
			</Col>
		</Row>
	);
}
