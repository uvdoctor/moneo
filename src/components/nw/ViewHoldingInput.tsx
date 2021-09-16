import { Col } from 'antd';
import React, { Fragment } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
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
	record
}: ViewHoldingInputProps) {

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
			<Col>
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
			</Col>
			<Col>
				<QuantityWithRate quantity={record.qty} name={record.name as string} subtype={record.subt as string} onChange={changeQty} />
			</Col>
		</Fragment>
	);
}
