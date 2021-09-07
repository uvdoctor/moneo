import { Col, InputNumber } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { NWContext, PM_TAB } from './NWContext';
import { getCommodityRate, getCryptoRate } from './nwutils';
import { toCurrency } from '../utils';
import { AppContext } from '../AppContext';

interface ViewHoldingInputProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	subCategoryOptions: any;
	record: HoldingInput;
}

export default function ViewHoldingInput({
	data,
	changeData,
	categoryOptions,
	subCategoryOptions,
	record
}: ViewHoldingInputProps) {
	const { ratesData }: any = useContext(AppContext);
	const { selectedCurrency, childTab }: any = useContext(NWContext);
	console.log("Subcategories: ", subCategoryOptions);

	const changeQty = (quantity: number) => {
		record.qty = quantity;
		changeData([ ...data ]);
	};

	const changeSubtype = (subtype: string) => {
		record.subt = subtype;
		if(subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (!opts[record.name as string]) record.name = Object.keys(opts)[0];
		}
		changeData([ ...data ]);
	};

	const changePurity = (purity: string) => {
		record.name = purity;
		changeData([ ...data ]);
	};

	const getRate = (subtype: string, name: string) =>
	!name 
		? getCryptoRate(ratesData, subtype as string, selectedCurrency)
		: getCommodityRate(ratesData, subtype as string, name as string, selectedCurrency);

	return (
		<Fragment>
			<Col>
				<SelectInput
					pre=""
					value={record.subt as string}
					options={categoryOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>
				{subCategoryOptions && (
					<Fragment>
						&nbsp;
						<SelectInput
							pre=""
							value={record.name as string}
							options={subCategoryOptions[record.subt as string]}
							changeHandler={(val: string) => changePurity(val)}
							post={record.subt === AssetSubType.Gold ? 'karat' : ''}
						/>
					</Fragment>
				)}
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
				{`${childTab === PM_TAB ? ` grams` : ''} x ${toCurrency(getRate(record.subt as string, record.name as string), selectedCurrency)} = ${toCurrency(
					record.qty * getRate(record.subt as string, record.name as string),
					selectedCurrency
				)}`}
			</Col>
		</Fragment>
	);
}
