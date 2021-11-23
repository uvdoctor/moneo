import { UserOutlined } from '@ant-design/icons';
import { InputNumber, Row } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import {
	CRYPTO_TAB,
	DEPO_TAB,
	EPF_TAB,
	INS_TAB,
	LOAN_TAB,
	ML_TAB,
	NPS_TAB,
	NWContext,
	OTHER_TAB,
	PM_TAB,
	PPF_TAB,
	VEHICLE_TAB,
	VPF_TAB
} from './NWContext';
import { getDefaultMember, getFamilyOptions } from './nwutils';
import QuantityWithRate from './QuantityWithRate';

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
	subCategoryOptions,
}: AddHoldingInputProps) {
	const { allFamily, childTab, selectedMembers, selectedCurrency, activeTab }: any = useContext(NWContext);
	const [ subtype, setSubtype ] = useState<string>(categoryOptions ? Object.keys(categoryOptions)[0] : '');
	const [ name, setName ] = useState<string>(subCategoryOptions ? Object.keys(subCategoryOptions[subtype])[0] : '');
	const [ quantity, setQuantity ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ chg, setChg ] = useState<number>(0);
	const [ amount, setAmount ] = useState<number>(0);
	const [ purchaseDate, setPurchaseDate ] = useState<string>('2000-4');
	const [ duration, setDuration ] = useState<number>(12);
	const [ chgF, setChgF ] = useState<number>(1);

	const getNewRec = () => {
		let newRec: HoldingInput = { id: '', qty: 0, fId: '' };
		switch (childTab) {
			case DEPO_TAB:
			case ML_TAB:
				newRec.chg = chg,
				newRec.chgF = Number(subtype)
				newRec.pur = [
					{
						amt: quantity,
						month: Number(purchaseDate.slice(purchaseDate.indexOf('-') + 1)),
						year: Number(purchaseDate.slice(0, purchaseDate.indexOf('-'))),
						qty: duration
					}
				]
				break;
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
				newRec.chgF = childTab === PPF_TAB ? Number(subtype) : 12;
				newRec.type = AssetType.F;
				newRec.subt = childTab;
				break;
			case VEHICLE_TAB:
				newRec.chg = 15;
				newRec.chgF = 1;
				newRec.type = AssetType.A;
				newRec.subt = subtype;
				newRec.pur = [
					{
						amt: quantity,
						qty: 1,
						month: Number(purchaseDate.slice(purchaseDate.indexOf('-') + 1)),
						year: Number(purchaseDate.slice(0, purchaseDate.indexOf('-'))),
					}
				]
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
		if (activeTab === INS_TAB) newRec.subt = subtype;
		if (activeTab === LOAN_TAB || activeTab === INS_TAB){
			newRec.chgF = Number(chgF);
			newRec.pur = [
				{
					amt: amount,
					month: 1,
					year: 1,
					qty: 1
				}
			]
		}
		childTab === PM_TAB || childTab === CRYPTO_TAB ? (newRec.curr = 'USD') : (newRec.curr = selectedCurrency);
		newRec.qty = childTab === VEHICLE_TAB ? 0 : quantity;
		newRec.name = name;
		newRec.fId = memberKey;
		return newRec;
	};

	const changePurchaseDate = (val: any) => {
		setPurchaseDate(val);
		let rec = getNewRec();
		if(rec.pur) {
			rec.pur[0].year = Number(val.slice(0, val.indexOf('-')));
			rec.pur[0].month = Number(val.slice(val.indexOf('-') + 1)); 
		}
		setInput(rec);
	};

	const changeAmount = (val: number) => {
		// used for loans and insurance as duration
		setAmount(val);
		let rec = getNewRec();
		if(rec.pur) rec.pur[0].amt = val;
		setInput(rec);
	};

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeChg = (val: number) => {
		setChg(val);
		disableOk(val <= 0);
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
		rec.subt = subtype;
		return rec;
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		let rec = getNewRec();
		rec.fId = key;
		setInput(rec);
	};

	const changeDuration = (val: number) => {
		setDuration(val);
		disableOk(val <= 0);
		let rec = getNewRec();
		if(rec.pur) rec.pur[0].qty = val;
		setInput(rec);
	};

	const changeYearly = (val: number) => {
		setChgF(val);
		let rec = getNewRec();
		rec.chgF = Number(chgF)
		setInput(rec);
	};

	return (
		<div style={{ textAlign: 'center' }}>
			<p>
				{categoryOptions && (
					<SelectInput
						pre=""
						value={subtype}
						options={categoryOptions}
						changeHandler={(val: string) => changeSubtype(val)}
					/>
				)}
				{subCategoryOptions ? (
					subCategoryOptions[subtype as string] && (
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
					)
				) : null}
			</p>
			<p>
				<Row justify="center">
					{childTab === PM_TAB || childTab === NPS_TAB || childTab === CRYPTO_TAB ? null : (
						<TextInput pre={'Name'} value={name} changeHandler={changeName} size={'middle'} width={250} />
					)}

					{childTab === PM_TAB || childTab === NPS_TAB || childTab === CRYPTO_TAB ? (
						<QuantityWithRate quantity={quantity} onChange={changeQuantity} subtype={subtype} name={name} />
					) : (
						<NumberInput
							pre={'Amount'}
							min={0}
							max={10000}
							value={quantity}
							changeHandler={changeQuantity}
							currency={selectedCurrency}
							step={1}
							post={
								childTab === PPF_TAB ? (
									'(Annually)'
								) : (childTab === EPF_TAB || childTab === VPF_TAB) ? (
									'(Monthly)'
								) : (
									''
								)
							}
							noSlider
						/>
					)}
				</Row>
			</p>
			{ (childTab === ML_TAB || childTab === DEPO_TAB) &&
			<p>
				<DatePickerInput
					picker="month"
					title={'Start Date'}
					changeHandler={changePurchaseDate}
					defaultVal={purchaseDate}
					size={'middle'}
				/>&nbsp;&nbsp;
				<label>Duration</label><InputNumber onChange={changeDuration} value={duration}/>
			</p>}
			{(childTab === PPF_TAB || childTab === EPF_TAB || childTab === VPF_TAB || childTab === ML_TAB || childTab === DEPO_TAB) && (
				<p>
					<label>Rate</label>&nbsp;
					<InputNumber onChange={changeChg} min={1} max={50} value={chg} step={0.1} />
				</p>
			)}
			{childTab === VEHICLE_TAB && (
				<p>
					<DatePickerInput
						picker="month"
						title={'Purchase Date'}
						changeHandler={changePurchaseDate}
						defaultVal={purchaseDate}
						size={'middle'}
					/>
				</p>
			)}
			{ (activeTab === LOAN_TAB || activeTab === INS_TAB) && 
				<p>
				<SelectInput
					pre={'Installment Type'}
					value={chgF}
					options={{ 1: 'Yearly', 12: 'Monthly' }}
					changeHandler={changeYearly}
				/>
				&nbsp;
				<label>No. of installment</label>
				<InputNumber min={1} max={1000} value={amount} onChange={changeAmount} step={1} />
				</p> }
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
