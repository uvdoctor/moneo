import React, { useContext } from 'react';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function FIResult() {
	const { ffResult, currency }: any = useContext(CalcContext);

	return (
		<ItemDisplay
			result={ffResult.ffAmt}
			label={`By ${ffResult.ffYear - 1}, You may have`}
			currency={currency}
			info="You can Withdraw from this Savings for Your expenses after gaining Financial Independence."
		/>
	);
}
