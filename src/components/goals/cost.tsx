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
import SelectInput from "../form/selectinput";

export default function Cost() {
	const { goal, currency, setCurrency, startYear }: any = useContext(
		CalcContext
	);
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
	}: any = useContext(GoalContext);
	const router = useRouter();
	const isLoanPublicCalc = router.pathname === ROUTES.LOAN;

	const changeTargetVal = (val: number, i: number) => {
		if (!wipTargets || !setWIPTargets) return;
		wipTargets[i].val = val;
		setWIPTargets([...wipTargets]);
	};

	return manualMode ? (
		<Section
			title={isLoanPublicCalc ? "Borrow" : "Cost"}
			toggle={
				<SelectInput
					pre=""
					value={currency}
					changeHandler={setCurrency}
					currency
				/>
			}
		>
			{wipTargets.map((t: TargetInput, i: number) => (
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
		</Section>
	) : (
		<Section
			title={isLoanPublicCalc ? "Borrow" : "Cost"}
			toggle={
				<SelectInput
					pre=""
					value={currency}
					changeHandler={setCurrency}
					currency
				/>
			}
		>
			<NumberInput
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
			/>
			{startYear > goal.by && !isLoanPublicCalc && (
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
