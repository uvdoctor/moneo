import { Col, InputNumber } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { CRYPTO_TAB, EPF_TAB, NPS_TAB, NWContext, PM_TAB, PPF_TAB, VEHICLE_TAB, VPF_TAB } from './NWContext';
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

	console.log( record );
	
	const changeName = (val: any) => {
		record.name = val;
		changeData([ ...data ]);
	};
	
	const changeQty = (quantity: number) => {
		// @ts-ignore
		if(childTab === VEHICLE_TAB) record.pur[0].amt = quantity;
		else record.qty = quantity;
		changeData([ ...data ]);
	};

	const changeChg = (chg: number) => {
		record.qty = chg;
		changeData([ ...data ]);
	};

	const changeSubtype = (subtype: string) => {
		record.subt = subtype;
		if(subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (!opts[record.name as string]) record.name = Object.keys(opts)[0];
		}
		changeData([ ...data ]);
	};

	const changePurity = (purity: string) => {
		record.name = purity;
		changeData([ ...data ]);
	};

	const changePurchaseDate = (val: string) => {
		// @ts-ignore
		record.pur[0].month = Number(val.slice(0, val.indexOf('-')));
		// @ts-ignore
		record[0].pur.year = Number(val.slice(val.indexOf('-') + 1));
		changeData([ ...data ])
	};

	return (
		<Fragment>
			{categoryOptions && 
			<Col>
				 <SelectInput
					pre=""
					value={childTab === PPF_TAB ? record.chgF as number : record.subt as string}
					options={categoryOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>
			{subCategoryOptions ? subCategoryOptions[record.subt as string] && (	
				<Fragment>&nbsp;
					<SelectInput
						pre=""
						value={record.name as string}
						options={subCategoryOptions[record.subt as string]}
						changeHandler={(val: string) => changePurity(val)}
						post={record.subt === AssetSubType.Gold ? 'karat' : ''}
					/>
				</Fragment>)
				: null}
			</Col>}
			{childTab === CRYPTO_TAB || childTab === NPS_TAB || childTab === PM_TAB  ? 
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
					{(childTab === PPF_TAB || childTab === EPF_TAB || childTab === VPF_TAB) &&
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
							value={childTab === VEHICLE_TAB ? record.pur && record.pur[0].amt : record.qty}
							changeHandler={changeQty}
							currency={record.curr as string}
							step={1}
							noSlider />
					</Col>
				</>}
				{childTab === VEHICLE_TAB && record.pur && 
					<Col>
						<DatePickerInput
							picker="month"
							title={'Date'}
							changeHandler={(val:string)=>changePurchaseDate(val)}
							// @ts-ignore
							defaultVal={`${record.pur[0]?.year}-${record.pur[0]?.month}` as string}
							size={'middle'}
						/>
					</Col>}
			</Fragment>
	);
}
