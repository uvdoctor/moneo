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
	const { childTab, npsSubtype }: any = useContext(NWContext);
	const { CRYPTO, LENT, INS, NPS } = TAB;

	const changeCategory = (val: string) => {
		childTab === CRYPTO ? (record.name = val) : childTab === NPS ? (record.type = val) : (record.subt = val);
		if (subCategoryOptions) {
			let opts = subCategoryOptions[val];
			if (!opts) return changeData([ ...data ]);
			if (childTab === LENT) {
				if (!opts[record.chgF as number]) record.chgF = Number(Object.keys(opts)[0]);
			} else {
				if (!opts[record.name as string]) record.name = Object.keys(opts)[0];
			}
		}
		if (npsSubtype) {
			let opts = npsSubtype[record.type as string][val];
			if (!opts) return changeData([ ...data ]);
			if (!opts[record.subt as string]) record.subt = Object.keys(opts)[0];
		}
		changeData([ ...data ]);
	};

	const changeSubCategory = (val: string) => {
		if (npsSubtype) {
			let opts = npsSubtype[record.type as string][val];
			if (!opts) return changeData([ ...data ]);
			if (!opts[record.subt as string]) record.subt = Object.keys(opts)[0];
		}
		if (childTab === LENT || childTab === INS) record.chgF = Number(val);
		else {
			record.name = val;
		}
		changeData([ ...data ]);
	};

	return (
		<Row gutter={[ 10, 10 ]}>
			{categoryOptions && (
				<Col span={24}>
					<SelectInput
						pre=""
						value={
							childTab === CRYPTO ? (
								record.name as string
							) : childTab === NPS ? (
								record.type as string
							) : (
								record.subt as string
							)
						}
						options={categoryOptions}
						changeHandler={(val: string) => changeCategory(val)}
					/>
				</Col>
			)}
			{subCategoryOptions ? (
				(childTab === NPS
					? subCategoryOptions[record.type as string]
					: subCategoryOptions[record.subt as string]) && (
					<Col span={24}>
						<SelectInput
							pre=""
							value={
								childTab === LENT || childTab === INS ? record.chgF as number : record.name as string
							}
							options={
								childTab === NPS ? (
									subCategoryOptions[record.type as string]
								) : (
									subCategoryOptions[record.subt as string]
								)
							}
							changeHandler={(val: string) => changeSubCategory(val)}
							post={record.subt === AssetSubType.Gold ? 'karat' : ''}
						/>
					</Col>
				)
			) : null}
		</Row>
	);
}
