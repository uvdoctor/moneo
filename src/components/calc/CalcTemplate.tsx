import { Alert } from 'antd';
import React, { useContext, Fragment } from 'react';
import Input from '../goals/Input';
import { PlanContext } from '../goals/PlanContext';
import Result from '../goals/Result';
import { CalcContext } from './CalcContext';
import CalcHeader from './CalcHeader';

require('./CalcTemplate.less');

export default function CalcTemplate() {
	const { allInputDone, error }: any = useContext(CalcContext);
	const { planError }: any = useContext(PlanContext);

	return (
		<Fragment>
			{planError && <Alert type="error" message={planError} />}
			{error && <Alert type="error" message={error} />}
			{!allInputDone && <CalcHeader />}
			<div className={allInputDone ? 'calculator-page' : ''}>
				<Input />
				{allInputDone && <Result />}
			</div>
		</Fragment>
	);
}
