import { Alert } from 'antd';
import React, { useContext, Fragment } from 'react';
import Input from '../goals/Input';
import Result from '../goals/Result';
import { CalcContext } from './CalcContext';
import CalcHeader from './CalcHeader';

import './CalcTemplate.less';

export interface CalcTemplateProps {
	latestState?: Function | null;
}

export default function CalcTemplate({ latestState }: CalcTemplateProps) {
	const { allInputDone, error }: any = useContext(CalcContext);

	return (
		<Fragment>
			{error && <Alert type="error" message={error} />}
			{!allInputDone ? <CalcHeader latestState={latestState} /> : null}
			<div className={allInputDone ? 'calculator-page' : ''}>
				<Input latestState={latestState} />
				{allInputDone && <Result latestState={latestState} />}
			</div>
		</Fragment>
	);
}
