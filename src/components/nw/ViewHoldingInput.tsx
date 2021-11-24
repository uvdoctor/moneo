import { Col, InputNumber } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { NWContext, TAB } from './NWContext';
import QuantityWithRate from './QuantityWithRate';

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
	record,
}: ViewHoldingInputProps) {
	const { childTab }: any = useContext(NWContext);
	const { PM, CRYPTO, DEPO, ML, NPS, PPF, EPF, VPF, VEHICLE, LOAN, INS } = TAB;

	const changeDuration = (val: any) => {
		if(record.pur) record.pur[0].qty = val;
		changeData([ ...data ]);
	};

	const changeInstallmet = (val: number) => {
		if(record.pur) record.pur[0].amt = val;
		changeData([ ...data ]);
	};

	const changeName = (val: any) => {
		record.name = val;
		changeData([ ...data ]);
	};
	
	const changeQty = (quantity: number) => {
		if(record.pur){
			if (childTab === VEHICLE || childTab === ML || childTab === DEPO) record.pur[0].amt = quantity;
		} else { record.qty = quantity };
		changeData([ ...data ]);
	};

	const changeChg = (chg: number) => {
		record.chg = chg;
		changeData([ ...data ]);
	};

	const changeYearly = (val: number) => {
		record.chgF = val
		changeData([ ...data ]);
	};

	const changeCategory = (subtype: string) => {
		record.subt = subtype;
		if(subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (!opts[record.name as string]) record.name = Object.keys(opts)[0];
		}
		changeData([ ...data ]);
	};

	const changeSubCategory = (val: string) => {
		(childTab === ML || childTab === DEPO ) ? record.chgF = Number(val) : record.name = val;
		changeData([ ...data ]);
	};

	const changePurchaseDate = (val: string) => {
		if (record.pur) {
			record.pur[0].month = Number(val.slice(0, val.indexOf('-')));
			record.pur[0].year = Number(val.slice(val.indexOf('-') + 1));
			changeData([ ...data ])
		}
	};

	const isLiability = (childTab: string) => [LOAN, INS].includes(childTab);

	const hasRate = (childTab: string) => [PPF, VPF, EPF, ML, DEPO].includes(childTab);

	const hasName = (childTab: string) => ![PM, NPS, CRYPTO].includes(childTab);

	const hasQtyWithRate = (childTab: string) => [PM, NPS, CRYPTO].includes(childTab);

	const hasDuration = (childTab: string) => [ML, DEPO].includes(childTab);

	const hasDate = (childTab: string) => [ML, DEPO, VEHICLE].includes(childTab);

	return (
		<Fragment>
			{categoryOptions && 
			<Col>
				 <SelectInput
					pre=""
					value={childTab === PPF ? record.chgF as number : record.subt as string}
					options={categoryOptions}
					changeHandler={(val: string) => changeCategory(val)}
				/>
			{subCategoryOptions ? subCategoryOptions[record.subt as string] && (	
				<Fragment>&nbsp;
					<SelectInput
						pre=""
						value={(childTab === DEPO || childTab === ML) ? record.chgF as number : record.name as string}
						options={subCategoryOptions[record.subt as string]}
						changeHandler={(val: string) => changeSubCategory(val)}
						post={record.subt === AssetSubType.Gold ? 'karat' : ''}
					/>
				</Fragment>)
				: null}
			</Col>}
			{hasName(childTab) && 
				<Col>
				<TextInput pre="Name" changeHandler={(val: string)=>changeName(val)} value={record.name as string} size={'small'} />
				</Col>
			}
			{hasQtyWithRate(childTab) ?
				<Col>
					<QuantityWithRate 
						quantity={record.qty} 
						name={record.name as string} 
						subtype={record.subt as string} 
						onChange={(val: number)=>changeQty(val)} />
				</Col> :
				<Col>
				<NumberInput
					pre={'Amount'}
					min={10}
					max={100000000}
					value={(record.pur && (childTab === VEHICLE || childTab === ML || childTab === DEPO)) ? record.pur[0].amt : record.qty}
					changeHandler={(val: number)=>changeQty(val)}
					currency={record.curr as string}
					step={1}
					noSlider />
				</Col>
			}
			{hasRate(childTab) && 
				<Col>
					<label>Rate</label>&nbsp;
					<InputNumber
						onChange={(val: number)=>changeChg(val)}
						min={1}
						max={50}
						value={record.chg as number}
						step={0.1} />
				</Col>}
			{record.pur && 
			<Col>
				{hasDate(childTab) && 
				<DatePickerInput
					picker="month"
					title={'Date'}
					changeHandler={(val:string)=>changePurchaseDate(val)}
					defaultVal={`${record.pur[0]?.year}-${record.pur[0]?.month}` as string}
					size={'middle'}
				/> }&nbsp;&nbsp;
				{hasDuration(childTab) && 
					<><label>Duration</label><InputNumber 
						onChange={(val: number)=>changeDuration(val)} 
						value={record.pur[0].qty as number} /></>}
			</Col>}
			{isLiability(childTab) &&
				<Col>
					<SelectInput
						pre={'Installment Type'}
						value={record.chgF as number}
						options={{ 1: 'Yearly', 12: 'Monthly' }}
						changeHandler={(val: any)=>changeYearly(val)}/>&nbsp;
					<label>No. of installment</label>
					<InputNumber
						min={1}
						max={1000}
						value={record.pur ? record.pur[0].amt as number : 0}
						onChange={(val: number)=>changeInstallmet(val)}
						step={1}
					/>
				</Col>}
			</Fragment>
	);
}
