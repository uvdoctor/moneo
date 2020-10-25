import React, { createContext, useState } from 'react';
import { getRangeFactor } from '../utils';
import { useFullScreenBrowser } from 'react-browser-hooks';
import CalcHeader from './CalcHeader';
import { CONTEXT_TC } from '../../CONSTANTS';
import Input from '../goals/Input';

const CalcContext = createContext({});

export interface CalcContextProviderProps {
	children: any;
	title: string;
	tabOptions: Array<any>;
	resultTabOptions: Array<any>;
	defaultCurrency?: string;
}

function CalcContextProvider({
	children,
	title,
	tabOptions,
	resultTabOptions,
	defaultCurrency = 'USD'
}: CalcContextProviderProps) {
	const fsb = useFullScreenBrowser();
	const [ inputTabs, setInputTabs ] = useState<Array<any>>(tabOptions);
	const [ resultTabs, setResultTabs ] = useState<Array<any>>(resultTabOptions);
	const [ currency, setCurrency ] = useState<string>(defaultCurrency);
	const [ rangeFactor, setRangeFactor ] = useState<number>(getRangeFactor(currency));
	const [ allInputDone, setAllInputDone ] = useState<boolean>(false);
	const [ showTab, setShowTab ] = useState<string>(inputTabs[0].label);
	const [ dr, setDR ] = useState<number | null>(5);
	const [ cfs, setCFs ] = useState<Array<number>>([]);
	const [ showResultTab, setShowResultTab ] = useState<string>(resultTabs[0].label);
	const [ showOptionsForm, setOptionsVisibility ] = useState<boolean>(true);

	const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / rangeFactor));
		setCurrency(curr);
	};

	return (
		<CalcContext.Provider
			value={{
				currency,
				changeCurrency,
				rangeFactor,
				setRangeFactor,
				allInputDone,
				setAllInputDone,
				showTab,
				setShowTab,
				title,
				inputTabs,
				setInputTabs,
				resultTabs,
				setResultTabs,
				dr,
				setDR,
				cfs,
				setCFs,
				showResultTab,
				setShowResultTab,
				fsb,
				showOptionsForm,
				setOptionsVisibility
			}}
		>
			{!allInputDone && <CalcHeader />}
      <div className={allInputDone ? 'calculator-page' : ''}>
        <Input contextType={CONTEXT_TC} />
        {children}
      </div>
		</CalcContext.Provider>
	);
}

export { CalcContext, CalcContextProvider };
