import React, { useContext } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import HSwitch from '../HSwitch';
import { GoalType, TargetInput } from '../../api/goals';
import { toCurrency } from '../utils';
import { Row, Col } from 'antd';
import { GoalContext } from './GoalContext';
import { CalcContext } from '../calc/CalcContext';
import { isLoanEligible } from './goalutils';

export default function Cost() {
	const {
		currency,
		rangeFactor,
		startYear,
		goal,
		inputTabs,
		setInputTabs,
		error
	}: any = useContext(CalcContext);
	const {
		startingPrice,
		setStartingPrice,
		wipTargets,
		setWIPTargets,
		price,
		priceChgRate,
		setPriceChgRate,
		manualMode,
		setManualMode,
		isLoanMandatory
	}: any = useContext(GoalContext);

	const changeTargetVal = (val: number, i: number) => {
		if (!wipTargets || !setWIPTargets) return;
		wipTargets[i].val = val;
		setWIPTargets([ ...wipTargets ]);
	};

	const changeManualMode = (checked: boolean) => {
		if (isLoanEligible(goal.type)) {
			let loanTabIndex = goal.type === GoalType.B ? 2 : 1;
			if (checked) {
				if (inputTabs[loanTabIndex].active) {
					inputTabs[loanTabIndex].active = false;
					setInputTabs([...inputTabs]);
				}
			} else {
				if (!inputTabs[loanTabIndex].active) {
					inputTabs[loanTabIndex].active = true;
					setInputTabs([...inputTabs]);
				}
			}
		}
		setManualMode(checked);
	}

	return (
		<Section
			title={`${startYear} Cost ~ ${toCurrency(price, currency)}`}
			toggle={
				setManualMode && !isLoanMandatory && <HSwitch rightText={`Custom Payment Plan`} value={manualMode} setter={changeManualMode} />
			}
			manualInput={
				wipTargets && (
					<Row align="middle" justify="space-between">
						{wipTargets.map((t: TargetInput, i: number) => (
							<Col span={24} key={'t' + i}>
								<label>{`${t.year} `}</label>
								<NumberInput
									pre=""
									currency={currency}
									rangeFactor={rangeFactor}
									value={t.val}
									changeHandler={(val: number) => changeTargetVal(val, i)}
									min={0}
									max={900000}
									step={500}
								/>
							</Col>
						))}
					</Row>
				)
			}
			manualMode={manualMode}
			videoSrc={`https://www.youtube.com/watch?v=uYMTsmeZyfU`}
			error={error}
		>
			<NumberInput
				pre={startYear > goal.by ? `Cost ${goal.type !== GoalType.D && 'including taxes & fees'}` : ''}
				currency={currency}
				rangeFactor={rangeFactor}
				value={startingPrice}
				changeHandler={setStartingPrice}
				min={goal.type === GoalType.B ? 1000 : 100}
				max={goal.type === GoalType.B ? 1500000 : 50000}
				step={goal.type === GoalType.B ? 500 : 100}
			/>
			{startYear > goal.by && (
				<NumberInput
					pre={`Yearly Cost Change from ${new Date().getFullYear()} to ${startYear}`}
					unit="%"
					min={-10}
					max={10}
					step={0.1}
					value={priceChgRate}
					changeHandler={setPriceChgRate}
				/>
			)}
		</Section>
	);
}
