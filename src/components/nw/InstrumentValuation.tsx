import { Empty, Table, Tag } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { HoldingInput, AssetType } from '../../api/goals';
import { ALL_FAMILY } from './FamilyInput';
import { NWContext } from './NWContext';
import Holding from './Holding';
import { checkIfMemberIsSelected, getAssetTypes } from './nwutils';
import { includesAny, toHumanFriendlyCurrency } from '../utils';
import { COLORS } from '../../CONSTANTS';
import { FilterTwoTone } from '@ant-design/icons';

export default function InstrumentValuation() {
	const { insData }: any = useContext(NWContext);
	const { CheckableTag } = Tag;
	const { holdings, selectedMembers, selectedCurrency, allFamily, currencyList }: any = useContext(NWContext);
	const [ filteredInstruments, setFilteredInstruments ] = useState<Array<any>>([]);
	const assetTypes = Object.keys(getAssetTypes());
	const [ selectedAssetTypes, setSelectedAssetTypes ] = useState<Array<string>>(assetTypes);
	const [ nameFilterValues, setNameFilterValues ] = useState<Array<any>>([ {} ]);
	const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});
	const [ filteredTotal, setFilteredTotal ] = useState<number>(0);

	const delRecord = (id: string) => {
		setFilteredInstruments([ ...filteredInstruments.filter((record: any) => record.id !== id) ]);
		holdings.instruments = holdings.instruments.filter((record: any) => record.id !== id);
	};

	const columns = [
		{
			title: <strong style={{color: COLORS.GREEN}}>Total ~ {toHumanFriendlyCurrency(filteredTotal, selectedCurrency)}</strong>,
			key: 'name',
			filterIcon: <FilterTwoTone twoToneColor={COLORS.GREEN} style={{fontSize: 20}} />,
			filteredValue: filteredInfo.name || null,
			filters: nameFilterValues,
			onFilter: (value: Array<any>, record: any) => record.name.includes(value),
			render: (record: any) => (
				<Holding key={record.id} holding={record as HoldingInput} onDelete={delRecord} showPrice />
			)
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
			!allFamily ||
			Object.keys(allFamily).length <= 1 ||
			selectedMembers.includes(ALL_FAMILY) ||
			Object.keys(allFamily).length === selectedMembers.length
		) {
			if (!currencyList || Object.keys(currencyList).length === 1) return holdings.instruments;
			return holdings.instruments.filter((instrument: HoldingInput) => instrument.curr === selectedCurrency);
		}
		return holdings.instruments.filter(
			(instrument: HoldingInput) =>
				checkIfMemberIsSelected(allFamily, selectedMembers, instrument.fIds[0]) &&
				instrument.curr === selectedCurrency
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
					includesAny(instrument.type as string, selectedAssetTypes)
				)
			]);
		},
		[ holdings.instruments.length, selectedMembers, selectedCurrency, selectedAssetTypes ]
	);

	useEffect(
		() => {
			let filteredNames: Array<any> = [];
			let total = 0;
			filteredInstruments.forEach((instrument: HoldingInput) => {
				filteredNames.push(getFilterItem(instrument.name as string));
				total += instrument.qty * (insData[instrument.id] ? insData[instrument.id].price : 0);
			});
			setNameFilterValues([ ...filteredNames ]);
			setFilteredTotal(total);
		},
		[ filteredInstruments ]
	);

	return (
		<Fragment>
			<p style={{textAlign: "center"}}>
				{assetTypes.map((tag: string) => (
					<CheckableTag
						key={tag}
						checked={selectedAssetTypes.indexOf(tag) > -1}
						onChange={(checked: boolean) => {
							if (checked) {
								selectedAssetTypes.push(tag);
								setSelectedAssetTypes([ ...selectedAssetTypes ]);
							} else setSelectedAssetTypes([ ...selectedAssetTypes.filter((t: string) => t !== tag) ]);
						}}
					>
						{getAssetTypes()[tag as AssetType]}
					</CheckableTag>
				))}
			</p>
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
