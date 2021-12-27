import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { NWContext, TAB } from './NWContext';

interface CategoryProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	subCategoryOptions: any;
	record: HoldingInput;
}

export default function Category({ data, changeData, categoryOptions, subCategoryOptions, record }: CategoryProps) {
	const { childTab }: any = useContext(NWContext);
	const { CRYPTO, LENT, INS } = TAB;

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

	return (
		<Row>
			<Col>
				<Row>
					{categoryOptions && (
						<SelectInput
							pre=""
							value={record.subt as string}
							options={categoryOptions}
							changeHandler={(val: string) => changeCategory(val)}
						/>
					)}
				</Row>
				<Row>
					{subCategoryOptions ? (
						subCategoryOptions[record.subt as string] && (
							<SelectInput
								pre=""
								value={
									childTab === LENT || childTab === INS ? (
										record.chgF as number
									) : (
										record.name as string
									)
								}
								options={subCategoryOptions[record.subt as string]}
								changeHandler={(val: string) => changeSubCategory(val)}
								post={record.subt === AssetSubType.Gold ? 'karat' : ''}
							/>
						)
					) : null}
				</Row>
			</Col>
		</Row>
	);
}
