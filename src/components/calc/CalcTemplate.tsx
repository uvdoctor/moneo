import React, { useContext, ReactNode } from 'react';
import Input from '../goals/Input';
import Result from '../goals/Result';
import { CalcContext } from './CalcContext';

interface CalcTemplateProps {
	results: Array<ReactNode>;
}

export default function CalcTemplate({ results }: CalcTemplateProps) {
	const { allInputDone, cfs }: any = useContext(CalcContext);

	return (
		<div className={allInputDone ? 'calculator-page' : ''}>
		<Input />
			{allInputDone && cfs && cfs.length > 0 && <Result results={results} />}
		</div>
	);
}
