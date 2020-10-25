import React, { createContext, useContext, useEffect, useState } from 'react';
import { toCurrency, toReadableNumber } from '../utils';
import CalcHeader from './CalcHeader';
import { SPEND_MONTHLY, SPEND_ONCE, SPEND_YEARLY } from './Spend';
import ItemDisplay from './ItemDisplay';
import SelectInput from '../form/selectinput';
import CalcTemplate from './CalcTemplate';
import { CalcContext } from './CalcContext';

const TrueCostContext = createContext({});

export const TIME_COST_HOURS = 'Hours';
export const TIME_COST_WEEKS = 'Weeks';
export const TIME_COST_YEARS = 'Years';

function TrueCostContextProvider() {
	const {
		currency,
		rangeFactor,
		cfs,
		setCFs,
		dr,
		setDR,
		allInputDone,
		cfsWithOppCost,
		setCFsWithOppCost
	}: any = useContext(CalcContext);
	const [ amt, setAmt ] = useState<number>(0);
	const [ freq, setFreq ] = useState<string>(SPEND_ONCE);
	const [ duration, setDuration ] = useState<number>(0);
	const [ paidWeeks, setPaidWeeks ] = useState<number>(52);
	const [ hoursPerWeek, setHoursPerWeek ] = useState<number>(60);
	const [ savings, setSavings ] = useState<number>(0);
	const [ years, setYears ] = useState<number>(50);
	const [ savingsPerHr, setSavingsPerHr ] = useState<number>(0);
	const [ timeCost, setTimeCost ] = useState<number>(0);
	const [ timeCostDisplay, setTimeCostDisplay ] = useState<number>(0);
	const [ timeCostUnit, setTimeCostUnit ] = useState<string>(TIME_COST_HOURS);
	const [ totalCost, setTotalCost ] = useState<number>(0);

	const timeOptions = {
		[TIME_COST_HOURS]: TIME_COST_HOURS,
		[TIME_COST_WEEKS]: TIME_COST_WEEKS,
		[TIME_COST_YEARS]: TIME_COST_YEARS
	};

	useEffect(
		() => {
			if (cfs.length === 0) {
				setCFsWithOppCost([ ...cfs ]);
				return;
			}
			let cfsWithOppCost: Array<number> = [];
			for (let i = 0; i < years; i++) {
				let prevCF = i < cfs.length ? -cfs[i] : cfsWithOppCost[i - 1];
				if (i > 0 && i < cfs.length && freq !== SPEND_ONCE) {
					prevCF += cfsWithOppCost[i - 1];
				}
				let compoundedVal = Math.round(prevCF * (1 + dr / 100));
				cfsWithOppCost.push(compoundedVal);
			}
			setCFsWithOppCost([ ...cfsWithOppCost ]);
		},
		[ cfs, dr, years ]
	);

	useEffect(
		() => {
			let cfs: Array<number> = [];
			if (!allInputDone || !amt || !freq || (freq !== SPEND_ONCE && !duration)) {
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
		[ amt, freq, duration, allInputDone ]
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
		<TrueCostContext.Provider
			value={{
				cfs,
				currency,
				rangeFactor,
				dr,
				setDR,
				freq,
				setFreq,
				duration,
				setDuration,
				amt,
				paidWeeks,
				setAmt,
				setPaidWeeks,
				hoursPerWeek,
				setHoursPerWeek,
				savings,
				setSavings,
				years,
				setYears,
				timeCost,
				setTimeCost,
				timeCostDisplay,
				setTimeCostDisplay,
				timeCostUnit,
				setTimeCostUnit,
				savingsPerHr,
				setSavingsPerHr,
				totalCost,
				setTotalCost,
			}}
		>
			{!allInputDone && <CalcHeader />}
			<CalcTemplate
				results={[
					<ItemDisplay
						label="Time Cost"
						result={-timeCostDisplay}
						pl
						info={`Based on your Savings from Work Income, You May have to Work ${toReadableNumber(
							timeCost
						)} ${timeCostUnit} to Save ${toCurrency(totalCost, currency)}`}
						unit={
							<SelectInput
								pre=""
								options={timeOptions}
								value={timeCostUnit}
								changeHandler={setTimeCostUnit}
							/>
						}
					/>,
					<ItemDisplay
						label="Spend v/s Invest"
						info={`You May have ${toCurrency(
							Math.abs(cfsWithOppCost[cfsWithOppCost.length - 1]),
							currency
						)} More in ${years} Years if You Invest instead of Spending.`}
						result={-cfsWithOppCost[cfsWithOppCost.length - 1]}
						currency={currency}
						pl
					/>
				]}
			/>
		</TrueCostContext.Provider>
	);
}

export { TrueCostContext, TrueCostContextProvider };
