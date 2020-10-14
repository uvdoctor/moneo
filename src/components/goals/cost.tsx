import React, { useEffect } from 'react';
import Section from '../form/section';
import NumberInput from '../form/numberinput';
import HSwitch from '../HSwitch';
import { TargetInput } from '../../api/goals';
import { createNewTarget } from './goalutils';
import { toCurrency } from '../utils';
interface CostProps {
	leftNote?: string;
	footer?: string;
	leftMax: number;
	startingCost: number;
	costChgRate: number;
	cost: number;
	manualMode: number;
	manualTargets?: Array<TargetInput>;
	currency: string;
	rangeFactor: number;
	startYear: number;
	endYear?: number;
	baseYear: number;
	manualTgtMin?: number;
	manualModeHandler?: Function;
	manualTargetsHandler?: Function;
	startingCostHandler: Function;
	costChgRateHandler: Function;
}

export default function Cost(props: CostProps) {
	const changeTargetVal = (val: number, i: number) => {
		if (!props.manualTargets || !props.manualTargetsHandler) return;
		props.manualTargets[i].val = val;
		props.manualTargetsHandler([ ...props.manualTargets ]);
	};

	const initManualTargets = () => {
		if (!props.manualTargets || !props.manualTargetsHandler || !props.startYear || !props.endYear) return;
		let targets: Array<TargetInput> = [];
		for (let year = props.startYear; year <= props.endYear; year++) {
			let existingT = null;
			if (props.manualTargets.length > 0) {
				existingT = props.manualTargets.filter((target) => target.year === year)[0] as TargetInput;
			}
			let t = createNewTarget(year, existingT ? existingT.val : 0);
			targets.push(t);
		}
		props.manualTargetsHandler([ ...targets ]);
	};

	useEffect(
		() => {
			if (props.manualMode > 0) initManualTargets();
		},
		[ props.manualMode, props.startYear, props.endYear ]
	);

	return (
		<Section
			title={
				props.manualMode > 0 ? (
					`Total Amount is ${toCurrency(props.cost, props.currency)}`
				) : (
					`Amount${props.startYear > props.baseYear
						? ` in ${props.startYear} ~ ${toCurrency(props.cost, props.currency)}`
						: ''}`
				)
			}
			left={
				<NumberInput
					pre={props.startYear > props.baseYear ? 'Amount' : ''}
					post={props.startYear > props.baseYear ? `in ${props.baseYear}` : ''}
					currency={props.currency}
					rangeFactor={props.rangeFactor}
					value={props.startingCost}
					changeHandler={props.startingCostHandler}
					min={0}
					max={props.leftMax}
					step={500}
					note={props.leftNote}
				/>
			}
			right={
				props.startYear > props.baseYear && (
					<NumberInput
						pre="Amount"
						post="Changes"
						note={`Yearly till ${props.startYear}`}
						unit="%"
						min={-10}
						max={10}
						step={0.5}
						value={props.costChgRate}
						changeHandler={props.costChgRateHandler}
					/>
				)
			}
			toggle={
				props.manualModeHandler && (
					<HSwitch
						rightText={`Custom Payment Plan`}
						value={props.manualMode}
						setter={props.manualModeHandler}
					/>
				)
			}
			manualInput={
				props.manualTargets && (
					<div>
						{props.manualTargets.map((t, i) => (
							<div key={'t' + i} style={{ marginRight: '1rem', marginBottom: '1rem' }}>
								<label>{t.year}</label>
								<NumberInput
									pre=""
									currency={props.currency}
									rangeFactor={props.rangeFactor}
									value={t.val}
									changeHandler={(val: number) => changeTargetVal(val, i)}
									min={props.manualTgtMin ? props.manualTgtMin : 0}
									max={900000}
									step={500}
								/>
							</div>
						))}
					</div>
				)
			}
			manualMode={props.manualMode}
			footer={props.footer}
			videoSrc={`https://www.youtube.com/watch?v=uYMTsmeZyfU`}
		/>
	);
}
