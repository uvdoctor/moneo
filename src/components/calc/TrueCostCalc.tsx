import React, { Fragment, useEffect, useState } from 'react';
import { INVEST, SAVE, SPEND } from '../../pages/truecost';
import { getOrderByTabLabel } from '../goals/goalutils';
import { CalcTypeProps } from './CalculatorTemplate';
import Invest from './Invest';
import Save from './Save';
import Spend from './Spend';

export default function TrueCostCalc(props: CalcTypeProps) {
	const [ amt, setAmt ] = useState<number>(0);
	const [ freq, setFreq ] = useState<string>('one');
	const [ duration, setDuration ] = useState<number>(0);
	const [ paidWeeks, setPaidWeeks ] = useState<number>(52);
	const [ hoursPerWeek, setHoursPerWeek ] = useState<number>(60);
	const [ savings, setSavings ] = useState<number>(0);
	const [ dr, setDR ] = useState<number>(5);
	const [ years, setYears ] = useState<number>(50);

	useEffect(
		() => {
			props.cfsHandler([]);
		},
		[ props.currency, props.dr, amt, freq ]
	);

	return (
		<Fragment>
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
				<Invest
					currency={props.currency}
					rangeFactor={props.rangeFactor}
					allInputDone={props.allInputDone}
					currentOrder={props.currentOrder}
					inputOrder={getOrderByTabLabel(props.tabOptions, INVEST)}
					nextStepHandler={props.nextStepHandler}
					dr={dr}
					drHandler={setDR}
					years={years}
					yearsHandler={setYears}
				/>
			)}
		</Fragment>
	);
}
