import { Collapse } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { GoalType } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import { GoalContext } from '../goals/GoalContext';
import { initOptions } from '../utils';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function LoanAdvOptions() {
	const { Panel } = Collapse;
	const { goal, currency, startYear, endYear }: any = useContext(CalcContext);
	const {
		loanPer,
		emi,
		loanPMI,
		setLoanPMI,
		loanPMIEndPer,
		setLoanPMIEndPer,
		loanGracePeriod,
		setLoanGracePeriod,
		eduLoanSISchedule,
	}: any = useContext(GoalContext);
	const [ totalSI, setTotalSI ] = useState<number>(0);
	const [ pmiMax, setPMIMax ] = useState<number>(Math.round(emi * 0.05));

	useEffect(
		() => {
			if (goal.type !== GoalType.E) setPMIMax(Math.round(emi * 0.05));
		},
		[ emi ]
	);

	useEffect(
		() => {
			let totalSI = 0;
			for (let i = 0; i < eduLoanSISchedule.length; i++) totalSI += eduLoanSISchedule[i];
			setTotalSI(totalSI);
		},
		[ eduLoanSISchedule ]
	);

	return (
		<Collapse defaultActiveKey={[ '1' ]}>
			{goal.type !== GoalType.E ? (
				loanPer > 80 && (
					<Panel header="Insurance for Repayment Protection" key="1">
						<NumberInput
							currency={currency}
							pre="Monthly Payment"
							value={loanPMI}
							changeHandler={setLoanPMI}
							min={0}
							max={pmiMax}
							step={1}
							note={
								loanPMI ? (
									<SelectInput
										pre="Ends when Principal Due is"
										value={loanPMIEndPer}
										changeHandler={setLoanPMIEndPer}
										options={initOptions(75, 5)}
										unit="%"
									/>
								) : (
									<div />
								)
							}
						/>
					</Panel>
				)
			) : (
				<Panel header="Total Simple Interest" key="1">
					<ItemDisplay
						label={`From ${startYear} to ${endYear}`}
						result={totalSI}
						currency={currency}
						footer={
							<SelectInput
								pre="Grace Period"
								value={loanGracePeriod}
								changeHandler={(val: string) => setLoanGracePeriod(parseInt(val))}
								unit="Months"
								options={initOptions(0, 6)}
							/>
						}
					/>
				</Panel>
			)}
		</Collapse>
	);
}
