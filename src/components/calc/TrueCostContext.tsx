import React, { createContext, useContext, useEffect, useState } from 'react';
import { SPEND_MONTHLY, SPEND_ONCE, SPEND_YEARLY } from './Spend';
import { CalcContext } from './CalcContext';
import CalcTemplate from './CalcTemplate';
import TimeCostResult from './TimeCostResult';
import TrueOppCostResult from './TrueOppCostResult';
import { getRangeFactor } from '../utils';

const TrueCostContext = createContext({});

export const TIME_COST_HOURS = 'Hours';
export const TIME_COST_WEEKS = 'Weeks';
export const TIME_COST_YEARS = 'Years';

function TrueCostContextProvider() {
	const {
		setCFs,
		allInputDone,
		setResults,
		currency
	}: any = useContext(CalcContext);
	const [ amt, setAmt ] = useState<number>(1000 * getRangeFactor(currency));
	const [ freq, setFreq ] = useState<string>(SPEND_ONCE);
	const [ duration, setDuration ] = useState<number>(6);
	const [ paidWeeks, setPaidWeeks ] = useState<number>(52);
	const [ hoursPerWeek, setHoursPerWeek ] = useState<number>(60);
	const [ savings, setSavings ] = useState<number>(20000 * getRangeFactor(currency));
	const [ savingsPerHr, setSavingsPerHr ] = useState<number>(0);
	const [ timeCost, setTimeCost ] = useState<number>(0);
	const [ timeCostDisplay, setTimeCostDisplay ] = useState<number>(0);
	const [ timeCostUnit, setTimeCostUnit ] = useState<string>(TIME_COST_HOURS);
	const [ totalCost, setTotalCost ] = useState<number>(0);
	const [cfsWithoutOppCost, setCFsWithoutOppCost] = useState<Array<number>>([]);

	useEffect(() => {
		setResults([...[
			<TimeCostResult />,
			<TrueOppCostResult />
		]
		])
	}, []);

	useEffect(
		() => {
			if (!allInputDone || !amt || !freq || (freq !== SPEND_ONCE && !duration)) {
				setCFs([ ...[] ]);
				return;
			}
			debugger;
			let cfs: Array<number> = [];
			if (freq === SPEND_ONCE) {
				cfs.push(-amt);
				setCFsWithoutOppCost([ ...cfs ]);
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
			setCFsWithoutOppCost([ ...cfs ]);
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
				cfsWithoutOppCost,
				setCFsWithoutOppCost
			}}
		>
			<CalcTemplate />
		</TrueCostContext.Provider>
	);
}

export { TrueCostContext, TrueCostContextProvider };
