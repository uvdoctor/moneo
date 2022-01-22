import React, { useContext, useEffect } from 'react';
import { NWContext, TAB } from './NWContext';
import CascaderInput from '../form/CascaderInput';
import { getRateByCategory, hasOnlyCategory } from './nwutils';
import { HoldingInput } from '../../api/goals';
interface CategoryProps {
	category?: string;
	categoryOptions: any;
	subCategory?: string;
	record: HoldingInput;
	changeData: Function;
	data?: Array<HoldingInput>;
	setRate?: Function;
	setCategory?: Function;
	setSubCat?: Function;
}

export default function Category({
	categoryOptions,
	category,
	subCategory,
	record,
	changeData,
	data,
	setRate,
	setCategory,
	setSubCat
}: CategoryProps) {
	const { childTab }: any = useContext(NWContext);
	const { CRYPTO, INS, LTDEP, PF, P2P, LENT } = TAB;
	const isListHolding: boolean = data ? true : false;
	const parentValue = isListHolding
		? childTab === CRYPTO ? record.name : childTab === P2P ? record.chgF : record.subt
		: category;
	const childValue = hasOnlyCategory(childTab)
		? ''
		: isListHolding ? (childTab === INS || childTab === LENT ? record.chgF : record.name) : subCategory;
	const type = isListHolding ? record.subt : parentValue;

	const changeCategory = (value: any) => {
		setCategory && setCategory(value);
		childTab === CRYPTO
			? (record.name = value)
			: childTab === P2P ? (record.chgF = Number(value)) : (record.subt = value);
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	const changeSubCategory = (value: any) => {
		setSubCat && setSubCat(value);
		childTab === INS || childTab === LENT ? (record.chgF = Number(value)) : (record.name = value);
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
	};

	useEffect(
		() => {
			if (childTab === LTDEP || childTab === PF) {
				const rate = getRateByCategory(String(record.subt));
				if (isListHolding) {
					record.chg = rate;
				} else {
					setRate && setRate(rate);
				}
			}
		},
		[ type ]
	);

	return (
		<CascaderInput
			parentValue={String(parentValue)}
			childValue={hasOnlyCategory(childTab) ? '' : String(childValue)}
			childChangeHandler={hasOnlyCategory(childTab) ? '' : changeSubCategory}
			parentChangeHandler={changeCategory}
			options={categoryOptions}
			pre={''}
		/>
	);
}
