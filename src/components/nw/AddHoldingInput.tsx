import { UserOutlined } from '@ant-design/icons';
import { Form, Row, Col } from 'antd';
import React, { useContext, useState } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import CascaderInput from '../form/CascaderInput';
import DateInput from '../form/DateInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { presentMonth, presentYear } from '../utils';
import Interest from './Interest';
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from './NWContext';
import {
	getDefaultMember,
	getFamilyOptions,
	hasDate,
	hasName,
	hasOnlyEnddate,
	hasPF,
	hasQtyWithRate,
	hasRate,
	hasOnlyCategory,
	isRangePicker
} from './nwutils';
import QuantityWithRate from './QuantityWithRate';
import { calculateAddYears } from './valuationutils';
interface AddHoldingInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	fields: any;
}
export default function AddHoldingInput({ setInput, disableOk, categoryOptions, fields }: AddHoldingInputProps) {
	const { allFamily, childTab, selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS, OTHER, P2P } = TAB;
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ category, setCategory ] = useState<string>(categoryOptions ? categoryOptions[0].value : '');
	const [ subCat, setSubCat ] = useState<string>(
		categoryOptions && !hasOnlyCategory(childTab)
			? categoryOptions[0].children[0].value
			: (category === "NBD" || childTab === P2P) ? '0' : ''
	);
	const [ name, setName ] = useState<string>('');
	const [ qty, setQty ] = useState<number>(0);
	const [ rate, setRate ] = useState<number>(0);
	const [ sm, setSm ] = useState<number>(4);
	const [ em, setEm ] = useState<number>(3);
	const [ sy, setSy ] = useState<number>(childTab === VEHICLE ? presentYear - 5 : presentYear + 1);
	const [ ey, setEy ] = useState<number>(presentYear);
	const [ duration, setDuration ] = useState<number>(5);
	const [ amt, setAmt ] = useState<number>(0);

	const getNewRec = () => {
		let newRec: HoldingInput = {
			id: '',
			qty: 0,
			fId: '',
			curr: selectedCurrency
		};
		switch (childTab) {
			case INS:
				newRec.chg = category !== 'L' ? rate : 0;
				newRec.chgF = Number(subCat);
				newRec.subt = category;
				newRec.sm = presentMonth;
				newRec.sy = presentYear;
				newRec.em = category !== 'H' ? sm : 0;
				newRec.ey = category !== 'H' ? sy : 0;
				break;
			case LOAN:
				newRec.chg = rate;
				newRec.chgF = 12;
				newRec.name = name;
				newRec.sm = presentMonth;
				newRec.sy = presentYear;
				newRec.em = sm;
				newRec.ey = sy;
				break;
			case LENT:
				newRec.type = AssetType.F;
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = category === "BD" ? 4 : category === NATIONAL_SAVINGS_CERTIFICATE ? 1 : Number(subCat);
				newRec.name = name;
				break;
			case P2P:
				newRec.type = AssetType.F;
				newRec.subt = AssetSubType.P2P;
				newRec.chg = rate;
				newRec.chgF = Number(subCat);
				newRec.name = name;
				break;
			case NPS:
				newRec.subt = category;
				newRec.name = subCat;
				break;
			case PF:
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = 1;
				newRec.type = AssetType.F;
				newRec.sm = presentMonth;
				newRec.sy = presentYear;
				break;
			case VEHICLE:
				newRec.chg = 15;
				newRec.chgF = 1;
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.sm = sm;
				newRec.sy = sy;
				newRec.name = name;
				break;
			case PM:
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.name = subCat;
				break;
			case CRYPTO:
				newRec.type = AssetType.A;
				newRec.subt = AssetSubType.C;
				newRec.name = category;
				break;
			case OTHER:
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.name = name;
				break;
			default:
				newRec.name = name;
				break;
  }
		if (childTab === LENT || childTab === P2P) {
			subCat === '0' ? (newRec.sm = presentMonth) : (newRec.sm = sm);
			subCat === '0' ? (newRec.sy = presentYear) : (newRec.sy = sy);
			if (category === NATIONAL_SAVINGS_CERTIFICATE) {
				const { year, month } = calculateAddYears(newRec.sm as number, newRec.sy as number, duration);
				newRec.em = month;
				newRec.ey = year;
			} else if (subCat === '0') {
				newRec.em = sm;
				newRec.ey = sy;
			} else {
				newRec.em = em;
				newRec.ey = ey;
			}
		}
		if (childTab === PM || childTab === CRYPTO) {
			newRec.curr = 'USD';
		}
		newRec.fId = memberKey;
		newRec.amt = amt;
		newRec.qty = qty;
		return newRec;
	};
	const changeStartMonth = (val: number) => {
		setSm(val);
		let rec = getNewRec();
		hasOnlyEnddate(childTab, subCat) ? (category === 'H' ? (rec.em = 0) : (rec.em = val)) : (rec.sm = val);
		setInput(rec);
	};
	const changeStartYear = (val: number) => {
		setSy(val);
		let rec = getNewRec();
		hasOnlyEnddate(childTab, subCat) ? (category === 'H' ? (rec.ey = 0) : (rec.ey = val)) : (rec.sy = val);
		setInput(rec);
	};
	const changeEndMonth = (val: number) => {
		setEm(val);
		let rec = getNewRec();
		rec.em = val;
		setInput(rec);
	};
	const changeEndYear = (val: number) => {
		setEy(val);
		let rec = getNewRec();
		rec.ey = val;
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
		setAmt(amt);
		disableOk(amt <= 0);
		let rec = getNewRec();
		rec.amt = amt;
		setInput(rec);
	};

	const changeCategory = (value: any) => {
		setCategory(value);
		let rec = getNewRec();
		rec.subt === AssetSubType.C ? (rec.name = value) : (rec.subt = value);
		return rec;
	};

	const changeSubCat = (value: any) => {
		setSubCat(value);
		let rec = getNewRec();
		childTab === INS ? (rec.chgF = Number(value)) : (rec.name = value);
		setInput(rec);
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		let rec = getNewRec();
		rec.fId = key;
		setInput(rec);
	};

	const changeInterest = (value: string) => {
		setSubCat(value);
		let rec = getNewRec();
		rec.chgF = Number(value);
		setInput(rec);
	};

	const { Item: FormItem } = Form;

	return (
		<Form layout="vertical">
			<Row gutter={[ { xs: 0, sm: 0, md: 35 }, { xs: 15, sm: 15, md: 15 } ]}>
      {categoryOptions && (<Col xs={24} md={12}>
					<FormItem label={fields.type}>
            <Col>
              <CascaderInput
                pre={''}
                parentValue={category}
                parentChangeHandler={changeCategory}
                childChangeHandler={hasOnlyCategory(childTab) ? '' : changeSubCat}
                childValue={hasOnlyCategory(childTab) ? '' : subCat}
                options={categoryOptions}
              />
            </Col>
					</FormItem>
				</Col>)}
        {(category === 'NBD' || childTab === P2P) && (
					<Col xs={24} md={12}>
						<FormItem label={childTab === P2P ? fields.type : fields.subtype}>
              <Interest value={subCat} onChange={changeInterest} />
						</FormItem>
					</Col>
				)}
				{hasName(childTab) && (
					<Col xs={24} md={12}>
						<FormItem label={fields.name}>
							<TextInput pre="" value={name} changeHandler={changeName} size={'middle'} />
						</FormItem>
					</Col>
				)}
				{hasQtyWithRate(childTab) ? (
					<Col xs={24} md={12}>
						<FormItem label={fields.qty}>
							<QuantityWithRate quantity={qty} onChange={changeQty} subtype={category} name={subCat} />
						</FormItem>
					</Col>
				) : (
					<Col xs={24} md={12}>
						<FormItem label={fields.amount}>
							<NumberInput pre="" value={amt} changeHandler={changeAmt} currency={selectedCurrency} min={1}/>
						</FormItem>
					</Col>
				)}
				{hasPF(childTab) && (
					<Col xs={24} md={12}>
						<FormItem label={fields.qty}>
							<NumberInput pre="" value={qty} changeHandler={changeQty} currency={selectedCurrency} />
						</FormItem>
					</Col>
				)}
				{hasDate(childTab) &&
				category !== 'H' && (
					<Col xs={24} md={12}>
						<FormItem label={fields.date}>
							<Row gutter={[ 10, 0 ]}>
								<Col>
									<DateInput
										title={''}
										startMonthHandler={changeStartMonth}
										startYearHandler={changeStartYear}
										endMonthHandler={
											isRangePicker(childTab, category, subCat) ? changeEndMonth : undefined
										}
										endYearHandler={
											isRangePicker(childTab, category, subCat) ? changeEndYear : undefined
										}
										startMonthValue={sm}
										endMonthValue={em}
										startYearValue={sy}
										endYearValue={ey}
										size="middle"
									/>
								</Col>
							</Row>
						</FormItem>
					</Col>
				)}
				{category === NATIONAL_SAVINGS_CERTIFICATE && (
					<Col xs={24} md={12}>
						<FormItem label={fields.duration}>
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
				{(hasRate(childTab) || (category !== 'L' && childTab === INS)) && (
					<Col xs={24} md={12}>
						<FormItem label={fields.rate}>
							<NumberInput
								pre={''}
								min={0}
								max={50}
								value={rate}
								changeHandler={changeRate}
								step={0.1}
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
