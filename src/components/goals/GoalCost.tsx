import React, { useContext } from 'react';
import SelectInput from '../form/selectinput';
import { initYearOptions } from '../utils';
import Cost from './cost';
import { Col } from 'antd';
import { GoalContext } from './GoalContext';
import Section from '../form/section';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';
import { getImpLevels } from './goalutils';

export default function GoalCost() {
	const {
		goal,
		startYear,
		changeStartYear,
		endYear,
		changeEndYear,
		eyOptions,
		addCallback,
		impLevel,
		setImpLevel,
		isPublicCalc
	}: any = useContext(CalcContext);
	const { ffGoalEndYear, manualMode, isEndYearHidden }: any = useContext(GoalContext);
	const firstStartYear = isPublicCalc ? goal.by - 20 : goal.by + 1;
	const syOptions = initYearOptions(firstStartYear, ffGoalEndYear - 20 - firstStartYear);

	return (
		<Col span={24}>
			<Section title="Schedule">
				{addCallback && (
					<SelectInput
						pre="Importance"
						value={impLevel}
						changeHandler={setImpLevel}
						options={getImpLevels()}
					/>
				)}
				<SelectInput
					pre="From Year"
					info="Year in which You Start Paying"
					value={startYear}
					changeHandler={changeStartYear}
					options={syOptions}
				/>
				{!isEndYearHidden && (
					<SelectInput
						pre="To Year"
						value={endYear}
						info="Year in which You End Paying"
						disabled={goal.type === GoalType.B && manualMode < 1}
						changeHandler={changeEndYear}
						options={eyOptions}
					/>
				)}
			</Section>
			<Cost />
		</Col>
	);
}
