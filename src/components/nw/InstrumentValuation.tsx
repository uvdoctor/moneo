import { Badge, Empty, Table, Tag } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { NWContext, TAB } from './NWContext';
import Holding from './Holding';
import { doesHoldingMatch, getAssetTypes, getColourForAssetType, getMarketCap, getFixedCategories } from './nwutils';
import { toHumanFriendlyCurrency } from '../utils';
import { COLORS } from '../../CONSTANTS';
import { FilterTwoTone } from '@ant-design/icons';
import { AppContext } from '../AppContext';
import { AssetType, HoldingInput } from '../../api/goals';

export default function InstrumentValuation() {
	const { insData }: any = useContext(AppContext);
	const {
		instruments,
		setInstruments,
		selectedCurrency,
		childTab,
		selectedMembers,
		setTotalFilterInstruments
	}: any = useContext(NWContext);
	const { CheckableTag } = Tag;
	const [ filteredInstruments, setFilteredInstruments ] = useState<Array<any>>([ ...instruments ]);
	const [ filterByTag, setFilterByTag ] = useState<Array<any>>([]);
	const [ nameFilterValues, setNameFilterValues ] = useState<Array<any>>([ {} ]);
	const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});
	const [ tags, setTags ] = useState<any>({});
	const [ selectedTags, setSelectedTags ] = useState<Array<string>>([]);
	const [ nestedTags, setNestedTags ] = useState<any>(selectedTags.includes('E') ? getMarketCap() : selectedTags.includes('F') ? getFixedCategories : '');
	const [ selectedNestedTags, setSelectedNestedTags ] = useState<Array<string>>([]);
	const [ totalFilterAmt, setTotalFilterAmt ] = useState<number>(0);

	const delRecord = (id: string) => setInstruments([ ...instruments.filter((record: any) => record.id !== id) ]);

	const columns = [
		{
			title: (
				<strong style={{color: COLORS.GREEN}}>
					Total ~ {toHumanFriendlyCurrency(totalFilterAmt, selectedCurrency)}
				</strong>
			),
			key: 'id',
			filterIcon: <FilterTwoTone twoToneColor={filteredInfo?.id ? COLORS.GREEN : COLORS.DEFAULT} style={{ fontSize: 20 }} />,
			filteredValue: filteredInfo.id || null,
			filters: nameFilterValues,
			onFilter: (values: Array<string>, record: any) => values.indexOf(record.id)>-1,
			render: (record: any) => {
				return <Holding key={record.id} holding={record as HoldingInput} onDelete={delRecord} showPrice />
			}
		}
	];

	//@ts-ignore
	const handleChange = (pagination: any, filters: any, sorters: any) => setFilteredInfo(filters);

	useEffect(
		() => {
			let filteredNames: Array<any> = [];
			let ids: Set<string> = new Set();
			filteredInstruments.forEach((instrument: HoldingInput) => {
				if (!ids.has(instrument.id)) filteredNames.push({ text: instrument.name, value: instrument.id });
				ids.add(instrument.id);
			});
			setNameFilterValues([ ...filteredNames ]);
		},
		[ filteredInstruments ]
	);

	useEffect(
		() => {
			let total = 0;
			let filterAmt = 0;
			filteredInstruments.map((instrument: HoldingInput) => {
				const price = instrument.qty * (insData[instrument.id] ? insData[instrument.id].price : 0);
				if (filteredInfo.id) {
					const id = filteredInfo.id.some((item: string) => item === instrument.id);
					if (id) filterAmt += price;
				}
				total += price;
			});
			setTotalFilterInstruments(total);
			!filteredInfo.id ? setTotalFilterAmt(total) : setTotalFilterAmt(filterAmt);
		},
		[ filteredInstruments, filteredInfo ]
	);

	useEffect(
		() => {
			if (childTab === TAB.STOCK) setTags(getMarketCap());
			else if (childTab === TAB.MF) setTags(getAssetTypes());
			else if (childTab === TAB.BOND) setTags({ CB: 'Corporate Bond', GB: 'Government Bond' });
			else setTags({});
		},
		[ childTab ]
	);

	useEffect(
		() => {
			if (childTab === TAB.MF && selectedTags.includes(AssetType.E)) setNestedTags(getMarketCap());
			if (childTab === TAB.MF && selectedTags.includes(AssetType.F)) setNestedTags(getFixedCategories());
		},
		[ selectedTags, childTab ]
	);

	const filterInstrumentsByTabs = () => {
		if (!instruments.length) return;
		let filteredData: Array<HoldingInput> = instruments.filter((instrument: HoldingInput) => {
			const data = insData[instrument.id];
			if (doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {
				if (childTab === TAB.IT) return data.itype === 'InvIT' || data.itype === 'REIT';
				if (childTab === TAB.MF) return instrument.id.startsWith('INF') && !data.itype;
				else if (childTab === TAB.STOCK) return instrument.subt === 'S' && !instrument.id.startsWith('INF');
				else if (childTab === TAB.BOND)
					// @ts-ignore
					return [ 'CB', 'GB', 'GBO' ].includes(instrument.subt) && !data.itype;
				else if (childTab === TAB.GOLDB) return instrument.subt === 'GoldB';
				else if (childTab === TAB.ETF) return data.itype === 'ETF';
			}
		});

		setFilteredInstruments([ ...filteredData ]);
	};

	const filterInstrumentsByTags = () => {
		if (!selectedTags.length) return;
		let filterDataByTag = filteredInstruments.filter((instrument: HoldingInput) => {
			const data = insData[instrument.id];
			if (childTab === TAB.MF) {
				if (selectedNestedTags.length) {
					if(selectedTags.indexOf(instrument.type as string) > -1) {
						if(instrument.type === 'E') return (selectedNestedTags.indexOf(data.mcap as string) > -1); 
						if(selectedNestedTags.includes('CB')) return (data.subt === 'CB');
						if(selectedNestedTags.includes('GB')) return (data.subt === 'GB' || data.subt === 'GBO');
						if(selectedNestedTags.includes('I')) return (data.subt === 'I');
						if(selectedNestedTags.includes('IF')) return (data.mftype === 'I' && data.subt === 'HB');
						if(selectedNestedTags.includes('FMP')) return (data.subt === 'HB' && data.mftype === 'C');
						if(selectedNestedTags.includes('L')) return (data.subt === 'L');
					}
				} 
				else return selectedTags.indexOf(instrument.type as string) > -1;
			} else if (childTab === TAB.STOCK && data.meta) return selectedTags.indexOf(data.meta.mcap as string) > -1;
			else if (childTab === TAB.BOND) return selectedTags.indexOf(instrument.subt as string) > -1;
		});
		setFilterByTag([ ...filterDataByTag ]);
	};

	useEffect(
		() => {
			filterInstrumentsByTabs();
		},
		[ childTab, instruments ]
	);

	useEffect(
		() => {
			filterInstrumentsByTags();
		},
		[ selectedTags, selectedNestedTags ]
	);

	return instruments.length ? (
		<Fragment>
			<p style={{ textAlign: 'center' }} >
				{Object.keys(tags).map((tag: string) => (
					<CheckableTag
						key={tag}	
						style={{backgroundColor: COLORS.WHITE,
								opacity: selectedTags.indexOf(tag) > -1 ? 1 : 0.5}}
						checked={selectedTags.indexOf(tag) > -1}
						onChange={(checked: boolean) => {
							if (checked) {
								selectedTags.push(tag);
								setSelectedTags([ ...selectedTags ]);
							} else setSelectedTags([ ...selectedTags.filter((t: string) => t !== tag) ]);
						}}
					>
						<Badge count={tags[tag]} style={{ background: COLORS.LIGHT_GRAY , color: 'black' }}/>
					</CheckableTag>
				))}
			</p>
			<p style={{ textAlign: 'center' }}>
				{(childTab === TAB.MF && (selectedTags.includes(AssetType.E) || selectedTags.includes(AssetType.F))) && 
					Object.keys(nestedTags).map((tag: string) => (
						<CheckableTag
							key={tag}
							style={{
								backgroundColor: COLORS.WHITE,
								opacity: selectedNestedTags.indexOf(tag) > -1 ? 1 : 0.5
							}}
							checked={selectedNestedTags.indexOf(tag) > -1}
							onChange={(checked: boolean) => {
								if (checked) {
									selectedNestedTags.push(tag);
									setSelectedNestedTags([ ...selectedNestedTags ]);
								} else
									setSelectedNestedTags([ ...selectedNestedTags.filter((t: string) => t !== tag) ]);
							}}
						>
							<Badge count={nestedTags[tag]} style={{ background: getColourForAssetType(tag) , color: 'black' }}/>
						</CheckableTag>
					))}
			</p>
			{filteredInstruments.length ? (
				<Table
					dataSource={selectedTags.length ? filterByTag : filteredInstruments}
					//@ts-ignore
					columns={columns}
					size="small"
					bordered
					onChange={handleChange}
				/>
			) : null}
		</Fragment>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
