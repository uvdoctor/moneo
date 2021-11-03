import { Col } from 'antd';
import React, { Fragment } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { OTHER_TAB, SAV_TAB } from './NWContext';
import QuantityWithRate from './QuantityWithRate';

interface ViewHoldingInputProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	subCategoryOptions: any;
	record: HoldingInput;
	childTab?: any
}

export default function ViewHoldingInput({
	data,
	changeData,
	categoryOptions,
	subCategoryOptions,
	record,
	childTab
}: ViewHoldingInputProps) {

	const changeName = (e: any) => {
		record.name = e.target.value;
		changeData([ ...data ]);
	};
	
	const changeQty = (quantity: number) => {
		record.qty = quantity;
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

	return (
		<Fragment>
			{categoryOptions && <Col>
				 <SelectInput
					pre=""
					value={record.subt as string}
					options={categoryOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>
				{subCategoryOptions && (
					<Fragment>
						&nbsp;
						<SelectInput
							pre=""
							value={record.name as string}
							options={subCategoryOptions[record.subt as string]}
							changeHandler={(val: string) => changePurity(val)}
							post={record.subt === AssetSubType.Gold ? 'karat' : ''}
						/>
					</Fragment>
				)}
			</Col>}
			{childTab[0] === OTHER_TAB || childTab[0] === SAV_TAB ? 
			<><Col>
					<TextInput pre="Name" changeHandler={changeName} value={record.name as string} size={'small'} />
				</Col><Col>
						<NumberInput
							pre={'Amount'}
							min={0}
							max={100000}
							value={record.qty}
							changeHandler={changeQty}
							currency={record.curr as string}
							step={1}
							hidSlider />
					</Col></> :
			<Col>
				<QuantityWithRate quantity={record.qty} name={record.name as string} subtype={record.subt as string} onChange={changeQty} />
			</Col>}
		</Fragment>
	);
}
