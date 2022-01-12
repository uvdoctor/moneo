import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { isMobileDevice } from '../utils';
import { NWContext, TAB } from './NWContext';
import { useFullScreenBrowser } from 'react-browser-hooks';
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
	const fsb = useFullScreenBrowser();

	const changeCategory = (subtype: string) => {
		childTab === CRYPTO ? (record.name = subtype) : (record.subt = subtype);
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
		<Row gutter={[ 10, 10 ]}>
			{categoryOptions && (
				<Col>
					<SelectInput
						pre=""
						value={childTab === CRYPTO ? record.name as string : record.subt as string}
						options={categoryOptions}
						changeHandler={(val: string) => changeCategory(val)}
						width={isMobileDevice(fsb) ? 120 : 'auto'}
					/>
				</Col>
			)}
			{subCategoryOptions ? (
				subCategoryOptions[record.subt as string] && (
					<Col>
						<SelectInput
							pre=""
							value={
								childTab === LENT || childTab === INS ? record.chgF as number : record.name as string
							}
							options={subCategoryOptions[record.subt as string]}
							changeHandler={(val: string) => changeSubCategory(val)}
							post={record.subt === AssetSubType.Gold ? 'karat' : ''}
							width={isMobileDevice(fsb) ? 120 : 'auto'}
						/>
					</Col>
				)
			) : null}
		</Row>
	);
}
