import React from 'react';
import { useState } from 'react';
import SelectInput from '../form/selectinput';
import { getRangeFactor } from '../utils';
import { Space } from 'antd';
interface CalculatorTemplateProps {
	calc: any;
	title: string;
	cancelCallback: Function;
}
export interface CalcTypeProps {
	currency: string;
	rangeFactor: number;
	tabOptions: Array<any>;
	showTab: string;
	showTabHandler: Function;
	allInputDone: boolean;
	allInputDoneHandler: Function;
	cancelCallback: Function;
}

export default function CalculatorTemplate({ calc, title, cancelCallback }: CalculatorTemplateProps) {
	const [ currency, setCurrency ] = useState<string>('USD');
	const [ rangeFactor, setRangeFactor ] = useState<number>(getRangeFactor(currency));
	const [ allInputDone, setAllInputDone ] = useState<boolean>(false);
	const [ showTab, setShowTab ] = useState<string>(calc.tabOptions[0].label);

	const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(currency)));
		setCurrency(curr);
	};

	return (
		<Space align="center" direction="vertical" size="large" style={{width: '100%'}}>
			{title + ' Calculator'}
			<SelectInput name="ccy" pre="Currency" value={currency} changeHandler={changeCurrency} currency />
			<calc.type
				currency={currency}
				rangeFactor={rangeFactor}
				allInputDone={allInputDone}
				allInputDoneHandler={setAllInputDone}
				showTab={showTab}
				showTabHandler={setShowTab}
				tabOptions={calc.tabOptions}
				cancelCallback={cancelCallback}
			/>
		</Space>
	);
}
