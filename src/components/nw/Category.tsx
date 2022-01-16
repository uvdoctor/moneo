import React, { useContext, useEffect } from 'react';
import { HoldingInput } from '../../api/goals';
import { NWContext, TAB } from './NWContext';
import CascaderInput from '../form/CascaderInput';
import { getRateByCategory, hasOnlyCategory } from './nwutils';
interface CategoryProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	record: HoldingInput;
}

export default function Category({ data, changeData, categoryOptions, record }: CategoryProps) {
	const { childTab }: any = useContext(NWContext);
	const { CRYPTO, INS, LTDEP, PF } = TAB;

	const changeCategory = (value: any) => {
		childTab === CRYPTO ? (record.name = value) : (record.subt = value);
		changeData([ ...data ]);
	};

	const changeSubCategory = (value: any) => {
		childTab === INS ? (record.chgF = Number(value)) : (record.name = value);
		changeData([ ...data ]);
	};

	useEffect(() => {
		if(childTab === LTDEP || childTab === PF) {
			record.chg = getRateByCategory(record.subt as string);
		}
	}, [record])

	return (
		<CascaderInput
			parentValue={childTab === CRYPTO ? record.name as string : record.subt as string}
			childValue={
				hasOnlyCategory(childTab) ? '' : childTab === INS ? String(record.chgF) : record.name as string
			}
			childChangeHandler={hasOnlyCategory(childTab) ? '' : changeSubCategory}
			parentChangeHandler={changeCategory}
			options={categoryOptions}
			pre={''}
		/>
	);
}
