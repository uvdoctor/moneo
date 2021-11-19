import { UserOutlined } from '@ant-design/icons';
import { InputNumber, Row } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import {
	BTC,
	CRYPTO_TAB,
	EPF_TAB,
	NPS_TAB,
	NWContext,
	OTHER_TAB,
	PM_TAB,
	PPF_TAB,
	SAV_TAB,
	VEHICLE_TAB,
	VPF_TAB
} from './NWContext';
import { getDefaultMember, getFamilyOptions } from './nwutils';
import PurchaseInput from './PurchaseInput';
import QuantityWithRate from './QuantityWithRate';

interface AddHoldingInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
	purchase?: boolean;
}

export default function AddHoldingInput({
	setInput,
	disableOk,
	categoryOptions,
	subCategoryOptions,
	purchase
}: AddHoldingInputProps) {
	const { allFamily, childTab, selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const [ subtype, setSubtype ] = useState<string>(childTab === PM_TAB ? AssetSubType.Gold : childTab === NPS_TAB ? 'L' : BTC);
	const [ name, setName ] = useState<string>(subCategoryOptions ? Object.keys(subCategoryOptions[subtype])[0] : '');
	const [ quantity, setQuantity ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ chg, setChg ] = useState<number>(0);
	const [ amount, setAmount ] = useState<number>(0);
	const [ month, setMonth ] = useState<number>(1);
	const [ year, setYear ] = useState<number>(new Date().getFullYear() - 5);

	const getNewRec = () => {
		let newRec: HoldingInput = { id: '', qty: 0, fId: '' };
		switch (childTab) {
			case NPS_TAB:
				newRec.subt = subtype;
				break;
			case OTHER_TAB:
				newRec.subt = subtype;
				break;
			case PPF_TAB:
			case EPF_TAB:
			case VPF_TAB:
				newRec.chg = chg; 
				newRec.chgF = childTab === PPF_TAB ? 1 : 12;
				newRec.type = AssetType.F;
				newRec.subt = childTab;
				break;
			case VEHICLE_TAB:
				newRec.chg = 15;
				newRec.chgF = 1;
				newRec.type = AssetType.A;
				newRec.subt = subtype;
				break;
			case PM_TAB:
				newRec.type = AssetType.A;
				newRec.subt = subtype;
				break;
			case CRYPTO_TAB:
				newRec.type = AssetType.A;
				newRec.subt = subtype;
				break;
		}
		childTab === PM_TAB || childTab === CRYPTO_TAB ? (newRec.curr = 'USD') : (newRec.curr = selectedCurrency);
		if (purchase) {
			newRec.pur = [
				{
					amt: amount,
					month: month,
					year: year,
					qty: 1
				}
			];
		}
		newRec.qty = quantity;
		newRec.name = name;
		newRec.fId = memberKey;
		return newRec;
	};

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeChg = (val: number) => {
		setChg(val);
		let rec = getNewRec();
		rec.chg = val;
		setInput(rec);
	};

	const changeQuantity = (qty: number) => {
		setQuantity(qty);
		disableOk(qty <= 0);
		let rec = getNewRec();
		rec.qty = qty;
		setInput(rec);
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
		let rec = getNewRec();
		childTab === SAV_TAB ? (rec.curr = subtype) : (rec.subt = subtype);
		return rec;
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		let rec = getNewRec();
		rec.fId = key;
		setInput(rec);
	};

	return (
	<div style={{ textAlign: 'center' }}>
		<p>
			{categoryOptions && <SelectInput
				pre=""
				value={subtype}
				options={categoryOptions}
				changeHandler={(val: string) => changeSubtype(val)}
			/>}
			{subCategoryOptions ? subCategoryOptions[subtype as string] && (
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
			): null}
		</p>
		{purchase &&  <p><PurchaseInput amount={amount} setAmount={setAmount} month={month} setMonth={setMonth} year={year} setYear={setYear}/></p>}
		<p>
			<Row justify='center'>
			{childTab === PM_TAB || childTab === NPS_TAB || childTab === CRYPTO_TAB ? null : 
			   <TextInput pre={'Name'} value={name} changeHandler={changeName} size={'middle'} width={250} /> }
			
			{childTab === PM_TAB || childTab === NPS_TAB || childTab === CRYPTO_TAB ? 
				<QuantityWithRate quantity={quantity} onChange={changeQuantity} subtype={subtype} name={name} /> 
			  : <NumberInput pre={'Amount'} min={0} max={10000} value={quantity} changeHandler={changeQuantity} currency={selectedCurrency} 
			  	step={1} post={childTab === PPF_TAB ? '(Annually)' : childTab === EPF_TAB || childTab === VPF_TAB ? '(Monthly)' : ''}  noSlider />
			}
			</Row>
		</p>
		{ (childTab === PPF_TAB || childTab === EPF_TAB || childTab === VPF_TAB) &&
		 	<p>
				<label>Rate</label>&nbsp;
				<InputNumber
				onChange={changeChg}
				min={1}
				max={50}
				value={chg}
				step={0.1} />
			</p>
		}
		<p>
			<SelectInput
				pre={<UserOutlined />}
				value={memberKey}
				options={getFamilyOptions(allFamily)}
				changeHandler={(key: string) => changeMember(key)}
			/>
		</p>
	</div>
	)
}
