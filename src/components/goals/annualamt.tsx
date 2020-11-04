import React, { useState, useEffect, useContext } from 'react';
import Section from '../form/section';
import RadialInput from '../form/radialinput';
import SelectInput from '../form/selectinput';
import { toStringArr, initYearOptions } from '../utils';
import { calculateTotalAmt } from './cfutils';
import { COLORS } from '../../CONSTANTS';
import { GoalContext } from './GoalContext';
import { Row } from 'antd';
import ItemDisplay from '../calc/ItemDisplay';
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
	const [ syOptions, setSYOptions ] = useState<object>(initYearOptions(startYear, duration - 1));
	const [ totalAmt, setTotalAmt ] = useState<number>(0);
	const title = income ? 'Rent, Dividend, etc after paying taxes'
		: 'Fixes, Insurance, etc including taxes';
	useEffect(() => setSYOptions(initYearOptions(startYear, duration - 1)), [ startYear ]);

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
		<Section title={title}>
			<RadialInput
				colorTo={!income ? COLORS.RED : COLORS.GREEN}
				data={toStringArr(0, 10, 0.1)}
				changeHandler={income ? setAIPer : setAMCostPer}
				width={120}
				unit="%"
				labelBottom={true}
				label="of Price"
				pre={
					<Row justify="center" align="middle">
						{`From Year `}
						<SelectInput
							pre=""
							options={syOptions}
							value={income ? aiStartYear : amStartYear}
							changeHandler={income ? setAIStartYear : setAMStartYear}
						/>
					</Row>
				}
				post={
					<ItemDisplay
						label={`Total ${income ? 'Income' : 'Cost'}`}
						result={income ? totalAmt : -totalAmt}
						currency={currency}
						pl
						footer={`${income ? aiStartYear : amStartYear} to ${startYear + duration - 1}`}
					/>
				}
				value={income ? aiPer : amCostPer}
				step={0.1}
			/>
		</Section>
	);
}
