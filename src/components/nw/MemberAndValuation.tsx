import { Button, Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import { AppContext } from '../AppContext';
import SelectInput from '../form/selectinput';
import { toHumanFriendlyCurrency } from '../utils';
import { NWContext, TAB } from './NWContext';
import { getFamilyOptions } from './nwutils';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import {
	calculateCompundingIncome,
	calculateCrypto,
	calculateNPS,
	calculateNPVAmt,
	calculatePM,
	calculateProvidentFund,
	calculateVehicle
} from './valuationutils';

interface MemberAndValuationProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
	index: number;
}

export default function MemberAndValuation({ data, record, changeData, index }: MemberAndValuationProps) {
	const { childTab, npsData, selectedCurrency, allFamily }: any = useContext(NWContext);
	const { ratesData }: any = useContext(AppContext);
	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS } = TAB;
	const [ valuation, setValuation ] = useState<number>(0);

	const changeOwner = (ownerKey: string, i: number) => {
		data[i].fId = ownerKey;
		changeData([ ...data ]);
	};

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

	const removeHolding = (i: number) => {
		data.splice(i, 1);
		changeData([ ...data ]);
	};

	return (
		<Row justify="start">
			<Col>
				<Row>
					<SelectInput
						pre={<UserOutlined />}
						value={record.fId ? record.fId : ''}
						options={getFamilyOptions(allFamily)}
						changeHandler={(key: string) => changeOwner(key, index)}
					/>
				</Row>
				<Row>
					<Col>
						<label>{toHumanFriendlyCurrency(valuation, selectedCurrency)}</label>
					</Col>
					<Col>
						<Button type="link" onClick={() => removeHolding(index)} danger>
							<DeleteOutlined />
						</Button>
					</Col>
				</Row>
			</Col>
		</Row>
	);
}

// export default function ViewHoldingInput({
// 	data,
// 	changeData,
// 	categoryOptions,
// 	subCategoryOptions,
// 	record
// }: ViewHoldingInputProps) {
// 	const { childTab, npsData, selectedCurrency }: any = useContext(NWContext);
// 	const { ratesData }: any = useContext(AppContext);
// 	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS } = TAB;
// 	const [ duration, setDuration ] = useState<number>(
// 		calculateDifferenceInYears(record.em as number, record.ey as number, record.sm as number, record.sy as number)
// 	);
// 	const [ valuation, setValuation ] = useState<number>(0);

// 	const changeDuration = (val: number) => {
// 		setDuration(val);
// 		const { year, month } = calculateAddYears(record.sm as number, record.sy as number, duration);
// 		record.em = month;
// 		record.ey = year;
// 		changeData([ ...data ]);
// 	};

// 	const changeEnddate = (val: any) => {
// 		record.ey = Number(val.substring(val.length - 4));
// 		record.em = getMonthIndex(val.substring(0, 3));
// 		changeData([ ...data ]);
// 	};

// 	const changeStartdate = (val: string) => {
// 		record.sy = Number(val.substring(val.length - 4));
// 		record.sm = getMonthIndex(val.substring(0, 3));
// 		changeData([ ...data ]);
// 	};

// 	const changeName = (val: any) => {
// 		record.name = val;
// 		changeData([ ...data ]);
// 	};


// 	const hasRate = (childTab: string) => [ PF, LENT ].includes(childTab);

// 	const hasRangePicker = (childTab: string) => [ LENT, LOAN, INS ].includes(childTab);

// 	const hasName = (childTab: string) => ![ PM, NPS, CRYPTO, INS ].includes(childTab);

// 	const hasQtyWithRate = (childTab: string) => [ PM, NPS, CRYPTO ].includes(childTab);

// 	const hasDate = (childTab: string) => [ VEHICLE, LENT, LOAN, INS ].includes(childTab);

// 	const hasPF = (childTab: string) => [ PF ].includes(childTab);

// 			)}
// 			{hasName(childTab) && (
// 				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
// 					<Row align="middle" gutter={[5, 0]}>
// 						<Col>Label</Col>
// 						<Col>
// 							<TextInput
// 								pre=""
// 								changeHandler={(val: string) => changeName(val)}
// 								value={record.name as string}
// 								size={"middle"}
// 								width={200}
// 							/>
// 						</Col>
// 					</Row>
// 				</Col>
// 			)}
// 			{(hasRate(childTab) || (childTab === INS && record.subt !== "L")) && (
// 				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
// 				<Row align="middle" gutter={[5, 0]}>
// 				<Col>Rate</Col>
// 				<Col>
// 					<NumberInput
// 						isBasic={true}
// 						pre=""
// 						min={0}
// 						max={50}
// 						value={record.chg as number}
// 						changeHandler={(val: number) =>changeChg(val)}
// 						step={0.1}
// 						noSlider
// 						unit="%"
// 					/>
// 				</Col>
// 				</Row>
// 				</Col>
// 			)}
// 			{hasDate(childTab) && (
// 				<>
// 					<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
// 						<DatePickerInput
// 							isRangePicker={hasRangePicker(childTab) && record.subt !== NATIONAL_SAVINGS_CERTIFICATE}
// 							picker="month"
// 							title="Date "
// 							changeHandler={(val: string) => changeStartdate(val)}
// 							value={record.sm && record.sy && `${getMonthName(record.sm as number, true)}-${
// 								record.sy
// 							}`}
// 							enddate={record.em && record.ey && `${getMonthName(record.em as number, true)}-${
// 								record.ey
// 							}`}
// 							setEnddate={(val: string) => changeEnddate(val)}
// 							size={"middle"}
// 						/>
// 					</Col>
// 					{record.subt === NATIONAL_SAVINGS_CERTIFICATE && (
// 						<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
// 							<Row align="middle" gutter={[5, 0]}>
// 								<Col>Duration</Col>
// 								<Col>
// 									<SelectInput 
// 										pre={''} 
// 										value={duration} 
// 										changeHandler={(val: number)=>changeDuration(val)} 	
// 										options={{5: "Five Years", 10: "Ten Years" }}/>
// 								</Col>
// 							</Row>
// 						</Col>
// 					)}
// 				</>
// 			)}
