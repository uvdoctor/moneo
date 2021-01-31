import React, { useState, useEffect, useContext, Fragment } from 'react';
import { TargetInput } from '../../api/goals';
import NumberInput from './numberinput';
import SelectInput from './selectinput';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { initOptions } from '../utils';
import { createNewTarget } from '../goals/goalutils';
import { Button, Col, Row } from 'antd';
import { FIGoalContext } from '../goals/FIGoalContext';
import { CalcContext } from '../calc/CalcContext';
interface DynamicTargetInputProps {
	lossInput?: boolean;
}

export default function DynamicTargetInput({ lossInput }: DynamicTargetInputProps) {
	const { currency, startYear }: any = useContext(CalcContext);
	const { gains, setGains, losses, setLosses, planDuration }: any = useContext(FIGoalContext);
	const nowYear = new Date().getFullYear();
	const [ yearOpts, setYearOpts ] = useState(initOptions(nowYear, startYear + planDuration - 1 - nowYear));
	const tgts = lossInput ? losses : gains;
	const setTgts = lossInput ? setLosses : setGains;

	const getDefaultYear = () => {
		if (!tgts || tgts.length === 0) return nowYear;
		return tgts[tgts.length - 1].num + 1;
	};

	const newRec = () => createNewTarget(getDefaultYear(), 0);

	const filterTgts = () => {
		let ft = tgts.filter((t: TargetInput) => t.num >= nowYear && t.num <= startYear + planDuration - 1);
		setTgts([ ...ft ]);
	};

	useEffect(() => filterTgts(), []);

	useEffect(
		() => {
			filterTgts();
			setYearOpts(initOptions(nowYear, startYear + planDuration - 1 - nowYear));
		},
		[ planDuration, startYear ]
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
		tgts[index].num = parseInt(year);
		setTgts([ ...tgts ]);
	};

	const changeTargetVal = (index: number, val: number) => {
		tgts[index].val = val;
		setTgts([ ...tgts ]);
	};

	return (
		<Col span={24}>
			{tgts &&
				tgts[0] &&
				tgts.map((t: TargetInput, i: number) => (
					<Fragment>
						<SelectInput
							pre="Year"
							post={
								<Button type="link" onClick={() => removeTgt(i)} danger>
									<DeleteOutlined />
								</Button>
							}
							options={yearOpts}
							value={t.num}
							changeHandler={(year: string) => changeTargetYear(i, year)}
						/>
						<Col span={24} style={{ marginBottom: '0.5rem' }} />
						<NumberInput
							pre=""
							currency={currency}
							value={t.val}
							changeHandler={(val: number) => changeTargetVal(i, val)}
							min={0}
							max={900000}
							step={500}
						/>
						{i < tgts.length - 1 && <Col span={24} className="fields-divider" />}
					</Fragment>
				))}
			<Row justify="center">
				<Col>
					<Button shape="circle" type="primary" onClick={() => addTgt()} icon={<PlusOutlined />} />
				</Col>
			</Row>
		</Col>
	);
}
