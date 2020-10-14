import React from 'react';
import { useState } from 'react';
import { getRangeFactor } from '../utils';
import { Space } from 'antd';
import TitleSection from '../goals/TitleSection';
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

	return (
		<Space align="center" direction="vertical" size="small" style={{ width: '100%' }}>
			<TitleSection title={title + ' Calculator'} cancelCallback={cancelCallback}
			currency={currency} currencyHandler={setCurrency} rangeFactorHandler={setRangeFactor} />
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
