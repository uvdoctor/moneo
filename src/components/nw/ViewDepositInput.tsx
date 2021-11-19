import { Col, InputNumber } from 'antd';
import React, { Fragment } from 'react';
import { DepositInput } from '../../api/goals';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';

interface ViewDepositInputProps {
	data: Array<DepositInput>;
	changeData: Function;
	record: DepositInput;
	categoryOptions: any;
	subCategoryOptions: any;
}

export default function ViewDepositInput({
	data,
	changeData,
	record,
	categoryOptions,
	subCategoryOptions
}: ViewDepositInputProps) {
	const changeAmount = (quantity: number) => {
		record.amt = quantity;
		changeData([ ...data ]);
	};

	const changeChg = (chg: number) => {
		record.rate = chg;
		changeData([ ...data ]);
	};

	const changeDuration = (val: any) => {
		record.months = val;
		changeData([ ...data ]);
	};

	const changeCum = (subtype: string) => {
		record.cum = subtype === 'true' ? true : false;
		if (subCategoryOptions) {
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

	const changeStartDate = (val: string) => {
		record.sm = Number(val.slice(0, val.indexOf('-')));
		record.sy = Number(val.slice(val.indexOf('-') + 1));
		changeData([ ...data ]);
	};

	return (
		<Fragment>
			{categoryOptions && (
				<Col>
					<SelectInput
						pre=""
						value={record.cum === true ? 'true' : 'false'}
						options={categoryOptions}
						changeHandler={(val: string) => changeCum(val)}
					/>
					{subCategoryOptions ? (
						subCategoryOptions[record.cum === true ? 'true' : 'false'] && (
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
						)
					) : null}
				</Col>
			)}
			<Col>
				<DatePickerInput
					picker="month"
					title={'Start Date'}
					changeHandler={(val: string) => changeStartDate(val)}
					defaultVal={`${record.sy}-${record.sm}` as string}
					size={'middle'}
				/>&nbsp;&nbsp;
				<label>Duration</label>
				<InputNumber onChange={changeDuration} value={record.months as number} />
			</Col>
			<Col>
				<label>Rate</label>&nbsp;
				<InputNumber onChange={changeChg} min={1} max={50} value={record.rate as number} step={0.1} />
			</Col>
			<Col>
				<NumberInput
					pre={'Amount'}
					min={10}
					max={100000}
					value={record.amt as number}
					changeHandler={changeAmount}
					currency={record.curr as string}
					step={1}
					noSlider
				/>
			</Col>
		</Fragment>
	);
}
