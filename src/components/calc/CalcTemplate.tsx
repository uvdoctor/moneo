import React, { useContext, ReactNode } from 'react';
import Input from '../goals/Input';
import Result from '../goals/Result';

interface CalcTemplateProps {
	contextType: any;
	results: Array<ReactNode>;
}

export default function CalcTemplate({ contextType, results }: CalcTemplateProps) {
	const { allInputDone, cfs }: any = useContext(contextType);

	return (
		<div className={allInputDone ? 'calculator-page' : ''}>
			<Input contextType={contextType} />
			{allInputDone && cfs && cfs.length > 0 && <Result contextType={contextType} results={results} />}
		</div>
	);
}
