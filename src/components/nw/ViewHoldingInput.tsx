import { Col, InputNumber } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { getMonthIndex, getMonthName } from '../utils';
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
	const { PM, CRYPTO, DEPO, ML, NPS, PF, VEHICLE, LOAN, INS } = TAB;

	const changeDuration = (val: any) => {
		if(record.pur) record.pur[0].qty = val;
		changeData([ ...data ]);
	};

	const changeName = (val: any) => {
		record.name = val;
		changeData([ ...data ]);
	};
	
	const changeQty = (quantity: number) => {
		if(record.pur) {
			record.pur[0].amt = quantity;
			if(hasPF(childTab)) {
				record.pur[0].month = new Date().getMonth()+1;
				record.pur[0].year = new Date().getFullYear();
			}
		}else record.qty = quantity;
		changeData([ ...data ]);
	};

	const changeChg = (chg: number) => {
		record.chg = chg;
		changeData([ ...data ]);
	};

	const changeCategory = (subtype: string) => {
		record.subt = subtype;
		if(subCategoryOptions) {
			if(childTab === ML || childTab === DEPO) {
				if (subtype === 'No') record.chgF === 0;
				else { 
					let opts = subCategoryOptions[subtype];
					if (!opts[record.chgF as number]) record.chgF = Number(Object.keys(opts)[0]);
				}
			} else {
			let opts = subCategoryOptions[subtype];
			if (!opts[record.name as string]) record.name = Object.keys(opts)[0];
			}
		}
		changeData([ ...data ]);
	};

	const changeSubCategory = (val: string) => {
		(childTab === ML || childTab === DEPO || childTab === INS ) ? record.chgF = Number(val) : record.name = val;
		changeData([ ...data ]);
	};

	const changePurchaseDate = (val: string) => {
		if (record.pur) {
			record.pur[0].year = Number(val.substring(val.length-4));
			record.pur[0].month = getMonthIndex(val.substring(0, 3));
			changeData([ ...data ])
		}
	};

	const hasRate = (childTab: string) => [PF, ML, DEPO, LOAN].includes(childTab);

	const hasName = (childTab: string) => ![PM, NPS, CRYPTO, INS].includes(childTab);

	const hasQtyWithRate = (childTab: string) => [PM, NPS, CRYPTO].includes(childTab);

	const hasDuration = (childTab: string) => [ML, DEPO, LOAN, INS].includes(childTab);

	const hasDate = (childTab: string) => [ML, DEPO, VEHICLE, LOAN, INS].includes(childTab);

	const hasPF = (childTab: string) => [PF].includes(childTab);

	return (
		<Fragment>
			{categoryOptions && 
			<Col>
				 <SelectInput
					pre=""
					value={record.subt as string}
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
			{childTab===INS && 
				<SelectInput pre={''} 
				options={{1: 'Yearly', 12: 'Monthly'}} 
				value={record.chgF as number} 
				changeHandler={(val: string) => changeSubCategory(val)}/>
			}
			</Col>}
			{hasName(childTab) && 
				<Col>
					<TextInput 
						pre="Name" 
						changeHandler={(val: string)=>changeName(val)} 
						value={record.name as string} 
						size={'middle'} 
						width={200}/>
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
					pre={hasPF(childTab) ? 'Contribution per year' : 'Amount'}
					min={10}
					max={100000000}
					value={record.pur ? record.pur[0].amt : record.qty}
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
			{hasDate(childTab) && record.pur && <Col>
				<DatePickerInput
					picker="month"
					title={'Date'}
					changeHandler={(val:string)=>changePurchaseDate(val)}
					defaultVal={`${getMonthName(record.pur[0].month, true)}-${record.pur[0].year}`}
					size={'middle'}
				/>&nbsp;&nbsp;
				{hasDuration(childTab) && 
					<><label>Duration</label><InputNumber 
						onChange={(val: number)=>changeDuration(val)} 
						value={record.pur[0].qty as number} /></>}
			</Col>}
			</Fragment>
	);
}
