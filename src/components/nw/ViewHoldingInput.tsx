import { Row, Col } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import { AppContext } from '../AppContext';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { getMonthIndex, getMonthName, toHumanFriendlyCurrency } from '../utils';
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from './NWContext';
import QuantityWithRate from './QuantityWithRate';
import {
	calculateAddYears,
	calculateCompundingIncome,
	calculateCrypto,
	calculateDifferenceInYears,
	calculateNPS,
	calculateNPVAmt,
	calculatePM,
	calculateProvidentFund,
	calculateVehicle
} from './valuationutils';

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
	const { childTab, npsData, selectedCurrency }: any = useContext(NWContext);
	const { ratesData }: any = useContext(AppContext);
	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS } = TAB;
	const [ duration, setDuration ] = useState<number>(
		calculateDifferenceInYears(record.em as number, record.ey as number, record.sm as number, record.sy as number)
	);
	const [ valuation, setValuation ] = useState<number>(0);

	const changeDuration = (val: number) => {
		setDuration(val);
		const { year, month } = calculateAddYears(record.sm as number, record.sy as number, duration);
		record.em = month;
		record.ey = year;
		changeData([ ...data ]);
	};

	const changeEnddate = (val: any) => {
		record.ey = Number(val.substring(val.length - 4));
		record.em = getMonthIndex(val.substring(0, 3));
		changeData([ ...data ]);
	};

	const changeStartdate = (val: string) => {
		record.sy = Number(val.substring(val.length - 4));
		record.sm = getMonthIndex(val.substring(0, 3));
		changeData([ ...data ]);
	};

	const changeName = (val: any) => {
		record.name = val;
		changeData([ ...data ]);
	};

	const changeAmt = (amt: number) => {
		record.amt = amt;
		if (hasPF(childTab)) {
			record.sm = new Date().getMonth() + 1;
			record.sy = new Date().getFullYear();
		}
		changeData([ ...data ]);
	};

	const changeQty = (qty: number) => {
		record.qty = qty;
		if (hasPF(childTab)) {
			record.sm = new Date().getMonth() + 1;
			record.sy = new Date().getFullYear();
		}
		changeData([ ...data ]);
	};

	const changeChg = (chg: number) => {
		record.chg = chg;
		changeData([ ...data ]);
	};

	const changeCategory = (subtype: string) => {
		if (childTab === CRYPTO) record.name = subtype;
		else record.subt = subtype;
		if (subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (!opts) return changeData([ ...data ]);
			if (childTab === LENT) {
				if (!opts[record.chgF as number]) record.chgF = Number(Object.keys(opts)[0]);
			} else {
				if (!opts[record.name as string]) record.name = Object.keys(opts)[0];
			}
		}
		changeData([ ...data ]);
	};

	const changeSubCategory = (val: string) => {
		childTab === LENT || childTab === INS ? (record.chgF = Number(val)) : (record.name = val);
		changeData([ ...data ]);
	};

	const hasRate = (childTab: string) => [ PF, LENT ].includes(childTab);

	const hasRangePicker = (childTab: string) => [ LENT, LOAN, INS ].includes(childTab);

	const hasName = (childTab: string) => ![ PM, NPS, CRYPTO, INS ].includes(childTab);

	const hasQtyWithRate = (childTab: string) => [ PM, NPS, CRYPTO ].includes(childTab);

	const hasDate = (childTab: string) => [ VEHICLE, LENT, LOAN, INS ].includes(childTab);

	const hasPF = (childTab: string) => [ PF ].includes(childTab);

	const calculateValuation = (childTab: string) => {
		let value = 0;
		switch (childTab) {
			case INS:
			case LOAN:
				value = calculateNPVAmt(record);
				break;
			case CRYPTO:
				value = calculateCrypto(record, ratesData, selectedCurrency);
				break;
			case PM:
				value = calculatePM(record, ratesData, selectedCurrency);
				break;
			case LENT:
				value = calculateCompundingIncome(record);
				break;
			case NPS:
				const result = calculateNPS(record, npsData);
				value = result.value;
				break;
			case VEHICLE:
				value = calculateVehicle(record);
				break;
			case PF:
				value = calculateProvidentFund(record);
			default:
				value = record.amt as number;
				break;
		}
		return value;
	};

	useEffect(
		() => {
			const amount = calculateValuation(childTab);
			setValuation(amount);
		},
		[ childTab, data, record ]
	);

	return (
		<Fragment>
			{categoryOptions && (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
					<SelectInput
						pre=""
						value={record.subt as string}
						options={categoryOptions}
						changeHandler={(val: string) => changeCategory(val)}
					/>
					{subCategoryOptions
						? subCategoryOptions[record.subt as string] && (
								<SelectInput
									pre=""
									value={
										(childTab === LENT || childTab === INS) 
											? (record.chgF as number)
											: (record.name as string)
									}
									options={subCategoryOptions[record.subt as string]}
									changeHandler={(val: string) => changeSubCategory(val)}
									post={record.subt === AssetSubType.Gold ? "karat" : ""}
								/>
						  )
						: null}
				</Col>
			)}
			{hasName(childTab) && (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
					<Row align="middle" gutter={[5, 0]}>
						<Col>Label</Col>
						<Col>
							<TextInput
								pre=""
								changeHandler={(val: string) => changeName(val)}
								value={record.name as string}
								size={"middle"}
								width={200}
							/>
						</Col>
					</Row>
				</Col>
			)}
			{hasQtyWithRate(childTab) ? (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
					<QuantityWithRate
						quantity={record.qty}
						name={record.name as string}
						subtype={record.subt as string}
						onChange={(val: number) => changeQty(val)}
					/>
				</Col>
			) : (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
					<Row align="middle" gutter={[5, 0]}>
						<Col>Amount</Col>
						<Col>
							<NumberInput
								isBasic={true}
								pre=""
								min={10}
								max={100000000}
								value={record.amt as number}
								changeHandler={(val: number) => changeAmt(val)}
								currency={record.curr as string}
								step={1}
								noSlider
							/>
						</Col>
					</Row>
				</Col>
			)}
			{hasPF(childTab) && (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
				<Row align="middle" gutter={[5, 0]}>
					<Col>Contribution per year</Col>
					<Col>
						<NumberInput
							isBasic={true}
							pre=""
							min={10}
							max={100000000}
							value={record.qty as number}
							changeHandler={(val: number) => changeQty(val)}
							currency={record.curr as string}
							step={1}
							noSlider
						/>
					</Col>
				</Row>
			</Col>
				)}
			{(hasRate(childTab) || (childTab === INS && record.subt !== "L")) && (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
				<Row align="middle" gutter={[5, 0]}>
				<Col>Rate</Col>
				<Col>
					<NumberInput
						isBasic={true}
						pre=""
						min={0}
						max={50}
						value={record.chg as number}
						changeHandler={(val: number) =>changeChg(val)}
						step={0.1}
						noSlider
						unit="%"
					/>
				</Col>
				</Row>
				</Col>
			)}
			{hasDate(childTab) && (
				<>
					<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
						<DatePickerInput
							isRangePicker={hasRangePicker(childTab) && record.subt !== NATIONAL_SAVINGS_CERTIFICATE}
							picker="month"
							title="Date "
							changeHandler={(val: string) => changeStartdate(val)}
							value={record.sm && record.sy && `${getMonthName(record.sm as number, true)}-${
								record.sy
							}`}
							enddate={record.em && record.ey && `${getMonthName(record.em as number, true)}-${
								record.ey
							}`}
							setEnddate={(val: string) => changeEnddate(val)}
							size={"middle"}
						/>
					</Col>
					{record.subt === NATIONAL_SAVINGS_CERTIFICATE && (
						<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
							<Row align="middle" gutter={[5, 0]}>
								<Col>Duration</Col>
								<Col>
									<SelectInput 
										pre={''} 
										value={duration} 
										changeHandler={(val: number)=>changeDuration(val)} 	
										options={{5: "Five Years", 10: "Ten Years" }}/>
								</Col>
							</Row>
						</Col>
					)}
				</>
			)}
			<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
				<Row align="middle" gutter={[ 5, 0 ]}>
					<Col>Valuation</Col>
					<Col>
						<label>{toHumanFriendlyCurrency(valuation, selectedCurrency)}</label>
					</Col>
				</Row>
			</Col>
		</Fragment>
	);
}
