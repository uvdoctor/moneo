import React, { useContext, ReactNode } from 'react';
import Input from '../goals/Input';
import Result from '../goals/Result';
import { CalcContext } from './CalcContext';

interface CalcTemplateProps {
	results: Array<ReactNode> | ReactNode;
}

export default function CalcTemplate({ results }: CalcTemplateProps) {
	const { allInputDone }: any = useContext(CalcContext);

	return (
		<div className={allInputDone ? 'calculator-page' : ''}>
		<Input />
			{allInputDone && <Result results={results} />}
		</div>
	);
}
