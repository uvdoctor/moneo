import React, { useContext } from 'react';
import SelectInput from '../form/selectinput';
import { initOptions, MONTHS } from '../utils';
import Cost from './cost';
import { Col } from 'antd';
import { GoalContext } from './GoalContext';
import Section from '../form/section';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';
import { PlanContext } from './PlanContext';
import { getImpLevels } from './goalutils';

export default function GoalCost() {
	const { isPublicCalc, ffGoal }: any = useContext(PlanContext);
	const {
		goal,
		startYear,
		changeStartYear,
		endYear,
		changeEndYear,
		eyOptions,
		startMonth,
		changeStartMonth,
	}: any = useContext(CalcContext);
	const ffGoalEndYear = ffGoal ? (ffGoal.sy + (ffGoal.loan?.dur as number)) : goal.by + 50;
	const { manualMode, isEndYearHidden, impLevel, setImpLevel}: any = useContext(GoalContext);
	const firstStartYear = isPublicCalc ? goal.by - 20 : goal.by + 1;
	const syOptions = initOptions(firstStartYear, ffGoalEndYear - 20 - firstStartYear);

	return (
		<Col span={24}>
			<Section title="Payment Schedule">
				{!isPublicCalc && (
					<SelectInput
						pre="Priority"
						value={impLevel}
						changeHandler={setImpLevel}
						options={getImpLevels()}
						info='How important is it for you to achieve this goal? Investment strategy will consider this in order to come up with possible options.'
					/>
				)}
				<SelectInput
					pre="Starting Year"
					info="Year in which You Start Paying"
					value={startYear}
					changeHandler={changeStartYear}
					options={syOptions}
				/>
				{(isPublicCalc || goal.type === GoalType.B || goal.type === GoalType.E) && <SelectInput
					pre="Starting Month"
					info="Month of Year when You Start Paying"
					value={startMonth}
					changeHandler={changeStartMonth}
					options={MONTHS}
					disabled={manualMode > 0}
				/>}
				{!isEndYearHidden && (
					<SelectInput
						pre="Ending Year"
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
