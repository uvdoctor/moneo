import { UserOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import React, { useContext, useState } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { getMonthIndex } from '../utils';
import { NWContext, TAB } from './NWContext';
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
	subCategoryOptions
}: AddHoldingInputProps) {
	const { allFamily, childTab, selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS, OTHER } = TAB;
	const [ category, setCategory ] = useState<string>(categoryOptions ? Object.keys(categoryOptions)[0] : '');
	const [ subCat, setSubCat ] = useState<string>(childTab === LENT ? '' : subCategoryOptions ? Object.keys(subCategoryOptions[category])[0] : '1');
	const [ name, setName ] = useState<string>('');
	const [ qty, setQty ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ rate, setRate ] = useState<number>(0);
	const [ date, setDate ] = useState<string>('');
	const [ duration, setDuration ] = useState<number>(12);
	const [ type, setType ] = useState<string>('D');

	const getNewRec = () => {
		let newRec: HoldingInput = { id: '', qty: 0, fId: '' };
		const today = new Date();
		const pur = { amt: qty, 
					  month: getMonthIndex(date.substring(0, 3)),
					  year: Number(date.substring(date.length-4)), 
					  qty: childTab === VEHICLE ? 1 : duration };

		switch (childTab) {
			case INS:
				newRec.chg = 10;
				newRec.chgF = Number(subCat);
				newRec.pur = [pur];
				break;
			case LOAN:
				newRec.chg = rate;
				newRec.chgF = 12;
				newRec.pur = [pur];
				newRec.name = name;
				break;
			case LENT:
				newRec.type = type;
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = category === 'No' ? 0 : Number(subCat);
				newRec.pur = [pur];
				newRec.name = name;
				break;
			case NPS:
				newRec.qty = qty;
				newRec.subt = category;
				newRec.name = subCat;
				break;
			case PF:
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = 1;
				newRec.type = AssetType.F;
				newRec.name = name;
				newRec.pur = [{ amt: qty, month: today.getMonth()+1, year: today.getFullYear(), qty: 1 }];
				break;
			case VEHICLE:
				newRec.chg = 15;
				newRec.chgF = 1;
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.pur = [pur];
				newRec.name = name;
				break;
			case PM:
			case CRYPTO:
				newRec.qty = qty;
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.name = subCat;
				break;
			case OTHER:
				newRec.subt = category;
				newRec.name = name;
				newRec.qty = qty;
			default:
				newRec.name = name;
				newRec.qty = qty;
				break;
		}
		if (childTab === INS) newRec.subt = category;	
		childTab === PM || childTab === CRYPTO ? (newRec.curr = 'USD') : (newRec.curr = selectedCurrency);
		newRec.fId = memberKey;
		return newRec;
	};

	const changeDate = (val: any) => {
		setDate(val);
		let rec = getNewRec();
		const month = getMonthIndex(val.substring(0, 3));
		if (rec.pur) {
			rec.pur[0].year = Number(val.substring(val.length-4));
			rec.pur[0].month = month;
		}
		setInput(rec);
	};

	const changeDuration = (val: number) => {
		setDuration(val);
		disableOk(val <= 0);
		let rec = getNewRec();
		if (rec.pur) rec.pur[0].qty = val;
		setInput(rec);
	};

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeSubCat = (val: string) => {
		setSubCat(val);
		let rec = getNewRec();
		(childTab === LENT || childTab === INS) ? rec.chgF = Number(subCat) : rec.name = val;
		setInput(rec);
	};

	const changeRate = (val: number) => {
		setRate(val);
		disableOk(val <= 0);
		let rec = getNewRec();
		rec.chg = val;
		setInput(rec);
	};

	const changeQty = (qty: number) => {
		setQty(qty);
		disableOk(qty <= 0);
		let rec = getNewRec();
		rec.qty = qty;
		setInput(rec);
	};

	const changeCategory = (subtype: string) => {
		setCategory(subtype);
		if (subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (opts && Object.keys(opts).length && !opts[subCat]) {
				let defaultVal: string = Object.keys(opts)[0];
				setSubCat(defaultVal); 
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

	const changeType = (val: string) => {
		setType(val);
		let rec = getNewRec();
		rec.type = type;
		setInput(rec);
	}

	const hasRate = (childTab: string) => [PF, LENT, LOAN].includes(childTab);

	const hasName = (childTab: string) => ![PM, NPS, CRYPTO, INS].includes(childTab);

	const hasQtyWithRate = (childTab: string) => [PM, NPS, CRYPTO].includes(childTab);

	const hasDuration = (childTab: string) => [LENT, LOAN, INS].includes(childTab);

	const hasDate = (childTab: string) => [LENT, VEHICLE, LOAN, INS].includes(childTab);

	const hasPF = (childTab: string) => [PF].includes(childTab);

	return (
		<div>
			<p>
				{childTab===LENT && 
					<SelectInput pre={''} 
					options={{D: 'Deposits', ML: 'Money Lendings', NSE: 'National Saving Certificate'}} 
					value={type as string} 
					changeHandler={(val: string) => changeType(val)}/>
				}&nbsp;
				{categoryOptions && (
					<SelectInput
						pre=""
						value={category}
						options={categoryOptions}
						changeHandler={(val: string) => changeCategory(val)}
					/>
				)}&nbsp;
				{subCategoryOptions && subCategoryOptions[category as string] && (
					<SelectInput
						pre=""
						value={subCat as string}
						options={subCategoryOptions[category as string]}
						changeHandler={(val: string) => changeSubCat(val)}
						post={category === AssetSubType.Gold ? 'karat' : ''}
					/>
				)}
				{childTab===INS && 
					<SelectInput pre={''} 
					options={{1: 'Yearly', 12: 'Monthly'}} 
					value={subCat as string} 
					changeHandler={(val: string) => changeSubCat(val)}/>
				}
			</p>
			<p>
				{hasName(childTab) && 
					<TextInput pre={'Name'} value={name} changeHandler={changeName} size={'middle'} width={250} />}
			</p>
			<p>
				{hasQtyWithRate(childTab) 
					? <QuantityWithRate quantity={qty} onChange={changeQty} subtype={category} name={subCat}/>
					: <NumberInput 
						pre={hasPF(childTab) ? 'Contribution per year' : 'Amount'} 
						min={0} 
						max={10000} 
						value={qty} 
						changeHandler={changeQty}
						currency={selectedCurrency} 
						step={1} 
						noSlider/>
					}
				</p>
			{hasDate(childTab) && <p>
				<DatePickerInput 
					picker="month" 
					title={'Date'} 
					changeHandler={changeDate} 
					defaultVal={date} 
					size={'middle'} />
				&nbsp;&nbsp;
				{hasDuration(childTab) && 
					<><label>Duration</label>
					<InputNumber onChange={changeDuration} value={duration} /></>}
			</p> }
			{hasRate(childTab) && <p>
				<label>Rate</label>&nbsp;
				<InputNumber onChange={changeRate} min={1} max={50} value={rate} step={0.1} />
			</p>}
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
