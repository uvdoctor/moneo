import React, { useContext, useState } from 'react';
import SelectInput from '../form/selectinput';
import GoalPayment from './GoalPayment';
import { GoalContext } from './GoalContext';
import Section from '../form/section';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';
import { PlanContext } from './PlanContext';
import { getImpLevels } from './goalutils';
import DateInput from '../form/DateInput';
import RadialInput from '../form/radialinput';
import { toHumanFriendlyCurrency, toStringArr } from '../utils';
import NumberInput from '../form/numberinput';
import { useRouter } from 'next/router';
import { ROUTES } from '../../CONSTANTS';


export default function GoalDetails() {
	const router = useRouter();
	const { isPublicCalc, ffGoal }: any = useContext(PlanContext);
	const {
		goal,
		startYear,
		changeStartYear,
		startMonth,
		changeStartMonth,
		currency,
		setCurrency,
		endYear,
		changeEndYear
	}: any = useContext(CalcContext);
	const lastStartYear = ffGoal ? (ffGoal.sy + (ffGoal.loan?.dur as number)) - 20 : goal.by + 30;
	const { manualMode, impLevel, setImpLevel, sellAfter, setSellAfter, assetChgRate, setAssetChgRate, sellPrice }: any = useContext(GoalContext);
	const firstStartYear = isPublicCalc ? goal.by - 20 : goal.by + 1;
	const showStartMonth = (isPublicCalc || goal.type === GoalType.B) && !manualMode && goal.type !== GoalType.E
	const [ depreciates, setDepreciates ] = useState<boolean>(assetChgRate < 0);

	return (
		<>
			<Section title="Goal details"
				toggle={
					<SelectInput
						pre=""
						value={currency}
						changeHandler={setCurrency}
						currency
					/>
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
					title={goal.type === GoalType.B ? "Buy in" : "Starts"}
					info={`${showStartMonth ? 'Month and year' : 'Year'} when you want to ${goal.type === GoalType.B ? "buy" : "spend"}.`}
					startYearValue={startYear}
					startYearHandler={changeStartYear}
					startMonthHandler={showStartMonth ? changeStartMonth : null}
					startMonthValue={showStartMonth ? startMonth : null}
					initialValue={firstStartYear}
					endValue={lastStartYear}
				/>

				{goal.type !== GoalType.B && !router.pathname.endsWith(ROUTES.LOAN) && (
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

				{goal.type === GoalType.B && 
					<RadialInput
						info="Years after which you plan to sell."
						label="Years"
						pre="Sell After"
						labelBottom={true}
						data={toStringArr(3, 30)}
						value={sellAfter}
						step={1}
						changeHandler={setSellAfter}
					/>
				}

				{goal.type === GoalType.B && 
					<NumberInput
						info="Approximate rate at which you expect resale value to change yearly."
						pre="Assume yearly resale value"
						addBefore={
							<SelectInput pre="" value={depreciates ? "d" : "i"} 
								changeHandler={(val: string) => {
									const isDepreciating = val === "d";
									setDepreciates(isDepreciating);
									setAssetChgRate(-assetChgRate);
								}}
								options={{
									i: "Increases",
									d: "Decreases"
								}} />
						}
						unit="%"
						post={`Sell price ${toHumanFriendlyCurrency(sellPrice, currency)}`}
						max={40}
						step={0.5}
						value={Math.abs(assetChgRate)}
						changeHandler={(val: number) => setAssetChgRate(depreciates ? -val : val)}
					/>
				}
			</Section>
			<p>&nbsp;</p>
			<GoalPayment />
		</>
	);
}
