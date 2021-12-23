import { UserOutlined } from '@ant-design/icons';
import { Form, Row, Col } from 'antd';
import React, { useContext, useState } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { calculateAddYears, getMonthIndex } from '../utils';
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from './NWContext';
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
	const [ subCat, setSubCat ] = useState<string>(
		subCategoryOptions && subCategoryOptions[category] ? Object.keys(subCategoryOptions[category])[0] : ''
	);
	const [ name, setName ] = useState<string>('');
	const [ qty, setQty ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ rate, setRate ] = useState<number>(0);
	const [ startdate, setStartdate ] = useState<string>(`Apr-${new Date().getFullYear() - 2}`);
	const [ enddate, setEnddate ] = useState<any>(`Mar-${new Date().getFullYear() + 1}`);
	const [ duration, setDuration ] = useState<number>(5);

	const hasRate = (childTab: string) => [ PF, LENT, LOAN ].includes(childTab);

	const hasName = (childTab: string) => ![ PM, NPS, CRYPTO, INS ].includes(childTab);

	const hasQtyWithRate = (childTab: string) => [ PM, NPS, CRYPTO ].includes(childTab);

	const hasRangePicker = (childTab: string) => [ LENT, LOAN, INS ].includes(childTab);

	const hasDate = (childTab: string) => [ VEHICLE, LENT, LOAN, INS ].includes(childTab);

	const hasPF = (childTab: string) => [ PF ].includes(childTab);

	const getNewRec = () => {
		let newRec: HoldingInput = { id: '', qty: 0, fId: '', curr: selectedCurrency };
		const today = new Date();
		switch (childTab) {
			case INS:
				newRec.chg = category === 'H' ? rate : 0;
				newRec.chgF = Number(subCat);
				break;
			case LOAN:
				newRec.chg = rate;
				newRec.chgF = 12;
				newRec.name = name;
				break;
			case LENT:
				newRec.type = AssetType.F;
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = Number(subCat);
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
				newRec.sm = today.getMonth() + 1;
				newRec.sy = today.getFullYear();
				break;
			case VEHICLE:
				newRec.chg = 15;
				newRec.chgF = 1;
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.sm = getMonthIndex(startdate.substring(0, 3));
				newRec.sy = Number(startdate.substring(startdate.length - 4));
				newRec.name = name;
				break;
			case PM:
				newRec.qty = qty;
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.name = subCat;
				break;
			case CRYPTO:
				newRec.qty = qty;
				newRec.type = AssetType.A;
				newRec.subt = AssetSubType.C;
				newRec.name = category;
				break;
			case OTHER:
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.name = name;
				newRec.qty = qty;
				break;
			default:
				newRec.name = name;
				newRec.qty = qty;
				break;
		}
		if (hasRangePicker(childTab)) {
			newRec.sm = getMonthIndex(startdate.substring(0, 3));
			newRec.sy = Number(startdate.substring(startdate.length - 4));
			if (category === NATIONAL_SAVINGS_CERTIFICATE) {
				const { year, month } = calculateAddYears(newRec.sm as number, newRec.sy as number, duration);
				newRec.em = month;
				newRec.ey = year;
			} else {
				newRec.em = getMonthIndex(enddate.substring(0, 3));
				newRec.ey = Number(enddate.substring(enddate.length - 4));
			}
		}
		if (childTab === INS) {
			newRec.subt = category;
		}
		if (childTab === PM || childTab === CRYPTO) {
			newRec.curr = 'USD';
		}
		newRec.fId = memberKey;
		return newRec;
	};

	const changeStartdate = (val: any) => {
		setStartdate(val);
		let rec = getNewRec();
		rec.sm = getMonthIndex(val.substring(0, 3));
		rec.sy = Number(val.substring(val.length - 4));
		setInput(rec);
	};

	const changeEnddate = (val: any) => {
		setEnddate(val);
		disableOk(val <= 0);
		let rec = getNewRec();
		rec.em = getMonthIndex(val.substring(0, 3));
		rec.ey = Number(val.substring(val.length - 4));
		setInput(rec);
	};

	const changeDuration = (val: number) => {
		setDuration(val);
		let rec = getNewRec();
		const { year, month } = calculateAddYears(rec.sm as number, rec.sy as number, duration);
		rec.em = month;
		rec.ey = year;
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
		childTab === LENT || childTab === INS ? (rec.chgF = Number(subCat)) : (rec.name = val);
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

	const changeAmt = (amt: number) => {
		setQty(amt);
		disableOk(amt <= 0);
		let rec = getNewRec();
		rec.amt = amt;
		setInput(rec);
	};

	const changeCategory = (subtype: string) => {
		setCategory(subtype);
		if (subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (opts && Object.keys(opts).length && !opts[subCat]) {
				setSubCat(Object.keys(opts)[0]);
			}
		}
		let rec = getNewRec();
		if(rec.subt === AssetSubType.C) rec.name = subtype;
		else rec.subt = subtype;
		return rec;
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		let rec = getNewRec();
		rec.fId = key;
		setInput(rec);
	};

	const { Item: FormItem } = Form;

	return (
		<Form layout="vertical">
			<Row gutter={[ { xs: 0, sm: 0, md: 35 }, { xs: 15, sm: 15, md: 15 } ]}>
				{categoryOptions && (
					<Col xs={24} md={12}>
						<FormItem label="Type">
							<Row gutter={[ 10, 0 ]}>
								<Col>
									{categoryOptions && (
										<SelectInput
											pre=""
											value={category}
											options={categoryOptions}
											changeHandler={(val: string) => changeCategory(val)}
										/>
									)}
								</Col>
								<Col>
									{subCategoryOptions &&
									subCategoryOptions[category as string] && (
										<SelectInput
											pre=""
											value={subCat as string}
											options={subCategoryOptions[category as string]}
											changeHandler={(val: string) => changeSubCat(val)}
											post={category === AssetSubType.Gold ? 'karat' : ''}
										/>
									)}
								</Col>
								<Col>
									{childTab === INS && (
										<SelectInput
											pre={''}
											options={{ 1: 'Yearly', 12: 'Monthly' }}
											value={subCat as string}
											changeHandler={(val: string) => changeSubCat(val)}
										/>
									)}
								</Col>
							</Row>
						</FormItem>
					</Col>
				)}
				{hasName(childTab) && (
					<Col xs={24} md={12}>
						<FormItem label="Label">
							<TextInput pre="" value={name} changeHandler={changeName} size={'middle'} width={250} />
						</FormItem>
					</Col>
				)}
				{hasQtyWithRate(childTab) ? (
					<Col xs={24} md={12}>
						<FormItem label="Qty">
							<QuantityWithRate quantity={qty} onChange={changeQty} subtype={category} name={subCat} />
						</FormItem>
					</Col>
				) : (
					<Col xs={24} md={12}>
						<FormItem label={hasPF(childTab) ? 'Contribution per year' : 'Amount'}>
							<NumberInput
								isBasic
								pre=""
								value={qty}
								changeHandler={changeAmt}
								currency={selectedCurrency}
							/>
						</FormItem>
					</Col>
				)}
				{hasDate(childTab) && (
					<Col xs={24} md={12}>
						<FormItem label={'Date'}>
							<Row gutter={[ 10, 0 ]}>
								<Col>
									<DatePickerInput
										isRangePicker={
											hasRangePicker(childTab) && category !== NATIONAL_SAVINGS_CERTIFICATE
										}
										title={''}
										picker="month"
										value={startdate}
										changeHandler={changeStartdate}
										setEnddate={hasRangePicker(childTab) && changeEnddate}
										enddate={hasRangePicker(childTab) && enddate}
										size="middle"
									/>
								</Col>
							</Row>
						</FormItem>
					</Col>
				)}
				{category === NATIONAL_SAVINGS_CERTIFICATE && (
					<Col xs={24} md={12}>
						<FormItem label={'Duration'}>
							<Row gutter={[ 10, 0 ]}>
								<Col>
									<SelectInput
										pre={''}
										value={duration}
										options={{
											5: 'Five Years',
											10: 'Ten Years'
										}}
										changeHandler={(val: number) => changeDuration(val)}
									/>
								</Col>
							</Row>
						</FormItem>
					</Col>
				)}
				{(hasRate(childTab) || (category === 'H' && childTab === INS)) && (
					<Col xs={24} md={12}>
						<FormItem label="Rate">
							<NumberInput
								isBasic={true}
								pre={''}
								min={0}
								max={50}
								value={rate}
								changeHandler={changeRate}
								step={0.1}
								noSlider
								unit="%"
							/>
						</FormItem>
					</Col>
				)}
				<Col xs={24} md={12}>
					<FormItem label="">
						<SelectInput
							pre={<UserOutlined />}
							value={memberKey}
							options={getFamilyOptions(allFamily)}
							changeHandler={(key: string) => changeMember(key)}
						/>
					</FormItem>
				</Col>
			</Row>
		</Form>
	);
}
