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
	const { childTab, activeTab }: any = useContext(NWContext);
	const { PM, CRYPTO, DEPO, ML, NPS, PPF, EPF, VPF, VEHICLE, LOAN, INS } = TAB;
	const pur = record.pur ? record.pur : null ;

	const changeDuration = (val: any) => {
		if(pur) { 
			pur[0].qty = val;
			changeData([ ...data ]);
		}
	};

	const changeInstallmet = (val: number) => {
		if(pur) { 
			pur[0].amt = val;
			changeData([ ...data ]);
		}
	};

	const changeName = (val: any) => {
		record.name = val;
		changeData([ ...data ]);
	};
	
	const changeQty = (quantity: number) => {
		if(pur){
			if(childTab === VEHICLE ) pur[0].amt = quantity;
			else record.qty = quantity;
			changeData([ ...data ]);
		}
	};

	const changeChg = (chg: number) => {
		record.qty = chg;
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

	const changeSubCategory = (purity: string) => {
		record.name = purity;
		changeData([ ...data ]);
	};

	const changePurchaseDate = (val: string) => {
		if (pur) {
			pur[0].month = Number(val.slice(0, val.indexOf('-')));
			pur[0].year = Number(val.slice(val.indexOf('-') + 1));
			changeData([ ...data ])
		}
	};

	return (
		<Fragment>
			{categoryOptions && 
			<Col>
				 <SelectInput
					pre=""
					value={( childTab === PPF || childTab === DEPO || childTab === ML ) ? record.chgF as number : record.subt as string}
					options={categoryOptions}
					changeHandler={(val: string) => changeCategory(val)}
				/>
			{subCategoryOptions ? subCategoryOptions[record.subt as string] && (	
				<Fragment>&nbsp;
					<SelectInput
						pre=""
						value={record.name as string}
						options={subCategoryOptions[record.subt as string]}
						changeHandler={(val: string) => changeSubCategory(val)}
						post={record.subt === AssetSubType.Gold ? 'karat' : ''}
					/>
				</Fragment>)
				: null}
			</Col>}
			{childTab === CRYPTO || childTab === NPS || childTab === PM  ? 
				<Col>
					<QuantityWithRate 
						quantity={record.qty} 
						name={record.name as string} 
						subtype={record.subt as string} 
						onChange={changeQty} />
				</Col> : 
			    <>
					<Col>
						<TextInput pre="Name" changeHandler={(val: string)=>changeName(val)} value={record.name as string} size={'small'} />
					</Col>
					{(childTab === PPF || childTab === EPF || childTab === VPF || childTab === ML || childTab === DEPO) &&
					<Col>
						<label>Rate</label>&nbsp;
						<InputNumber
							onChange={changeChg}
							min={1}
							max={50}
							value={record.chg as number}
							step={0.1} />
					</Col> }
					<Col>
						<NumberInput
							pre={'Amount'}
							min={10}
							max={100000000}
							// @ts-ignore
							value={(childTab === VEHICLE || childTab === ML || childTab === DEPO) ? record.pur && record.pur[0].amt : record.qty}
							changeHandler={changeQty}
							currency={record.curr as string}
							step={1}
							noSlider />
					</Col>
				</>}
				{record.pur && (childTab === VEHICLE || childTab === DEPO || childTab === ML) &&  
					<Col>
						<DatePickerInput
							picker="month"
							title={'Date'}
							changeHandler={(val:string)=>changePurchaseDate(val)}
							// @ts-ignore
							defaultVal={`${record.pur[0]?.year}-${record.pur[0]?.month}` as string}
							size={'middle'}
						/>
						{(childTab === DEPO || childTab === ML) && 
						<><label>Duration</label><InputNumber onChange={changeDuration} value={record.pur[0].qty as number} /></>
						}
					</Col>}
				{(activeTab === LOAN || activeTab === INS) &&
					<Col>
					 	<SelectInput
							 pre={'Installment Type'}
							 value={record.chgF as number}
							 options={{ 1: 'Yearly', 12: 'Monthly' }}
							 changeHandler={changeYearly}/>&nbsp;
						<label>No. of installment</label>
						<InputNumber
							min={1}
							max={1000}
							// @ts-ignore
							value={record.pur[0].amt as number}
							onChange={changeInstallmet}
							step={1}
						/>
				 	</Col>}
			</Fragment>
	);
}
