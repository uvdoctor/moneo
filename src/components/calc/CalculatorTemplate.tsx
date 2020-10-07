import React from 'react';
import { useState } from 'react';
import SelectInput from '../form/selectinput';
import StickyHeader from '../goals/stickyheader';
import { getRangeFactor } from '../utils';
import ItemDisplay from './ItemDisplay';

interface CalculatorTemplateProps {
	calc: any;
	title: string;
	titleSVG: any;
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

export default function CalculatorTemplate({ calc, title, titleSVG, cancelCallback }: CalculatorTemplateProps) {
	const [ currency, setCurrency ] = useState<string>('USD');
	const [ rangeFactor, setRangeFactor ] = useState<number>(getRangeFactor(currency));
	const [ allInputDone, setAllInputDone ] = useState<boolean>(false);
	const [ showTab, setShowTab ] = useState<string>(calc.tabOptions[0].label);

	const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(currency)));
		setCurrency(curr);
	};

	return (
		<div className="w-full">
			<StickyHeader cancelCallback={cancelCallback}>
				<div className="w-full mt-4 mb-2">
					<ItemDisplay svg={titleSVG} result={title + ' Calculator'} calcFormat />
					<SelectInput
						name="ccy"
						pre="Currency"
						value={currency}
						changeHandler={changeCurrency}
						currency
					/>
				</div>
			</StickyHeader>
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
		</div>
	);
}
