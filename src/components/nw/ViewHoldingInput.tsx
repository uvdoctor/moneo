import { Col, InputNumber } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { NWContext } from './NWContext';
import { getCommodityRate } from './nwutils';
import { toCurrency } from '../utils';
import { stringType } from 'aws-sdk/clients/iam';
import { AppContext } from '../AppContext';

interface ViewHoldingInputProps {
	data: Array<HoldingInput>;
	changeData: Function;
	typeOptions: any;
	subtypeOptions: any;
	record: HoldingInput;
}

export default function ViewHoldingInput({
	data,
	changeData,
	typeOptions,
	subtypeOptions,
	record
}: ViewHoldingInputProps) {
	const { ratesData }: any = useContext(AppContext);
	const { selectedCurrency }: any = useContext(NWContext);

	const changeQty = (quantity: number) => {
		record.qty = quantity;
		changeData([ ...data ]);
	};

	const changeSubtype = (subtype: string) => {
		record.subt = subtype;
		let opts = subtypeOptions[subtype];
		if (!opts[record.name as string]) record.name = Object.keys(opts)[0];
		changeData([ ...data ]);
	};

	const changePurity = (purity: string) => {
		record.name = purity;
		changeData([ ...data ]);
	};

	return (
		<Fragment>
			<Col>
				<SelectInput
					pre=""
					value={record.subt as string}
					options={typeOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>
				&nbsp;
				<SelectInput
					pre=""
					value={record.name as string}
					options={subtypeOptions[record.subt as string]}
					changeHandler={(val: string) => changePurity(val)}
					post={record.subt === AssetSubType.Gold ? 'karat' : ''}
				/>
			</Col>
			<Col>
				<InputNumber
					value={record.qty}
					onChange={(quantity: number) => changeQty(quantity)}
					min={0}
					max={1000}
					step={0.1}
					size="small"
				/>
				{` grams x ${toCurrency(
					getCommodityRate(ratesData, record.subt as stringType, record.name as string, selectedCurrency),
					selectedCurrency
				)} = ${toCurrency(
					record.qty *
						getCommodityRate(ratesData, record.subt as stringType, record.name as string, selectedCurrency),
					selectedCurrency
				)}`}
			</Col>
		</Fragment>
	);
}
