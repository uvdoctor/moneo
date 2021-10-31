import { Col } from 'antd';
import React, { Fragment } from 'react';
import { HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';

interface SavingTabInputProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
	categoryOptions: any;
}

export default function SavingTabInput({ data, changeData, record, categoryOptions }: SavingTabInputProps) {
	const changeName = (e: any) => {
		record.name = e.target.value;
		changeData([ ...data ]);
	};

	const changeAmt = (amt: number) => {
		record.qty = amt;
		changeData([ ...data ]);
	};

	const changeSubtype = (curr: string) => {
		record.curr = curr;
		changeData([ ...data ]);
	};
	return (
		<Fragment>
			<Col>
				<SelectInput
					pre=""
					value={record.curr as string}
					options={categoryOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>
			</Col>
			<Col>
				<TextInput pre="Name" changeHandler={changeName} value={record.name as string} size={'small'} />
			</Col>
			<Col>
				<NumberInput
					pre={'Amount'}
					min={0}
					max={100000}
					value={record.qty}
					changeHandler={changeAmt}
					currency={record.curr as string}
					step={1}
					hidSlider
				/>
			</Col>
		</Fragment>
	);
}
