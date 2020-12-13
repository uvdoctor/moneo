import React, { useContext } from 'react';
import SelectInput from '../form/selectinput';
import { toCurrency, toReadableNumber } from '../utils';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';
import { TrueCostContext, TIME_COST_HOURS, TIME_COST_WEEKS, TIME_COST_YEARS } from './TrueCostContext';

export default function TimeCostResult() {
	const { currency }: any = useContext(CalcContext);
	const { timeCost, timeCostUnit, setTimeCostUnit, timeCostDisplay, totalCost }: any = useContext(TrueCostContext);

	const timeOptions = {
		[TIME_COST_HOURS]: TIME_COST_HOURS,
		[TIME_COST_WEEKS]: TIME_COST_WEEKS,
		[TIME_COST_YEARS]: TIME_COST_YEARS
	};

	return (
		<ItemDisplay
			label="Time Cost"
			result={-timeCostDisplay}
			pl
			info={`Based on your Savings from Work Income, You May have to Work ${toReadableNumber(
				timeCost
			)} ${timeCostUnit} to Save ${toCurrency(totalCost, currency)}`}
			unit={<SelectInput pre="" options={timeOptions} value={timeCostUnit} changeHandler={setTimeCostUnit} />}
		/>
	);
}
