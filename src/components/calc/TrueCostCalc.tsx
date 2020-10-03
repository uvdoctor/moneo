import React, { useEffect, useState } from 'react';
import { INVEST, SAVE, SPEND } from '../../pages/truecost';
import SelectInput from '../form/selectinput';
import { getOrderByTabLabel } from '../goals/goalutils';
import Input from '../goals/Input';
import LineChart from '../goals/linechart';
import Result from '../goals/Result';
import SVGChart from '../svgchart';
import SVGHourGlass from '../svghourglass';
import { CalcTypeProps } from './CalculatorTemplate';
import InvestOption from './InvestOption';
import ItemDisplay from './ItemDisplay';
import OppCost from './oppcost';
import Save from './Save';
import Spend, { SPEND_MONTHLY, SPEND_ONCE, SPEND_YEARLY } from './Spend';

export const TIME_COST_HOURS = 'Hours';
export const TIME_COST_WEEKS = 'Weeks';
export const TIME_COST_YEARS = 'Years';

export default function TrueCostCalc(props: CalcTypeProps) {
	const CHART = 'Yearly Cash Flows If Invested';
	const [ amt, setAmt ] = useState<number>(0);
	const [ freq, setFreq ] = useState<string>(SPEND_ONCE);
	const [ duration, setDuration ] = useState<number>(0);
	const [ paidWeeks, setPaidWeeks ] = useState<number>(52);
	const [ hoursPerWeek, setHoursPerWeek ] = useState<number>(60);
	const [ savings, setSavings ] = useState<number>(0);
	const [ dr, setDR ] = useState<number>(5);
	const [ years, setYears ] = useState<number>(50);
	const [ savingsPerHr, setSavingsPerHr ] = useState<number>(0);
	const [ timeCost, setTimeCost ] = useState<number>(0);
	const [ timeCostDisplay, setTimeCostDisplay ] = useState<number>(0);
	const [ timeCostUnit, setTimeCostUnit ] = useState<string>(TIME_COST_HOURS);
	const [ totalCost, setTotalCost ] = useState<number>(0);
	const [ chartFullScreen, setChartFullScreen ] = useState<boolean>(false);
	const [ cfs, setCFs ] = useState<Array<number>>([]);
	const resultTabOptions = [
		{
			label: CHART,
			order: 1,
			active: true,
			svg: SVGChart
		}
	];
	const [ showResultTab, setShowResultTab ] = useState<string>(resultTabOptions[0].label);
	const timeOptions = {
		[TIME_COST_HOURS]: TIME_COST_HOURS,
		[TIME_COST_WEEKS]: TIME_COST_WEEKS,
		[TIME_COST_YEARS]: TIME_COST_YEARS
	};

	useEffect(
		() => {
			let cfs: Array<number> = [];
			if (!props.allInputDone || !amt || !freq || (freq !== SPEND_ONCE && !duration)) {
				setCFs([ ...cfs ]);
				return;
			}
			if (freq === SPEND_ONCE) {
				cfs.push(-amt);
				setCFs([ ...cfs ]);
				return;
			}
			let dur = freq === SPEND_YEARLY ? duration : Math.round(duration / 12);
			let totalMonths = freq === SPEND_MONTHLY ? duration : 0;
			for (let i = 0; i <= dur; i++) {
				if (freq === SPEND_MONTHLY && totalMonths) {
					if (totalMonths > 12) {
						cfs.push(-amt * 12);
						totalMonths -= 12;
					} else {
						cfs.push(-amt * totalMonths);
						totalMonths = 0;
					}
				} else {
					cfs.push(-amt);
				}
			}
			setCFs([ ...cfs ]);
		},
		[ amt, freq, duration, props.allInputDone ]
	);

	useEffect(
		() => {
			if (!timeCost) {
				setTimeCostDisplay(0);
				return;
			}
			setTimeCostDisplay(
				Math.round(
					timeCostUnit === TIME_COST_HOURS
						? timeCost
						: timeCostUnit === TIME_COST_WEEKS
							? timeCost / hoursPerWeek
							: timeCost / (hoursPerWeek * paidWeeks)
				)
			);
		},
		[ timeCost, timeCostUnit, hoursPerWeek, paidWeeks ]
	);

	useEffect(
		() => {
			if (!amt || !freq) {
				setTotalCost(0);
				return;
			}
			if (freq === SPEND_ONCE) setTotalCost(amt);
			else setTotalCost(amt * duration);
		},
		[ amt, freq, duration ]
	);

	useEffect(
		() => {
			if (!savingsPerHr || !totalCost) {
				setTimeCost(0);
				return;
			}
			setTimeCost(totalCost / savingsPerHr);
		},
		[ savingsPerHr, totalCost ]
	);

	useEffect(
		() => {
			if (!savings || !hoursPerWeek || !paidWeeks) {
				setSavingsPerHr(0);
				return;
			}
			setSavingsPerHr(savings / (paidWeeks * hoursPerWeek));
		},
		[ savings, hoursPerWeek, paidWeeks ]
	);

	return (
		<div className={`flex flex-1 lg:flex-row ${props.allInputDone && 'flex-col-reverse'} items-start`}>
			<Input
				currentOrder={props.currentOrder}
				allInputDone={props.allInputDone}
				showTab={props.showTab}
				showTabHandler={props.showTabHandler}
				tabOptions={props.tabOptions}
				cancelCallback={props.cancelCallback}
				handleSubmit={null}
				submitDisabled={false}
				cancelDisabled={false}
			>
				{props.showTab === SPEND && (
					<Spend
						currency={props.currency}
						rangeFactor={props.rangeFactor}
						allInputDone={props.allInputDone}
						currentOrder={props.currentOrder}
						inputOrder={getOrderByTabLabel(props.tabOptions, SPEND)}
						nextStepHandler={props.nextStepHandler}
						freq={freq}
						freqHandler={setFreq}
						amt={amt}
						amtHandler={setAmt}
						duration={duration}
						durationHandler={setDuration}
					/>
				)}

				{props.showTab === SAVE && (
					<Save
						currency={props.currency}
						rangeFactor={props.rangeFactor}
						allInputDone={props.allInputDone}
						currentOrder={props.currentOrder}
						inputOrder={getOrderByTabLabel(props.tabOptions, SAVE)}
						nextStepHandler={props.nextStepHandler}
						savings={savings}
						savingsHandler={setSavings}
						paidWeeks={paidWeeks}
						paidWeeksHandler={setPaidWeeks}
						hoursPerWeek={hoursPerWeek}
						hoursPerWeekHandler={setHoursPerWeek}
					/>
				)}

				{props.showTab === INVEST && (
					<InvestOption
						allInputDone={props.allInputDone}
						currentOrder={props.currentOrder}
						inputOrder={getOrderByTabLabel(props.tabOptions, INVEST)}
						nextStepHandler={props.nextStepHandler}
						dr={dr}
						drHandler={setDR}
						years={years}
						yearsHandler={setYears}
						durationInYears={freq === SPEND_ONCE ? 1 : freq === SPEND_MONTHLY ? duration / 12 : duration}
					/>
				)}
			</Input>
			{props.allInputDone && (
				<Result
					resultTabOptions={resultTabOptions}
					showResultTab={showResultTab}
					showResultTabHandler={setShowResultTab}
					chartFullScreenHandler={setChartFullScreen}
					result={
						<div className="w-full py-1 flex justify-around items-center bg-green-100 shadow-lg lg:shadow-xl">
							<div className="flex items-end">
								<ItemDisplay
									label="Time Cost"
									result={-timeCostDisplay}
									svg={<SVGHourGlass />}
									unit=""
									pl
								/>
								<div className="ml-1">
									<SelectInput
										name="tcunit"
										pre=""
										inputOrder={0}
										currentOrder={-1}
										nextStepDisabled={false}
										allInputDone
										nextStepHandler={() => true}
										options={timeOptions}
										value={timeCostUnit}
										changeHandler={setTimeCostUnit}
									/>
								</div>
							</div>
							<OppCost discountRate={dr} cfs={cfs} currency={props.currency} minDuration={years} />
						</div>
					}
				>
					<LineChart cfs={cfs} fullScreen={chartFullScreen} startYear={0} title="Number of Years" />
				</Result>
			)}
		</div>
	);
}
