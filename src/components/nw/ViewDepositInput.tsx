import { Col, InputNumber } from 'antd';
import React, { Fragment } from 'react';
import { DepositInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';

interface ViewDepositInputProps {
	data: Array<DepositInput>;
	changeData: Function;
	record: DepositInput;
	categoryOptions: any;
	subCategoryOptions: any;
}

export default function ViewDepositInput({ data, changeData, record, categoryOptions, subCategoryOptions }: ViewDepositInputProps) {
	const changeAmount = (quantity: number) => {
		record.amt = quantity;
		changeData([ ...data ]);
	};

	const changeChg = (chg: number) => {
		record.rate = chg;
		changeData([ ...data ]);
	};

	const changeDuration = (e: any) => {
		record.months = e.target.value;
		changeData([ ...data ]);
	};

	const changeMonth = (e: any) => {
		record.sm = e.target.value;
		changeData([ ...data ]);
	};

	const changeYear = (e: any) => {
		record.sy = e.target.value;
		changeData([ ...data ]);
	};

	const changeCum = (subtype: string) => {
	record.cum = subtype === 'true' ? true : false;
	if(subCategoryOptions) {
		let opts = subCategoryOptions[subtype];
		// @ts-ignore
		if (!opts[record.cumf]) record.cumf = Object.keys(opts)[0];
	}
	changeData([ ...data ]);
	};

	const changeCumf = (val: number) => {
		record.cumf = val;
		changeData([ ...data ]);
	};

	return (
		<Fragment>
			{categoryOptions && <Col>
				<SelectInput
				pre=""
				value={record.cum === true ? 'true' : 'false'}
				options={categoryOptions}
				changeHandler={(val: string) => changeCum(val)}
			/>
			{subCategoryOptions ? subCategoryOptions[record.cum === true ? 'true' : 'false'] && (	
				<Fragment>
					&nbsp;
					<SelectInput
						pre=""
						value={record.cumf as number}
						options={subCategoryOptions[record.cum === true ? 'true' : 'false']}
						changeHandler={(val: number) => changeCumf(val)}
						post={'Frequency'}
					/>
				</Fragment>
			): null}
		</Col>}
			<Col>
				<label>Start Month</label><InputNumber onChange={changeMonth} value={record.sm as number} />&nbsp;&nbsp;
				<label>Start Year</label><InputNumber onChange={changeYear} value={record.sy as number} />&nbsp;&nbsp;
				<label>Duration</label><InputNumber onChange={changeDuration} value={record.months as number} />
				</Col>
		    <Col>
		   		<NumberInput pre={'Rate'} changeHandler={changeChg} post={'%'} min={0} max={50} value={record.rate as number} step={0.1} noSlider/>
			</Col>
			<Col>
				<NumberInput pre={'Amount'} min={10} max={100000} value={record.amt as number} changeHandler={changeAmount} currency={record.curr as string} step={1} noSlider/>
			</Col>
		</Fragment>
	);
}
