import { UserOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { AssetSubType, AssetType } from '../../api/goals';
import { AppContext } from '../AppContext';
import SelectInput from '../form/selectinput';
import { toCurrency } from '../utils';
import { BTC, NWContext, PM_TAB } from './NWContext';
import { getCommodityRate, getCryptoRate, getDefaultMember, getFamilyOptions } from './nwutils';

interface AddHoldingInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
}

export default function AddHoldingInput({
	setInput,
	disableOk,
	categoryOptions,
	subCategoryOptions
}: AddHoldingInputProps) {
	const { ratesData }: any = useContext(AppContext);
	const { selectedCurrency, allFamily, childTab, selectedMembers }: any = useContext(NWContext);
	const [ name, setName ] = useState<string>(childTab === PM_TAB ? '24' : '');
	const [ subtype, setSubtype ] = useState<string>(childTab === PM_TAB ? AssetSubType.Gold : BTC);
	const [ quantity, setQuantity ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));

	const changeName = (val: string) => {
		setName(val);
		setInput(getNewRec());
	};

	const changeQuantity = (qty: number) => {
		setQuantity(qty);
		disableOk(qty <= 0);
		setInput(getNewRec());
	};

	const getNewRec = () => {
		let newRec = {
			id: '',
			type: AssetType.A,
			subt: subtype,
			fIds: memberKey,
			qty: quantity,
			curr: 'USD',
			name: name
		};
		return newRec;
	};

	const changeSubtype = (subtype: string) => {
		setSubtype(subtype);
		if (subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (opts && Object.keys(opts).length && !opts[name]) {
				let defaultVal: string = Object.keys(opts)[0];
				setName(defaultVal);
			}
		}
		setInput(getNewRec());
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		setInput(getNewRec());
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
					value={subtype}
					options={categoryOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>
				{subCategoryOptions && (
					<Fragment>
						&nbsp;
						<SelectInput
							pre=""
							value={name as string}
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
				{` ${childTab === PM_TAB ? ` grams` : ''} x ${toCurrency(
					getRate(subtype as string, name as string),
					selectedCurrency
				)} = ${toCurrency(quantity * getRate(subtype as string, name as string), selectedCurrency)}`}
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
