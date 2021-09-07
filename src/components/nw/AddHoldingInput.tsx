import { UserOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import { AppContext } from '../AppContext';
import SelectInput from '../form/selectinput';
import { toCurrency } from '../utils';
import { NWContext, PM_TAB } from './NWContext';
import { getCommodityRate, getCryptoRate, getFamilyOptions } from './nwutils';

interface AddHoldingInputProps {
	input: HoldingInput;
	disableOk: Function;
	categoryOptions: any;
	subCategoryOptions?: any
}

export default function AddHoldingInput({ input, disableOk, categoryOptions, subCategoryOptions }: AddHoldingInputProps) {
	const { ratesData }: any = useContext(AppContext);
	const { selectedCurrency, allFamily, childTab }: any = useContext(NWContext);
	const [ name, setName ] = useState<string>(input.name as string);
	const [ subtype, setSubtype ] = useState<string>(input.subt as string);
	const [ quantity, setQuantity ] = useState<number>(input.qty);
	const [ memberKey, setMemberKey ] = useState<string>(input.fIds[0]);

	const changeName = (val: string) => {
		setName(val);
		input.name = val;
	};

	const changeQuantity = (qty: number) => {
		setQuantity(qty);
		input.qty = qty;
		disableOk(qty <= 0);
	};

	const changeSubtype = (subtype: string) => {
		input.subt = subtype;
		setSubtype(subtype);
		if(subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (!opts[name]) {
				let defaultVal: string = Object.keys(opts)[0];
				setName(defaultVal);
				input.name = defaultVal;
			}
		}
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		input.fIds[0] = key;
	};

	const getRate = (subtype: string, name: string) =>
		!name
			? getCryptoRate(ratesData, subtype, selectedCurrency)
			: getCommodityRate(ratesData, subtype, name, selectedCurrency);

	return (
		<div style={{ textAlign: 'center' }}>
			<p>
				<SelectInput
					pre=""
					value={input.subt as string}
					options={categoryOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>
				{subCategoryOptions && (
					<Fragment>
						&nbsp;
						<SelectInput
							pre=""
							value={input.name as string}
							options={subCategoryOptions[subtype as string]}
							changeHandler={(val: string) => changeName(val)}
							post={subtype === AssetSubType.Gold ? 'karat' : ''}
						/>
					</Fragment>
				)}
			</p>
			<p>
				<InputNumber
					value={quantity}
					onChange={(quantity: number) => changeQuantity(quantity)}
					min={0}
					max={100000}
					step={0.1}
					size="small"
				/>
				{` ${childTab === PM_TAB ? ` grams` : ''} x ${toCurrency(getRate(subtype as string, name as string), selectedCurrency)} = ${toCurrency(
					quantity * getRate(subtype as string, name as string),
					selectedCurrency
				)}`}
			</p>
			<p>
				<SelectInput
					pre={<UserOutlined />}
					value={memberKey}
					options={getFamilyOptions(allFamily)}
					changeHandler={(key: string) => changeMember(key)}
				/>
			</p>
		</div>
	);
}
