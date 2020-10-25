import { PageHeader } from 'antd';
import React, { useContext } from 'react';
import SelectInput from '../form/selectinput';

interface CalcHeaderProps {
	contextType: any;
}

export default function CalcHeader({contextType}: CalcHeaderProps) {
	const { title, currency, changeCurrency }: any = useContext(contextType);
	return (
		<PageHeader
			className="calculator-header"
			title={title + ' Calculator'}
			extra={[ <SelectInput pre="" value={currency} changeHandler={changeCurrency} currency /> ]}
		/>
	);
}
