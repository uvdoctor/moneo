import React, { useContext } from "react";
import Section from "../form/section";
import NumberInput from "../form/numberinput";
import HSwitch from "../HSwitch";
import { GoalType, TargetInput } from "../../api/goals";
import { toHumanFriendlyCurrency } from "../utils";
import { GoalContext } from "./GoalContext";
import { CalcContext } from "../calc/CalcContext";
import { useRouter } from "next/router";
import { ROUTES } from "../../CONSTANTS";
import { isLoanEligible } from "./goalutils";
import DateInput from "../form/DateInput";
import { PlanContext } from "./PlanContext";

export default function Cost() {
	const { goal, currency, startYear, inputTabs, setInputTabs, endYear, changeEndYear }: any = useContext(
		CalcContext
	);
	const { ffGoal }: any = useContext(PlanContext);
	const {
		startingPrice,
		setStartingPrice,
		wipTargets,
		setWIPTargets,
		price,
		priceChgRate,
		setPriceChgRate,
		manualMode,
		eduCostSemester,
		setEduCostSemester,
		isLoanMandatory,
		setManualMode
	}: any = useContext(GoalContext);
	const router = useRouter();
	const isLoanPublicCalc = router.pathname === ROUTES.LOAN;
	const lastStartYear = ffGoal ? (ffGoal.sy + (ffGoal.loan?.dur as number)) - 20 : goal.by + 30;
	
	const changeTargetVal = (val: number, i: number) => {
		if (!wipTargets || !setWIPTargets) return;
		wipTargets[i].val = val;
		setWIPTargets([...wipTargets]);
	};

	const changeManualMode = (value: number) => {
		if (isLoanEligible(goal.type)) {
			const loanTabIndex = 1;
			if (value) {
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
		setManualMode(value);
	};

	return (
		<Section
			title="Payment plan"
			toggle={
				!isLoanMandatory && (
					<HSwitch rightText='Multi-year'  value={manualMode} setter={changeManualMode} />
				)
			}
		>
			{(goal.type !== GoalType.B || manualMode) && (
					<DateInput
						title="Ends"
						key={endYear}
						startYearValue={endYear}
						info="Year in which You End Paying"
						disabled={goal.type === GoalType.B && manualMode < 1}
						startYearHandler={changeEndYear}
						initialValue={startYear}
						endValue={lastStartYear + 20}
					/>
			)}

			{manualMode && wipTargets.length && wipTargets.map((t: TargetInput, i: number) => (
				<NumberInput
					pre={t.num}
					currency={currency}
					value={t.val}
					changeHandler={(val: number) => changeTargetVal(val, i)}
					min={0}
					step={10}
					key={"t" + i}
				/>
			))}

			{!manualMode && <NumberInput
				pre={isLoanPublicCalc ? "Borrow" : `Today's cost`}
				info="Please input total amount considering taxes and fees"
				currency={currency}
				value={startingPrice}
				changeHandler={setStartingPrice}
				min={10}
				step={10}
				post={
					goal.type === GoalType.E ? (
						<HSwitch
							value={eduCostSemester}
							setter={setEduCostSemester}
							rightText="Every 6 Months"
						/>
					) : null
				}
			/>}

			{startYear > goal.by && !isLoanPublicCalc && !manualMode && (
				<NumberInput
					pre="Yearly cost change"
					unit="%"
					min={-10}
					max={10}
					step={0.1}
					value={priceChgRate}
					changeHandler={setPriceChgRate}
					info="Rate at which cost is expected to change on yearly basis considering inflation and other factors."
					post={
						priceChgRate
							? `${toHumanFriendlyCurrency(price, currency)} in ${startYear}`
							: ""
					}
				/>
			)}
		</Section>
	);
}
