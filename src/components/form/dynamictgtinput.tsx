import React, { useState, useEffect, Fragment } from 'react';
import { TargetInput } from '../../api/goals';
import NumberInput from './numberinput';
import SelectInput from './selectinput';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { initYearOptions } from '../utils';
import { createNewTarget } from '../goals/goalutils';
import { Space } from 'antd';
interface DynamicTgtInputProps {
	tgts: Array<TargetInput>;
	currency: string;
	rangeFactor: number;
	startYear: number;
	endYear: number;
	tgtsHandler: Function;
}

export default function DynamicTgtInput(props: DynamicTgtInputProps) {
	const [ yearOpts, setYearOpts ] = useState(initYearOptions(props.startYear, props.endYear - props.startYear));

	const getDefaultYear = () => {
		if (!props.tgts || props.tgts.length === 0) return props.startYear;
		return props.tgts[props.tgts.length - 1].year + 1;
	};

	const newRec = () => createNewTarget(getDefaultYear(), 0);

	const filterTgts = () => {
		let ft = props.tgts.filter((t) => t.year >= props.startYear && t.year <= props.endYear);
		props.tgtsHandler([ ...ft ]);
	};

	useEffect(
		() => {
			filterTgts();
			setYearOpts(initYearOptions(props.startYear, props.endYear - props.startYear));
		},
		[ props.startYear, props.endYear ]
	);

	const addTgt = () => {
		props.tgts.push(newRec());
		props.tgtsHandler([ ...props.tgts ]);
	};

	const removeTgt = (index: number) => {
		props.tgts.splice(index, 1);
		props.tgtsHandler([ ...props.tgts ]);
	};

	const changeTargetYear = (index: number, year: string) => {
		props.tgts[index].year = parseInt(year);
		props.tgtsHandler([ ...props.tgts ]);
	};

	const changeTargetVal = (index: number, val: number) => {
		props.tgts[index].val = val;
		props.tgtsHandler([ ...props.tgts ]);
	};

	return (
		<Fragment>
			{props.tgts && props.tgts[0] ? (
				props.tgts.map((t, i) => (
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
								currency={props.currency}
								rangeFactor={props.rangeFactor}
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
						{i === props.tgts.length - 1 && (
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
