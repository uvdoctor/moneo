import React, { Fragment, ReactNode, useContext } from 'react';
import Input from '../goals/Input';
import Result from '../goals/Result';
import { CalcContext } from './CalcContext';
import CalcHeader from './CalcHeader';

interface CalcTemplateProps {
	header?: ReactNode;
}

export default function CalcTemplate({ header }: CalcTemplateProps) {
	const { allInputDone }: any = useContext(CalcContext);

	return (
		<Fragment>
			{!allInputDone ? header ? header : <CalcHeader /> : null}
			<div className={allInputDone ? 'calculator-page' : ''}>
				<Input />
				{allInputDone && <Result />}
			</div>
		</Fragment>
	);
}
