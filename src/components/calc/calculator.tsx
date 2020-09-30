import React from 'react';
import { useState } from 'react';
import SelectInput from '../form/selectinput';
import { getTabLabelByOrder } from '../goals/goalutils';
import InputSection from '../goals/inputsection';
import LineChart from '../goals/linechart';
import ResultSection from '../goals/resultsection';
import StickyHeader from '../goals/stickyheader';
import { getRangeFactor } from '../utils';
import ItemDisplay from './ItemDisplay';

interface CalculatorProps {
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
	dr: number;
	drHandler: Function;
	chartFullScreen: boolean;
	cfs: Array<number>;
	cfsHandler: Function;
	currentOrder: number;
	allInputDone: boolean;
	nextStepHandler: Function;
}

export default function Calculator({ calc, title, titleSVG, cancelCallback }: CalculatorProps) {
	const [ currency, setCurrency ] = useState<string>('USD');
	const [ rangeFactor, setRangeFactor ] = useState<number>(getRangeFactor(currency));
	const [ dr, setDR ] = useState<number>(5);
	const [ currentOrder, setCurrentOrder ] = useState<number>(0);
	const [ allInputDone, setAllInputDone ] = useState<boolean>(false);
	const [ showTab, setShowTab ] = useState<string>(calc.tabOptions[0].label);
	const [ showResultTab, setShowResultTab ] = useState<string>(calc.resultTabOptions[0].label);
	const [ chartFullScreen, setChartFullScreen ] = useState<boolean>(false);
	const [ cfs, setCFs ] = useState<Array<number>>([]);

	const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(currency)));
		setCurrency(curr);
	};

	const handleNextStep = (count: number = 1) => {
		if (allInputDone) return;
		let co = currentOrder + count;
		let label = getTabLabelByOrder(calc.tabOptions, co);
		if (label) setShowTab(label);
		setCurrentOrder(co);
		if (label === calc.tabOptions[calc.tabOptions.length - 1].order + 1) setAllInputDone(true);
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
			<div
				className={`container mx-auto flex flex-1 lg:flex-row ${allInputDone &&
					'flex-col-reverse'} items-start`}
			>
				<InputSection
					currentOrder={currentOrder}
					allInputDone={allInputDone}
					showTab={showTab}
					showTabHandler={setShowTab}
					tabOptions={calc.tabOptions}
					cancelCallback={cancelCallback}
					handleSubmit={null}
					submitDisabled={false}
					cancelDisabled={false}
				>
					<calc.type
						currency={currency}
						rangeFactor={rangeFactor}
						dr={dr}
						drHandler={setDR}
						chartFullScreen={chartFullScreen}
						cfs={cfs}
						cfsHandler={setCFs}
						allInputDone={allInputDone}
						currentOrder={currentOrder}
						nextStepHandler={handleNextStep}
						showTab={showTab}
						tabOptions={calc.tabOptions}
					/>
				</InputSection>
			</div>
			{allInputDone && (
				<ResultSection
					resultTabOptions={calc.resultTabOptions}
					showResultTab={showResultTab}
					showResultTabHandler={setShowResultTab}
					chartFullScreenHandler={(fs: boolean) => setChartFullScreen(!fs)}
					result={<div />}
				>
					<LineChart cfs={cfs} fullScreen={chartFullScreen} startYear={1} />
				</ResultSection>
			)}
		</div>
	);
}
