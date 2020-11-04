import React, { useContext } from 'react';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function FIResult() {
	const { ffResult, currency }: any = useContext(CalcContext);

	return (
		<ItemDisplay
			result={ffResult.ffAmt}
			label={`Potential Savings`}
			currency={currency}
			info="You can Withdraw from this Savings for Your expenses after gaining Financial Independence."
		/>
	);
}
