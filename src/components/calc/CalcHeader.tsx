import { PageHeader } from 'antd';
import React, { useContext } from 'react';
import SelectInput from '../form/selectinput';
import { CalcContext } from './CalcContext';

export default function CalcHeader() {
	const { goal, currency, changeCurrency }: any = useContext(CalcContext);
	return (
		<PageHeader
			className="calculator-header"
			title={goal.name}
			extra={[ <SelectInput pre="" value={currency} changeHandler={changeCurrency} currency /> ]}
		/>
	);
}
