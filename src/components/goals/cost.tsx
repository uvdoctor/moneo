import React, { useContext, useEffect } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import HSwitch from '../HSwitch';
import { GoalType, TargetInput } from '../../api/goals';
import { createNewTarget } from './goalutils';
import { toCurrency } from '../utils';
import { Row, Col } from 'antd';
import { GoalContext } from './GoalContext';
import { CalcContext } from '../calc/CalcContext';

export default function Cost() {
	const {
		currency,
		rangeFactor,
		startYear,
		endYear,
		goal,
		inputTabs,
		setInputTabs
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
	}: any = useContext(GoalContext);
	const nowYear = new Date().getFullYear();

	const changeTargetVal = (val: number, i: number) => {
		if (!wipTargets || !setWIPTargets) return;
		wipTargets[i].val = val;
		setWIPTargets([ ...wipTargets ]);
	};

	const initTargets = () => {
		if (!wipTargets || !setWIPTargets || !startYear || !endYear) return;
		let targets: Array<TargetInput> = [];
		for (let year = startYear; year <= endYear; year++) {
			let existingT = null;
			if (wipTargets.length > 0) {
				existingT = wipTargets.filter((target: TargetInput) => target.year === year)[0] as TargetInput;
			}
			let t = createNewTarget(year, existingT ? existingT.val : 0);
			targets.push(t);
		}
		setWIPTargets([ ...targets ]);
	};

	useEffect(
		() => {
			if (manualMode > 0) initTargets();
		},
		[ manualMode, startYear, endYear ]
	);

	const changeManualMode = (checked: boolean) => {
		if (checked) {
			if (inputTabs[2].active) {
				inputTabs[2].active = false;
				setInputTabs([...inputTabs]);
			}
		} else {
			if (!inputTabs[2].active) {
				inputTabs[2].active = true;
				setInputTabs([...inputTabs]);
			}
		}
		setManualMode(checked);
	}

	return (
		<Section
			title={`Total Cost is ${toCurrency(price, currency)}`}
			toggle={
				setManualMode && <HSwitch rightText={`Custom Payment Plan`} value={manualMode} setter={changeManualMode} />
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
					pre="Cost Changes Yearly"
					note={startYear > nowYear && `From ${new Date().getFullYear()} to ${startYear}`}
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
