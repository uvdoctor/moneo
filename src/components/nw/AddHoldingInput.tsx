import { UserOutlined } from '@ant-design/icons';
import { InputNumber, Row } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
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
	const { allFamily, childTab, selectedMembers, selectedCurrency, activeTab }: any = useContext(NWContext);
	const { PM, CRYPTO, DEPO, ML, OTHER, NPS, PPF, EPF, VPF, VEHICLE, LOAN, INS } = TAB;
	const [ category, setCategory ] = useState<string>(categoryOptions ? Object.keys(categoryOptions)[0] : '');
	const [ name, setName ] = useState<string>(subCategoryOptions ? Object.keys(subCategoryOptions[category])[0] : '');
	const [ qty, setQty ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ rate, setRate ] = useState<number>(0);
	const [ date, setDate ] = useState<string>(`${new Date().getFullYear() - 5}-4`);
	const [ duration, setDuration ] = useState<number>(12);
	const [ frequency, setFrequency ] = useState<number>(1);

	const getNewRec = () => {
		let newRec: HoldingInput = { id: '', qty: 0, fId: '' };
		switch (childTab || activeTab) {
			case INS:
			case LOAN:
				newRec.chgF = Number(frequency);
				newRec.pur = [ { amt: duration, month: 1, year: 1, qty: 1 } ];
			case DEPO:
			case ML:
				newRec.chg = rate;
				newRec.chgF = Number(category);
			case NPS:
			case OTHER:
				newRec.subt = category;
			case PPF:
			case EPF:
			case VPF:
				newRec.chg = rate;
				newRec.chgF = childTab === PPF ? Number(category) : 12;
				newRec.type = AssetType.F;
				newRec.subt = childTab;
			case VEHICLE:
				newRec.chg = 15;
				newRec.chgF = 1;
				newRec.type = AssetType.A;
				newRec.subt = category;
			case PM:
			case CRYPTO:
				newRec.type = AssetType.A;
				newRec.subt = category;
			case ML:
			case DEPO:
			case VEHICLE:
				newRec.pur = [{ amt: qty, month: Number(date.slice(date.indexOf('-') + 1)),
					year: Number(date.slice(0, date.indexOf('-'))), qty: childTab === VEHICLE ? 1 : duration }]
			default:
				newRec.qty = childTab === VEHICLE ? 0 : qty;
				newRec.name = name;
				newRec.fId = memberKey;
				break;
		}
		if (activeTab === INS) newRec.subt = category;			
		childTab === PM || childTab === CRYPTO ? (newRec.curr = 'USD') : (newRec.curr = selectedCurrency);
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
		if (rec.pur) {
			childTab === LOAN || childTab === INS ? (rec.pur[0].amt = val) : (rec.pur[0].qty = val);
		}
		setInput(rec);
	};

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
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

	const changeFrequency = (val: number) => {
		setFrequency(val);
		let rec = getNewRec();
		rec.chgF = Number(frequency);
		setInput(rec);
	};

	const isLiability = (activeTab: string) => [LOAN, INS].includes(activeTab);

	const hasRate = (childTab: string) => [PPF, VPF, EPF, ML, DEPO].includes(childTab);

	const hasName = (childTab: string) => ![PM, NPS, CRYPTO].includes(childTab);

	const hasQtyWithRate = (childTab: string) => [PM, NPS, CRYPTO].includes(childTab);

	const hasDuration = (childTab: string) => [ML, DEPO].includes(childTab);

	const hasDate = (childTab: string) => [ML, DEPO, VEHICLE].includes(childTab);

	return (
		<div style={{ textAlign: 'center' }}>
			<p>
				{categoryOptions && (
					<SelectInput
						pre=""
						value={category}
						options={categoryOptions}
						changeHandler={(val: string) => changeCategory(val)}
					/>
				)}
				{subCategoryOptions && subCategoryOptions[category as string] && (
						<Fragment>
							&nbsp;
							<SelectInput
								pre=""
								value={name as string}
								options={subCategoryOptions[category as string]}
								changeHandler={(val: string) => changeName(val)}
								post={category === AssetSubType.Gold ? 'karat' : ''}
							/>
						</Fragment>
					)}
			</p>
			<p>
				<Row justify="center">
					{hasName(childTab) && <TextInput pre={'Name'} value={name} changeHandler={changeName} size={'middle'} width={250} />}
					{hasQtyWithRate(childTab) ? 
						<QuantityWithRate quantity={qty} onChange={changeQty} subtype={category} name={name}/>
					: <NumberInput pre={'Amount'} min={0} max={10000} value={qty} changeHandler={changeQty}
						currency={selectedCurrency} step={1} noSlider/>
					}
				</Row>
			</p>
			{ !activeTab && <p>
				{hasDate(childTab) &&
					<DatePickerInput picker="month" title={'Date'} changeHandler={changeDate}
							defaultVal={date} size={'middle'} />
				}&nbsp;&nbsp;
				{hasDuration(childTab) && 
					<><label>Duration</label><InputNumber onChange={changeDuration} value={duration} /></>
				}
			</p> }
			{hasRate(childTab) && <p>
				<label>Rate</label>&nbsp;
				<InputNumber onChange={changeRate} min={1} max={50} value={rate} step={0.1} />
			</p>}
			{isLiability(activeTab) && 
				<p>
					<SelectInput
						pre={'Installment Type'}
						value={frequency}
						options={{ 1: 'Yearly', 12: 'Monthly' }}
						changeHandler={changeFrequency}
					/>&nbsp;
					<label>No. of installment</label>
					<InputNumber min={1} max={1000} value={duration} onChange={changeDuration} step={1} />
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
	);
}
