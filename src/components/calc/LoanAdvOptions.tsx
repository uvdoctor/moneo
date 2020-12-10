import { Col, Collapse, Row } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { GoalType } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import NumberInput from '../form/numberinput';
import RadialInput from '../form/radialinput';
import SelectInput from '../form/selectinput';
import { GoalContext } from '../goals/GoalContext';
import { initOptions, toCurrency, toStringArr } from '../utils';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';

export default function LoanAdvOptions() {
	const { Panel } = Collapse;
	const { goal, currency, startYear, endYear }: any = useContext(CalcContext);
	const {
		loanPer,
		loanSIPayPer,
		loanSIGPP,
		setLoanSIPayPer,
		setLoanSIGPP,
		simpleInts,
		capSI,
		emi,
		loanPMI,
		setLoanPMI,
		loanPMIEndPer,
		setLoanPMIEndPer,
		loanGracePeriod,
		setLoanGracePeriod
	}: any = useContext(GoalContext);
	const [ totalSI, setTotalSI ] = useState<number>(0);
	const [ pmiMax, setPMIMax ] = useState<number>(Math.round(emi * 0.05));

	useEffect(
		() => {
			let totalSI = 0;
			simpleInts.forEach((int: number) => (totalSI += int));
			setTotalSI(totalSI);
		},
		[ simpleInts ]
	);

	useEffect(
		() => {
			setPMIMax(Math.round(emi * 0.05));
		},
		[ emi ]
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
				<Fragment>
					<Panel header="Pay While Studying" key="1">
						<RadialInput
							unit="%"
							data={toStringArr(0, 100, 5)}
							value={loanSIPayPer as number}
							changeHandler={setLoanSIPayPer}
							step={5}
							labelBottom
							colorFrom={COLORS.RED}
							colorTo={COLORS.GREEN}
							pre=""
							label="Interest"
							post={
								<ItemDisplay
									label="Total Simple Interest"
									result={totalSI}
									currency={currency}
									info={simpleInts.map((int: number, i: number) => (
										<p key={'int' + i}>
											Monthly {toCurrency(Math.round(int / 12), currency)} in {startYear + i}
										</p>
									))}
									footer={`${startYear} to ${endYear}`}
								/>
							}
						/>
					</Panel>
					<Panel header="Grace Period" key="2">
						<Row>
							<Col span={24}>
								<SelectInput
									pre="Duration"
									value={loanGracePeriod}
									changeHandler={(val: string) => setLoanGracePeriod(parseInt(val))}
									unit="Months"
									options={initOptions(0, 6)}
								/>
							</Col>
						</Row>
						{!Number.isNaN(loanSIPayPer) && //@ts-ignore
						loanSIPayPer < 100 &&
						loanGracePeriod ? (
							<Row>
								<Col className="fields-divider" span={24} />
								<Col span={24}>
									<NumberInput
										pre="Pay Remaining Simple Interest"
										value={loanSIGPP as number}
										changeHandler={setLoanSIGPP}
										min={0}
										max={loanSIGPP + capSI}
										step={1}
										currency={currency}
									/>
								</Col>
							</Row>
						) : null}
					</Panel>
				</Fragment>
			)}
		</Collapse>
	);
}
