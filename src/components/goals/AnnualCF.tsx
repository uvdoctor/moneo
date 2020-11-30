import React, { useState, useEffect, useContext } from 'react';
import Section from '../form/section';
import RadialInput from '../form/radialinput';
import SelectInput from '../form/selectinput';
import { toStringArr, initOptions } from '../utils';
import { calculateTotalAmt } from './cfutils';
import { COLORS } from '../../CONSTANTS';
import { GoalContext } from './GoalContext';
import { Row } from 'antd';
import ItemDisplay from '../calc/ItemDisplay';
import { CalcContext } from '../calc/CalcContext';
interface AnnualAmtProps {
	income?: boolean;
}

export default function AnnualCF({ income }: AnnualAmtProps) {
	const { currency, startYear }: any = useContext(CalcContext);
	const {
		price,
		sellAfter,
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
	const [ syOptions, setSYOptions ] = useState<object>(initOptions(startYear, sellAfter - 1));
	const [ totalAmt, setTotalAmt ] = useState<number>(0);
	const title = income ? 'Rent, Dividend, etc after paying tax' : 'Fixes, Insurance, etc including tax';
	
	useEffect(
		() => {
			setSYOptions(initOptions(startYear, sellAfter - 1));
		},
		[ startYear ]
	);

	useEffect(
		() =>
			setTotalAmt(
				calculateTotalAmt(
					startYear,
					income ? aiPer : amCostPer,
					income ? aiStartYear : amStartYear,
					price,
					assetChgRate,
					sellAfter
				)
			),
		[ startYear, aiPer, amCostPer, aiStartYear, amStartYear, price, assetChgRate, sellAfter ]
	);

	return (
		<Section title={title}>
			<RadialInput
				colorTo={!income ? COLORS.RED : COLORS.GREEN}
				data={toStringArr(0, 10, 0.1)}
				changeHandler={income ? setAIPer : setAMCostPer}
				unit="%"
				labelBottom={true}
				label="of Price"
				pre={
					<Row justify="center" align="middle">
						{`From `}
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
						footer={`${income ? aiStartYear : amStartYear} to ${startYear + sellAfter}`}
					/>
				}
				value={income ? aiPer : amCostPer}
				step={0.1}
			/>
		</Section>
	);
}
