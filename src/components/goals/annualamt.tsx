import React, { useState, useEffect, useContext } from 'react';
import Section from '../form/section';
import RadialInput from '../form/radialinput';
import SelectInput from '../form/selectinput';
import { toStringArr, toCurrency, initYearOptions } from '../utils';
import { calculateTotalAmt } from './cfutils';
import { COLORS } from '../../CONSTANTS';
import { GoalContext } from './GoalContext';
interface AnnualAmtProps {
	income?: boolean;
}

export default function AnnualAmt({ income }: AnnualAmtProps) {
	const {
		currency,
		startYear,
		price,
		duration,
		assetChgRate,
		amCostPer,
		aiPer,
		setAMCostPer,
		setAIPer,
		amStartYear,
		aiStartYear,
		setAMStartYear,
		setAIStartYear
	}: any = useContext(GoalContext);
	const [ syOptions, setSYOptions ] = useState<object>(initYearOptions(startYear, 10));
	const [ totalAmt, setTotalAmt ] = useState<number>(0);
	const title = income ? 'Yearly Income through Rent, Dividend, etc' : 'Yearly Fixes, Insurance, etc costs';
	const footer = `${income ? 'Exclude' : 'Include'} taxes & fees`;
	useEffect(() => setSYOptions(initYearOptions(startYear, 10)), [ startYear ]);

	useEffect(
		() =>
			setTotalAmt(
				calculateTotalAmt(
					startYear,
					income ? aiPer : amCostPer,
					income ? aiStartYear : amStartYear,
					price,
					assetChgRate,
					duration
				)
			),
		[ startYear, aiPer, amCostPer, aiStartYear, amStartYear, price, assetChgRate, duration ]
	);

	return (
		<Section title={title} footer={footer}>
			<RadialInput
				colorTo={!income ? COLORS.RED : COLORS.GREEN}
				data={toStringArr(0, 10, 0.2)}
				changeHandler={income ? setAIPer : setAMCostPer}
				width={120}
				unit="%"
				labelBottom={true}
				label="of Amount"
				post={`Total ${toCurrency(totalAmt, currency)}`}
				value={income ? aiPer : amCostPer}
				step={0.2}
			/>
			{income ? (
				aiPer
			) : (
				amCostPer && (
					<SelectInput
						pre="From Year"
						post="Onwards"
						options={syOptions}
						value={income ? aiStartYear : amStartYear}
						changeHandler={income ? setAIStartYear : setAMStartYear}
					/>
				)
			)}
		</Section>
	);
}
