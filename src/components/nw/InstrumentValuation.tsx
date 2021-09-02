import { Empty, Table, Tag } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { HoldingInput, AssetType } from '../../api/goals';
import { NWContext } from './NWContext';
import Holding from './Holding';
import { doesHoldingMatch, getAssetTypes } from './nwutils';
import { toHumanFriendlyCurrency } from '../utils';
import { COLORS } from '../../CONSTANTS';
import { FilterTwoTone } from '@ant-design/icons';
import { AppContext } from '../AppContext';

export default function InstrumentValuation() {
	const { insData }: any = useContext(AppContext);
	const { instruments, setInstruments, selectedMembers, selectedCurrency, totalInstruments }: any = useContext(
		NWContext
	);
	const { CheckableTag } = Tag;
	const [ filteredInstruments, setFilteredInstruments ] = useState<Array<any>>([ ...instruments ]);
	const assetTypes = Object.keys(getAssetTypes());
	const [ selectedAssetTypes, setSelectedAssetTypes ] = useState<Array<string>>(assetTypes);
	const [ nameFilterValues, setNameFilterValues ] = useState<Array<any>>([ {} ]);
	const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});
	const [ total, setTotal ] = useState<number>(totalInstruments);

	const delRecord = (id: string) => setInstruments([ ...instruments.filter((record: any) => record.id !== id) ]);

	const columns = [
		{
			title: (
				<strong style={{ color: COLORS.GREEN }}>
					Total ~ {toHumanFriendlyCurrency(total, selectedCurrency)}
				</strong>
			),
			key: 'id',
			filterIcon: <FilterTwoTone twoToneColor={COLORS.GREEN} style={{ fontSize: 20 }} />,
			filteredValue: filteredInfo.id || null,
			filters: nameFilterValues,
			onFilter: (values: Array<string>, record: any) => values.indexOf(record.id) > -1,
			render: (record: any) => (
				<Holding key={record.id} holding={record as HoldingInput} onDelete={delRecord} showPrice />
			)
		}
	];

	const getFilterItem = (id: string, name: string) => {
		return {
			text: name,
			value: id
		};
	};

	//@ts-ignore
	const handleChange = (pagination: any, filters: any, sorters: any) => setFilteredInfo(filters);

	useEffect(
		() => {
			if (!instruments.length) return;
			let ids = filteredInfo && filteredInfo.id && filteredInfo.id.length ? filteredInfo.id : null;
			let filteredData: Array<HoldingInput> = instruments.filter((instrument: HoldingInput) => {
				if (ids && ids.indexOf(instrument.id) < 0) return false;
				return (
					doesHoldingMatch(instrument, selectedMembers, selectedCurrency) &&
					selectedAssetTypes.indexOf(instrument.type as string) > -1
				);
			});
			setFilteredInstruments([ ...filteredData ]);
		},
		[ instruments, selectedMembers, selectedCurrency, selectedAssetTypes, filteredInfo ]
	);

	useEffect(() => {
		let filteredNames: Array<any> = [];
		filteredInstruments.forEach((instrument: HoldingInput) => 
			filteredNames.push(getFilterItem(instrument.id as string, instrument.name as string))
		);
		setNameFilterValues([ ...filteredNames ]);
	}, [instruments]);

	useEffect(
		() => {
			let total = 0;
			filteredInstruments.forEach((instrument: HoldingInput) => 
				total += instrument.qty * (insData[instrument.id] ? insData[instrument.id].price : 0)
			);
			setTotal(total);
		},
		[ filteredInstruments ]
	);

	return (
		<Fragment>
			<p style={{ textAlign: 'center' }}>
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
