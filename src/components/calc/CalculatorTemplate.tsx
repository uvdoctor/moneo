import React from 'react';
import { useState } from 'react';
import SelectInput from '../form/selectinput';
import { getTabLabelByOrder } from '../goals/goalutils';
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
	currentOrder: number;
	allInputDone: boolean;
	nextStepHandler: Function;
	cancelCallback: Function;
}

export default function CalculatorTemplate({ calc, title, titleSVG, cancelCallback }: CalculatorTemplateProps) {
	const [ currency, setCurrency ] = useState<string>('USD');
	const [ rangeFactor, setRangeFactor ] = useState<number>(getRangeFactor(currency));
	const [ currentOrder, setCurrentOrder ] = useState<number>(0);
	const [ allInputDone, setAllInputDone ] = useState<boolean>(false);
	const [ showTab, setShowTab ] = useState<string>(calc.tabOptions[0].label);

	const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(currency)));
		setCurrency(curr);
	};

	const handleNextStep = (count: number = 1) => {
		if (allInputDone) return;
		let co = currentOrder + count;
		if (co === calc.endOrder) {
			setAllInputDone(true);
			return;
		}
		let label = getTabLabelByOrder(calc.tabOptions, co);
		if (label) setShowTab(label);
		setCurrentOrder(co);
	};

	return (
		<div className="w-full">
			<StickyHeader cancelCallback={cancelCallback}>
				<div className="w-full mt-4 mb-2">
					<ItemDisplay svg={titleSVG} result={title + ' Calculator'} calcFormat />
					<SelectInput
						name="ccy"
						inputOrder={0}
						currentOrder={currentOrder}
						nextStepDisabled={false}
						allInputDone={allInputDone}
						nextStepHandler={handleNextStep}
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
				currentOrder={currentOrder}
				nextStepHandler={handleNextStep}
				showTab={showTab}
				showTabHandler={setShowTab}
				tabOptions={calc.tabOptions}
				cancelCallback={cancelCallback}
			/>
		</div>
	);
}
