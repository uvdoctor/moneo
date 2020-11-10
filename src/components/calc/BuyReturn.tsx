import React, { useContext, useEffect, useState } from 'react';
import { calculateXIRR } from '../goals/cfutils';
import { GoalContext } from '../goals/GoalContext';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export default function BuyReturn() {
	const { startYear, cfs }: any = useContext(CalcContext);
	const { price, sellAfter, sellPrice }: any = useContext(GoalContext);
	const [ annualReturnPer, setAnnualReturnPer ] = useState<number | null>(0);

	useEffect(
		() => {
			setAnnualReturnPer(calculateXIRR(cfs, startYear, price, sellAfter, sellPrice));
		},
		[ sellPrice ]
	);

	return annualReturnPer !== null ? (
		<ItemDisplay
			svg={annualReturnPer > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
			label="Buy Yields"
			result={annualReturnPer}
			decimal={2}
			unit="% Yearly Return"
			pl
		/>
	) : null;
}
