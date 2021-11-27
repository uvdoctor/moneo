import { UserOutlined } from '@ant-design/icons';
import { InputNumber, Row } from 'antd';
import React, { useContext, useState } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
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
	const { PM, CRYPTO, DEPO, ML, NPS, PPF, EPF, VPF, VEHICLE, LOAN, INS, OTHER } = TAB;
	const [ category, setCategory ] = useState<string>(categoryOptions ? Object.keys(categoryOptions)[0] : '');
	const [ subCat, setSubCat ] = useState<string>(childTab === ML || childTab === DEPO ? '' : subCategoryOptions ? Object.keys(subCategoryOptions[category])[0] : '1');
	const [ name, setName ] = useState<string>('');
	const [ qty, setQty ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ rate, setRate ] = useState<number>(0);
	const [ date, setDate ] = useState<string>(`${new Date().getFullYear() - 5}-4`);
	const [ duration, setDuration ] = useState<number>(12);

	const getNewRec = () => {
		let newRec: HoldingInput = { id: '', qty: 0, fId: '' };
		const pur = { amt: qty, 
					  month: Number(date.slice(date.indexOf('-') + 1)),
					  year: Number(date.slice(0, date.indexOf('-'))), 
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
			case DEPO:
			case ML:
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
			case PPF:
			case EPF:
			case VPF:
				newRec.qty = qty;
				newRec.chg = rate;
				newRec.chgF = childTab === PPF ? Number(category) : 12;
				newRec.type = AssetType.F;
				newRec.subt = childTab;
				newRec.name = name;
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
		}
		if (childTab === INS) newRec.subt = category;	
		childTab === PM || childTab === CRYPTO ? (newRec.curr = 'USD') : (newRec.curr = selectedCurrency);
		newRec.fId = memberKey;
		return newRec;
	};

	const changeDate = (val: any) => {
		setDate(val);
		let rec = getNewRec();
		if (rec.pur) {
			rec.pur[0].year = Number(val.slice(0, val.indexOf('-')));
			rec.pur[0].month = Number(val.slice(val.indexOf('-') + 1));
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
		(childTab === ML || childTab === DEPO) ? rec.chgF = Number(subCat) : rec.name = val;
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

	const hasRate = (childTab: string) => [PPF, VPF, EPF, ML, DEPO, LOAN].includes(childTab);

	const hasName = (childTab: string) => ![PM, NPS, CRYPTO, INS].includes(childTab);

	const hasQtyWithRate = (childTab: string) => [PM, NPS, CRYPTO].includes(childTab);

	const hasDuration = (childTab: string) => [ML, DEPO, LOAN, INS].includes(childTab);

	const hasDate = (childTab: string) => [ML, DEPO, VEHICLE, LOAN, INS].includes(childTab);

	return (
		<div>
			<p>
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
				{/* <Row justify="center"> */}
					{hasQtyWithRate(childTab) 
						? <QuantityWithRate quantity={qty} onChange={changeQty} subtype={category} name={subCat}/>
						: <NumberInput 
							pre={'Amount'} 
							min={0} 
							max={10000} 
							value={qty} 
							changeHandler={changeQty}
							currency={selectedCurrency} 
							step={1} 
							noSlider/>
						}
					{/* </Row> */}
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
