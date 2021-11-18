import { Col, InputNumber } from 'antd';
import React, { Fragment } from 'react';
import { LiabilityInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';

interface ViewLiabilityInputProps {
	data: Array<LiabilityInput>;
	changeData: Function;
	record: LiabilityInput;
	categoryOptions?: any;
}

export default function ViewLiabilityInput({ data, changeData, record, categoryOptions }: ViewLiabilityInputProps) {
	const changeAmount = (quantity: number) => {
		record.amt = quantity;
		changeData([ ...data ]);
	};

    const changeName = (val: string) => {
		record.name = val;
		changeData([ ...data ]);
	};

	const changeDuration = (val: number) => {
		record.dur = val;
		changeData([ ...data ]);
	};

	const changeYearly = (val: any) => {
		record.yearly = val === 'true' ? true : false;
		changeData([ ...data ]);
	};

	const changeType = (val: string) => {
        record.type = val;
        changeData([ ...data ]);
	};

	return (
		<Fragment>
			{categoryOptions && <Col>
				<SelectInput
				pre="Insurance"
				value={record.type as string}
				options={categoryOptions}
				changeHandler={(val: string) => changeType(val)}
			/>
		</Col>}
		    <Col>
                <TextInput pre={'Name'} value={record.name as string} changeHandler={changeName} size={'middle'}/>
			</Col>
            <Col>
                <SelectInput
                        pre={'Installment Type'}
                        value={record.yearly === true ? 'true' : 'false'}
                        options={{ true: 'Yearly', false: 'Monthly' }}
                        changeHandler={changeYearly}
                    />
                    &nbsp;
                    <label>No. of installment</label>
                    <InputNumber
                        min={1}
                        max={1000}
                        value={record.dur as number}
                        onChange={changeDuration}
                        step={1}
                    />
            </Col>
			<Col>
				<NumberInput pre={'Installment Amount'} min={10} max={100000} value={record.amt as number} changeHandler={changeAmount} currency={record.curr as string} step={1} noSlider/>
			</Col>
		</Fragment>
	);
}
