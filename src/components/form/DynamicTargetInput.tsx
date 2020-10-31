import React, { useState, useEffect, useContext, Fragment } from 'react';
import { TargetInput } from '../../api/goals';
import NumberInput from './numberinput';
import SelectInput from './selectinput';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { initYearOptions } from '../utils';
import { createNewTarget } from '../goals/goalutils';
import { Col, Row } from 'antd';
import { FIGoalContext } from '../goals/FIGoalContext';
interface DynamicTargetInputProps {
	lossInput?: boolean;
}

export default function DynamicTargetInput({ lossInput }: DynamicTargetInputProps) {
	const { currency, rangeFactor, startYear, endYear, gains, setGains, losses, setLosses }: any = useContext(
		FIGoalContext
	);
	const [ yearOpts, setYearOpts ] = useState(initYearOptions(startYear, endYear - startYear));
	const tgts = lossInput ? losses : gains;
	const setTgts = lossInput ? setLosses : setGains;

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
		<Col span={24}>
			{tgts && tgts[0] ? (
				tgts.map((t: TargetInput, i: number) => (
					<Fragment>
						<SelectInput
							pre="Year"
							post={
								<Row justify="end" style={{minWidth: '50px'}}>
									<Col style={{ cursor: 'pointer' }} onClick={() => removeTgt(i)}>
										<MinusCircleOutlined />
									</Col>
									{i === tgts.length - 1 && (
										<Col style={{ cursor: 'pointer' }} onClick={() => addTgt()}>
											<PlusCircleOutlined />
										</Col>
									)}
								</Row>
							}
							options={yearOpts}
							value={t.year}
							changeHandler={(year: string) => changeTargetYear(i, year)}
						/>
						<Col span={24} style={{marginBottom: '0.5rem'}} />
						<NumberInput
							pre=""
							currency={currency}
							rangeFactor={rangeFactor}
							value={t.val}
							changeHandler={(val: number) => changeTargetVal(i, val)}
							min={0}
							max={900000}
							step={500}
						/>
						{i < tgts.length - 1 && <Col span={24} className="fields-divider" />}
					</Fragment>
				))
			) : (
				<Row justify="center" style={{ cursor: 'pointer' }} onClick={() => addTgt()}>
					<PlusCircleOutlined />
				</Row>
			)}
		</Col>
	);
}
