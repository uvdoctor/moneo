import React, { useContext } from 'react';
import SelectInput from '../form/selectinput';
import Cost from './cost';
import { GoalContext } from './GoalContext';
import Section from '../form/section';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';
import { PlanContext } from './PlanContext';
import { getImpLevels, isLoanEligible } from './goalutils';
import RadioInput from '../form/RadioInput';
import DateInput from '../form/DateInput';


export default function GoalCost() {
	const { isPublicCalc }: any = useContext(PlanContext);
	const {
		goal,
		startYear,
		changeStartYear,
		endYear,
		changeEndYear,
		startMonth,
		changeStartMonth,
		inputTabs, 
		setInputTabs
	}: any = useContext(CalcContext);
	//const lastStartYear = ffGoal ? (ffGoal.sy + (ffGoal.loan?.dur as number)) - 20 : goal.by + 30;
	const { manualMode, isEndYearHidden, impLevel, setImpLevel, setManualMode, isLoanMandatory}: any = useContext(GoalContext);
	const firstStartYear = isPublicCalc ? goal.by - 20 : goal.by + 1;
	const MANUAL = "Manual";

	const changeManualMode = (value: string) => {
		if (isLoanEligible(goal.type)) {
			let loanTabIndex = goal.type === GoalType.B ? 2 : 1;
			if (value === MANUAL) {
				if (inputTabs[loanTabIndex].active) {
					inputTabs[loanTabIndex].active = false;
					setInputTabs([ ...inputTabs ]);
				}
			} else {
				if (!inputTabs[loanTabIndex].active) {
					inputTabs[loanTabIndex].active = true;
					setInputTabs([ ...inputTabs ]);
				}
			}
		}
		setManualMode(value === MANUAL ? 1 : 0);
	};

	const showStartMonth = (isPublicCalc || goal.type === GoalType.B || goal.type === GoalType.E) && !manualMode

	return (
		<>
			<Section title="Payment schedule"
				toggle={
					setManualMode &&
					!isLoanMandatory && (
						<RadioInput options={["Auto", MANUAL]} value={manualMode ? MANUAL : "Auto"} 
							changeHandler={(val: string) => changeManualMode(val)} />
					)
				}
			>
				{!isPublicCalc && (
					<SelectInput
						pre="Priority"
						value={impLevel}
						changeHandler={setImpLevel}
						options={getImpLevels()}
						info='How important is it for you to achieve this goal? Investment strategy will consider this in order to come up with possible options.'
					/>
				)}
				
				<DateInput
					title="Starts"
					info="Month and year when payment starts"
					startYearValue={startYear}
					startYearHandler={changeStartYear}
					startMonthHandler={showStartMonth ? changeStartMonth : null}
					startMonthValue={showStartMonth ? startMonth : null}
					initialValue={firstStartYear}
				/>

				{!isEndYearHidden && (
					<DateInput
						title="Ends"
						key={endYear}
						startYearValue={endYear}
						info="Year in which You End Paying"
						disabled={goal.type === GoalType.B && manualMode < 1}
						startYearHandler={changeEndYear}
						initialValue={startYear}
					/>
				)}
			</Section>
			<p>&nbsp;</p>
			<Cost />
		</>
	);
}
