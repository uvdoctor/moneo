import React, { useState, useEffect, Fragment, useContext } from 'react';
import { TargetInput } from '../../api/goals';
import NumberInput from './numberinput';
import SelectInput from './selectinput';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { initYearOptions } from '../utils';
import { createNewTarget } from '../goals/goalutils';
import { Space } from 'antd';
import { FIGoalContext } from '../goals/FIGoalContext';
interface DynamicTgtInputProps {
	lossInput?: boolean;
}

export default function DynamicTgtInput({ lossInput }: DynamicTgtInputProps) {
	const { currency, rangeFactor, startYear, endYear, goals, losses, setGoals, setLosses }: any = useContext(
		FIGoalContext
	);
	const [ yearOpts, setYearOpts ] = useState(initYearOptions(startYear, endYear - startYear));
	const tgts = lossInput ? losses : goals;
	const setTgts = lossInput ? setLosses : setGoals;

	const getDefaultYear = () => {
		if (!tgts || tgts.length === 0) return startYear;
		return tgts[tgts.length - 1].year + 1;
	};

	const newRec = () => createNewTarget(getDefaultYear(), 0);

	const filterTgts = () => {
		let ft = tgts.filter((t: TargetInput) => t.year >= startYear && t.year <= endYear);
		setTgts([ ...ft ]);
	};

	useEffect(
		() => {
			filterTgts();
			setYearOpts(initYearOptions(startYear, endYear - startYear));
		},
		[ startYear, endYear ]
	);

	const addTgt = () => {
		tgts.push(newRec());
		setTgts([ ...tgts ]);
	};

	const removeTgt = (index: number) => {
		tgts.splice(index, 1);
		setTgts([ ...tgts ]);
	};

	const changeTargetYear = (index: number, year: string) => {
		tgts[index].year = parseInt(year);
		setTgts([ ...tgts ]);
	};

	const changeTargetVal = (index: number, val: number) => {
		tgts[index].val = val;
		setTgts([ ...tgts ]);
	};

	return (
		<Fragment>
			{tgts && tgts[0] ? (
				tgts.map((t: TargetInput, i: number) => (
					<Space key={'ctr' + i} align="center" size="large">
						<Space align="center" size="small">
							<SelectInput
								pre="Year"
								options={yearOpts}
								value={t.year}
								changeHandler={(year: string) => changeTargetYear(i, year)}
							/>
							<NumberInput
								pre="Amount"
								currency={currency}
								rangeFactor={rangeFactor}
								value={t.val}
								changeHandler={(val: number) => changeTargetVal(i, val)}
								min={0}
								max={900000}
								step={500}
							/>
						</Space>
						<div style={{ cursor: 'pointer' }} onClick={() => removeTgt(i)}>
							<MinusCircleOutlined />
						</div>
						{i === tgts.length - 1 && (
							<div style={{ cursor: 'pointer' }} onClick={() => addTgt()}>
								<PlusCircleOutlined />
							</div>
						)}
					</Space>
				))
			) : (
				<div style={{ cursor: 'pointer' }} onClick={() => addTgt()}>
					<PlusCircleOutlined />
				</div>
			)}
		</Fragment>
	);
}
