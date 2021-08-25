import { Empty, Table, Tag } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { HoldingInput, AssetSubType, AssetType, InsType } from '../../api/goals';
import { ALL_FAMILY } from './FamilyInput';
import { NWContext } from './NWContext';
import Holding from './Holding';
import { checkIfMemberIsSelected, getAllInsSubTypeNames, getInsSubTypeName } from './nwutils';
import { includesAny } from '../utils';

export default function InstrumentValuation() {
	const { CheckableTag } = Tag;
	const { holdings, selectedMembers, selectedCurrency, allFamily, currencyList }: any = useContext(NWContext);
	const [ filteredInstruments, setFilteredInstruments ] = useState<Array<any>>([]);
	const tagsData = getAllInsSubTypeNames();
	const [ selectedTags, setSelectedTags ] = useState<Array<string>>(tagsData);
	const [ nameFilterValues, setNameFilterValues ] = useState<Array<any>>([ {} ]);
	const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});

	const delRecord = (id: string) => {
		setFilteredInstruments([ ...filteredInstruments.filter((record: any) => record.id !== id) ]);
		holdings.instruments = holdings.instruments.filter((record: any) => record.id !== id);
	};

	const columns = [
		{
			title: 'Name',
			key: 'name',
			filteredValue: filteredInfo.name || null,
			filters: nameFilterValues,
			onFilter: (value: Array<any>, record: any) => record.name.includes(value),
			render: (record: any) => <Holding key={record.id} holding={record as HoldingInput} onDelete={delRecord} showPrice />
		}
	];

	const getFilterItem = (val: string) => {
		return {
			text: val,
			value: val
		};
	};

	//@ts-ignore
	const handleChange = (pagination: any, filters: any, sorters: any) => {
		setFilteredInfo(filters);
	};

	const filterByFamilyAndCurrency = () => {
		if (
			!allFamily || Object.keys(allFamily).length <= 1 ||
			selectedMembers.includes(ALL_FAMILY) ||
			Object.keys(allFamily).length === selectedMembers.length
		) {
			if (!currencyList || Object.keys(currencyList).length === 1) return holdings.instruments;
			return holdings.instruments.filter((instrument: HoldingInput) => instrument.curr === selectedCurrency);
		}
		return holdings.instruments.filter(
			(instrument: HoldingInput) =>
				checkIfMemberIsSelected(allFamily, selectedMembers, instrument.fIds[0]) && instrument.curr === selectedCurrency
		);
	};

	useEffect(
		() => {
			if (!holdings.instruments.length) return;
			let filteredData: Array<HoldingInput> = filterByFamilyAndCurrency();
			if (!filteredData.length) {
				setFilteredInstruments([ ...[] ]);
				return;
			}
			setFilteredInstruments([
				...filteredData.filter((instrument: HoldingInput) =>
					includesAny(
						getInsSubTypeName(instrument.type as AssetType, instrument.subt as AssetSubType | InsType),
						selectedTags
					)
				)
			]);
		},
		[ holdings.instruments.length, selectedMembers, selectedCurrency, selectedTags ]
	);

	useEffect(
		() => {
			let filteredNames: Array<any> = [];
			filteredInstruments.forEach((instrument: HoldingInput) => {
				filteredNames.push(getFilterItem(instrument.name as string));
			});
			setNameFilterValues([ ...filteredNames ]);
		},
		[ filteredInstruments ]
	);

	return (
		<Fragment>
			{tagsData.map((tag: string) => (
				<CheckableTag
					key={tag}
					checked={selectedTags.indexOf(tag) > -1}
					onChange={(checked: boolean) => {
						if (checked) {
							selectedTags.push(tag);
							setSelectedTags([ ...selectedTags ]);
						} else setSelectedTags([ ...selectedTags.filter((t: string) => t !== tag) ]);
					}}
				>
					{tag}
				</CheckableTag>
			))}
			{filteredInstruments.length ? (
				<Table
					dataSource={filteredInstruments}
					//@ts-ignore
					columns={columns}
					size="small"
					bordered
					onChange={handleChange}
				/>
			) : (
				<Empty description={<p>No data found.</p>} />
			)}
		</Fragment>
	);
}
