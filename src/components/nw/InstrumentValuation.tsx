import { Badge, Empty, Table, Tag } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { NWContext, TAB } from './NWContext';
import Holding from './Holding';
import { toHumanFriendlyCurrency } from '../utils';
import { COLORS } from '../../CONSTANTS';
import { FilterTwoTone } from '@ant-design/icons';
import { AppContext, LOCAL_INS_DATA_KEY } from '../AppContext';
import { AssetSubType, AssetType, InstrumentInput, InsType, MCap, MFSchemeType } from '../../api/goals';
import simpleStorage from 'simplestorage.js';
import {
	doesHoldingMatch,
	getAssetTypes,
	getColourForAssetType,
	getMarketCap,
	getFixedCategories,
	isFund,
	isBond
} from './nwutils';

export default function InstrumentValuation() {
	const { insData }: any = useContext(AppContext);
	const { instruments, setInstruments, selectedCurrency, childTab, selectedMembers }: any = useContext(NWContext);
	const [ filteredInstruments, setFilteredInstruments ] = useState<Array<InstrumentInput>>([ ...instruments ]);
	const [ filterByTag, setFilterByTag ] = useState<Array<InstrumentInput>>([]);
	const [ nameFilterValues, setNameFilterValues ] = useState<Array<Object>>([ {} ]);
	const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});
	const [ tags, setTags ] = useState<{[key: string]: string}>({});
	const [ selectedTags, setSelectedTags ] = useState<Array<string>>([]);
	const [ subtTags, setSubtTags ] = useState<{[key: string]: string}>({});
	const [ selectedSubtTags, setSelectedSubtTags ] = useState<Array<string>>([]);
	const [ totalFilterAmt, setTotalFilterAmt ] = useState<number>(0);
	const { CheckableTag } = Tag;
	const { MF, STOCK, BOND, OIT, GOLDB} = TAB;

	const bondTags = { CB: 'Corporate Bond', GB: 'Government Bond' };
	const tagsData: { Stocks: { tags: {} }; 'Mutual Funds': { tags: {}; subt: {} }; Bonds: { tags: {} } } = {
		Stocks: { tags: getMarketCap() },
		'Mutual Funds': { tags: getAssetTypes(), subt: { E: getMarketCap(), F: getFixedCategories() } },
		Bonds: { tags: bondTags }
	};

	const hasTags = (childTab: string): Boolean => [ STOCK, MF, BOND ].includes(childTab);
	const delRecord = (id: string) => setInstruments([ ...instruments.filter((record: InstrumentInput) => record.id !== id) ]);

	const columns = [
		{
			title: (
				<strong style={{color: COLORS.GREEN}}>
					Total ~ {toHumanFriendlyCurrency(totalFilterAmt, selectedCurrency)}
				</strong>
			),
			key: childTab,
			filterIcon: <FilterTwoTone twoToneColor={filteredInfo?.id ? COLORS.GREEN : COLORS.DEFAULT} style={{ fontSize: 20 }} />,
			filteredValue: filteredInfo.id || null,
			filters: nameFilterValues,
			onFilter: (values: Array<string>, record: InstrumentInput) => values.indexOf(record.id)>-1,
			render: (record: InstrumentInput) => {
				return <Holding key={record.id} holding={record as InstrumentInput} onDelete={delRecord} onChange={setTotal}/>
			}
		}
	];

	const handleChange = (_pagination: any, filters: any, _sorters: any) => setFilteredInfo(filters);

	const subtTagsData = () => {
		// @ts-ignore
		const { E, F } = tagsData[childTab].subt;
		if (selectedTags.includes(AssetType.E) && selectedTags.includes(AssetType.F)) {
			setSubtTags({ ...E, ...F });
			setSelectedSubtTags([ ...Object.keys(E), ...Object.keys(F) ]);
			return;
		}
		if (selectedTags.includes(AssetType.E)) {
			setSubtTags(E);
			setSelectedSubtTags([ ...Object.keys(E) ]);
			return;
		}
		if (selectedTags.includes(AssetType.F)) {
			setSubtTags(F);
			setSelectedSubtTags([ ...Object.keys(F) ]);
			return;
		}
		setSubtTags({});
		setSelectedSubtTags([]);
		return;
	};

	const setTotal = () => {
		let [ total, filterAmt, cachedData ] = [ 0, 0, simpleStorage.get(LOCAL_INS_DATA_KEY) ];
		if (!cachedData) cachedData = insData;
		const dataToFilter = selectedTags.length ? filterByTag : filteredInstruments;
		dataToFilter.map((instrument: InstrumentInput) => {
			const id = instrument.id;
			const price = instrument.qty * (cachedData[id] ? cachedData[id].price : 0);
			if (filteredInfo.id) {
				if (filteredInfo.id.some((item: string) => item === id)) filterAmt += price;
			}
			total += price;
		});
		filteredInfo.id ? setTotalFilterAmt(filterAmt) : setTotalFilterAmt(total);
	};

	useEffect(() => {
		let filteredNames: Array<{ text: String; value: String }> = [];
		let ids: Set<string> = new Set();
		filteredInstruments.forEach((instrument: InstrumentInput) => {
			const id = instrument.id;
			if (!ids.has(id)) {
				filteredNames.push({ text: insData[id] ? insData[id].name : id, value: id });
			}
			ids.add(id);
		});
		setNameFilterValues([ ...filteredNames ]);
	},[ filteredInstruments ]);

	useEffect(() => {
		setTotal();
	},[ filteredInstruments, filteredInfo, instruments, selectedTags, filterByTag ]);

	useEffect(() => {
		// @ts-ignore
		hasTags(childTab) ? setTags(tagsData[childTab].tags) : setTags({});
	},[ childTab ]);

	useEffect(() => {
		if (childTab === MF) subtTagsData();
	},[ selectedTags ]);

	useEffect(() => {
		filterInstrumentsByTabs();
	},[ childTab, instruments, selectedMembers, selectedCurrency ]);

	useEffect(() => {
		filterInstrumentsByTags();
	},[ selectedTags, selectedSubtTags ]);

	const filterInstrumentsByTabs = () => {
		if (!instruments.length) return;
		const { E, F } = AssetType;
		const { REIT, InvIT, ETF } = InsType;
		let filteredData: Array<InstrumentInput> = instruments.filter((instrument: InstrumentInput) => {
			let [ id, cachedData ] = [ instrument.id, simpleStorage.get(LOCAL_INS_DATA_KEY) ]
			if (!cachedData) cachedData = insData;
			const data = cachedData[id];
			if (!data && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {
				if (childTab === MF && isFund(id)) return id;
				if (childTab === STOCK && !isFund(id)) return id;
			}
			if (data && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {
				if (childTab === TAB.REIT) return data.itype === REIT;
				if (childTab === OIT) return data.itype === InvIT;
				if (childTab === TAB.ETF) return data.itype === ETF;
				if (childTab === MF) return isFund(id) && !data.itype;
				if (childTab === GOLDB) return data.subt === AssetSubType.GoldB;
				if (childTab === BOND) return data.type === F && !isFund(id) && !data.itype;
				if (childTab === STOCK) return data.type === E && !isFund(id) && !isBond(id);
			}
		});
		setFilteredInstruments([ ...filteredData ]);
	};

	const filterInstrumentsByTags = () => {
		if (!selectedTags.length) return;
		let filterDataByTag = filteredInstruments.filter((instrument: InstrumentInput) => {
			let [ id, cachedData ] = [ instrument.id, simpleStorage.get(LOCAL_INS_DATA_KEY) ]
			if (!cachedData) cachedData = insData;
			const data = cachedData[id];
			if (childTab === MF && selectedSubtTags.length && selectedTags.indexOf(data.type as string) > -1) {
				const { CB, GBO, I, HB, GB, L } = AssetSubType;
				const { subt, mftype, type, mcap } = data;
				return (
					selectedSubtTags.includes(MCap.L) && mcap === MCap.L || 
					(selectedSubtTags.includes("Multi") && (mcap !== MCap.L || !mcap)) || 
					(selectedSubtTags.includes('CB') && subt === CB || mftype === MFSchemeType.O) ||
					(selectedSubtTags.includes('I') && (type === AssetType.F && subt === I)) ||
					(selectedSubtTags.includes('GovB') && (subt === GB || subt === GBO)) ||
					(selectedSubtTags.includes('IF') && (subt === HB && mftype === MFSchemeType.I)) ||
					(selectedSubtTags.includes('FMP') && (subt === HB && mftype === MFSchemeType.C)) ||
					(selectedSubtTags.includes('LF') && subt === L)
				);
			}
			if (childTab === STOCK && data) {
				return (selectedTags.includes(MCap.L) && data.meta && data.meta.mcap === MCap.L ||
					selectedTags.includes("Multi") && ((data.meta && data.meta.mcap !== MCap.L) || !data.meta || !data.meta.mcap));
			} else if (childTab === BOND && data) {
				const { subt } = data;
				const { GB, CB, GBO } = AssetSubType;
				if (selectedTags.includes(GB)) return subt === GB || subt === GBO;
				if (selectedTags.includes(CB)) return subt === CB;
			}
		});
		setFilterByTag([ ...filterDataByTag ]);
	};

	return instruments.length ? (
		<Fragment>
			<p style={{ textAlign: 'center' }}>
				{Object.keys(tags).map((tag: string) => (
					<CheckableTag
						key={tag}
						style={{
							backgroundColor: COLORS.WHITE,
							opacity: selectedTags.indexOf(tag) > -1 ? 1 : 0.5
						}}
						checked={selectedTags.indexOf(tag) > -1}
						onChange={(checked: boolean) => {
							if (checked) {
								selectedTags.push(tag);
								setSelectedTags([ ...selectedTags ]);
							} else setSelectedTags([ ...selectedTags.filter((t: string) => t !== tag) ]);
						}}
					>
						<Badge count={tags[tag]} style={{ background: COLORS.LIGHT_GRAY, color: 'black' }} />
					</CheckableTag>
				))}
			</p>
			<p style={{ textAlign: 'center' }}>
				{childTab === MF &&
					subtTags &&
					Object.keys(subtTags).map((tag: string) => (
						<CheckableTag
							key={tag}
							style={{
								backgroundColor: COLORS.WHITE,
								opacity: selectedSubtTags.indexOf(tag) > -1 ? 1 : 0.5
							}}
							checked={selectedSubtTags.indexOf(tag) > -1}
							onChange={(checked: boolean) => {
								if (checked) {
									selectedSubtTags.push(tag);
									setSelectedSubtTags([ ...selectedSubtTags ]);
								} else setSelectedSubtTags([ ...selectedSubtTags.filter((t: string) => t !== tag) ]);
							}}
						>
							<Badge
								count={subtTags[tag]}
								style={{ background: getColourForAssetType(tag), color: 'black' }}
							/>
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
