import React, { useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import { NWContext, TAB } from './NWContext';
import CascaderInput from '../form/CascaderInput';
import { hasOnlyCategory } from './nwutils';
interface CategoryProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	record: HoldingInput;
}

export default function Category({ data, changeData, categoryOptions, record }: CategoryProps) {
	const { childTab }: any = useContext(NWContext);
	const { CRYPTO, INS } = TAB;

	const changeCategory = (value: any) => {
		childTab === CRYPTO ? (record.name = value) : (record.subt = value);
		changeData([ ...data ]);
	};

	const changeSubCategory = (value: any) => {
		childTab === INS ? (record.chgF = Number(value)) : (record.name = value);
		changeData([ ...data ]);
	};

	return (
		<CascaderInput
			parentValue={childTab === CRYPTO ? record.name as string : record.subt as string}
			childValue={
				hasOnlyCategory(childTab) ? '' : childTab === INS ? record.chgF as number : record.name as string
			}
			childChangeHandler={hasOnlyCategory(childTab) ? '' : changeSubCategory}
			parentChangeHandler={changeCategory}
			options={categoryOptions}
			pre={''}
		/>
	);
}
