import { Badge, Empty, Table, Tag } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { NWContext, TAB } from './NWContext';
import Holding from './Holding';
import { doesHoldingMatch, getAssetTypes, getColourForAssetType, getMarketCap, getFixedCategories, isFund, isBond } from './nwutils';
import { toHumanFriendlyCurrency } from '../utils';
import { COLORS } from '../../CONSTANTS';
import { FilterTwoTone } from '@ant-design/icons';
import { AppContext } from '../AppContext';
import { AssetSubType, AssetType, InstrumentInput, InsType, MCap, MFSchemeType } from '../../api/goals';

export default function InstrumentValuation() {
	const { insData }: any = useContext(AppContext);
	const {
		instruments,
		setInstruments,
		selectedCurrency,
		childTab,
		selectedMembers,
	}: any = useContext(NWContext);
	const { CheckableTag } = Tag;
	const [ filteredInstruments, setFilteredInstruments ] = useState<Array<any>>([ ...instruments ]);
	const [ filterByTag, setFilterByTag ] = useState<Array<any>>([]);
	const [ nameFilterValues, setNameFilterValues ] = useState<Array<any>>([ {} ]);
	const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});
	const [ tags, setTags ] = useState<any>({});
	const [ selectedTags, setSelectedTags ] = useState<Array<string>>([]);
	const [ subtTags, setSubtTags ] = useState<any>({});
	const [ selectedSubtTags, setSelectedSubtTags ] = useState<Array<string>>([]);
	const [ totalFilterAmt, setTotalFilterAmt ] = useState<number>(0);

	const bondTags = { CB: 'Corporate Bond', GB: 'Government Bond' };
	const tagsData: any = {
		Stocks: { tags: getMarketCap() },
		'Mutual Funds': { tags: getAssetTypes(), subt: { E: getMarketCap(), F: getFixedCategories() } },
		Bonds: { tags: bondTags },
	};

	const hasTags = (childTab: string) => [ TAB.STOCK, TAB.MF, TAB.BOND ].includes(childTab);

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
				return <Holding key={record.id} holding={record as InstrumentInput} onDelete={delRecord} onChange={()=>setTotal()}/>
			}
		}
	];

	//@ts-ignore
	const handleChange = (pagination: any, filters: any, sorters: any) => setFilteredInfo(filters);

	useEffect(
		() => {
			let filteredNames: Array<any> = [];
			let ids: Set<string> = new Set();
			filteredInstruments.forEach((instrument: InstrumentInput) => {
				if (!ids.has(instrument.id)) filteredNames.push({ text: insData[instrument.id] ? insData[instrument.id].name : instrument.id, value: instrument.id });
				ids.add(instrument.id);
			});
			setNameFilterValues([ ...filteredNames ]);
		},
		[ filteredInstruments ]
	);

	const subtTagsData = () => {
		// @ts-ignore
		if (selectedTags.includes(AssetType.E) && selectedTags.includes(AssetType.F)) {
			setSubtTags({ ...tagsData[childTab].subt.E, ...tagsData[childTab].subt.F });
			setSelectedSubtTags([
				...Object.keys(tagsData[childTab].subt.E),
				...Object.keys(tagsData[childTab].subt.F)
			]);
			return;
		}
		if (selectedTags.includes(AssetType.E)) {
			setSubtTags(tagsData[childTab].subt.E);
			setSelectedSubtTags([ ...Object.keys(tagsData[childTab].subt.E) ]);
			return;
		}
		if (selectedTags.includes(AssetType.F)) {
			setSubtTags(tagsData[childTab].subt.F);
			setSelectedSubtTags([ ...Object.keys(tagsData[childTab].subt.F) ]);
			return;
		}
		setSubtTags({});
		setSelectedSubtTags([]);
		return;
	};

	const setTotal = () => {
		let total = 0;
		let filterAmt = 0;
		filteredInstruments.map((instrument: InstrumentInput) => {
			const price = instrument.qty * (insData[instrument.id] ? insData[instrument.id].price : 0);
			if (filteredInfo.id || selectedTags.length) {
				const idByName = filteredInfo.id.some((item: string) => item === instrument.id);
				const idByTags = filterByTag.length ? filterByTag.some((data: InstrumentInput) => data.id === instrument.id) : false;
				if (idByName || idByTags) filterAmt += price;
			}
			total += price;
		});
		!filteredInfo.id ? setTotalFilterAmt(total) : setTotalFilterAmt(filterAmt);
	}

	useEffect(() => {
		setTotal();
	},[ filteredInstruments, filteredInfo, instruments, filterByTag ]);

	useEffect(
		() => {
			hasTags(childTab) ? setTags(tagsData[childTab].tags) : setTags({});
		},
		[ childTab ]
	);

	useEffect(
		() => {
			if (childTab === TAB.MF) subtTagsData();
		},
		[ selectedTags ]
	);

	const filterInstrumentsByTabs = () => {
		if (!instruments.length) return;
		let filteredData: Array<InstrumentInput> = instruments.filter((instrument: InstrumentInput) => {
			const data = insData[instrument.id];
			if(!data && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {
				if (childTab === TAB.MF && isFund(instrument.id)) return instrument.id;
				else if (childTab === TAB.STOCK && !isFund(instrument.id)) return instrument.id;
			} 
			if (data && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {		
				if (childTab === TAB.REIT) return data.itype === InsType.REIT;
				else if (childTab === TAB.OIT) return data.itype === InsType.InvIT;
				else if (childTab === TAB.ETF) return data.itype === InsType.ETF;
				else if (childTab === TAB.MF) return isFund(instrument.id) && !data.itype;
				else if (childTab === TAB.GOLDB) return data.subt === AssetSubType.GoldB;
				else if (childTab === TAB.BOND) return data.type === AssetType.F;
				else if (childTab === TAB.STOCK) return data.subt === AssetSubType.S && !isFund(instrument.id) && !isBond(instrument.id);
			}
		});
		setFilteredInstruments([ ...filteredData ]);
	};

	const filterInstrumentsByTags = () => {
		if (!selectedTags.length) return;
		let filterDataByTag = filteredInstruments.filter((instrument: InstrumentInput) => {
			const data = insData[instrument.id];
			if (childTab === TAB.MF) {
				if (selectedSubtTags.length) {
					if (selectedTags.indexOf(data.type as string) > -1) {
						 return selectedSubtTags.indexOf(data.mcap as string) > -1 ||
						 (selectedSubtTags.includes(AssetSubType.CB) && (data.subt === AssetSubType.CB)) || 
						 (selectedSubtTags.includes(AssetSubType.I) && (data.type === AssetType.F && data.subt === AssetSubType.I)) || 
						(selectedSubtTags.includes('GovB') && (data.subt === AssetSubType.GB || data.subt === AssetSubType.GBO)) || 
						(selectedSubtTags.includes('IF') && (data.subt === AssetSubType.HB && data.mftype === MFSchemeType.I)) ||
						(selectedSubtTags.includes('FMP') && (data.subt === AssetSubType.HB && data.mftype === MFSchemeType.C)) ||
						(selectedSubtTags.includes('LF') && (data.subt === AssetSubType.L)) 
					}
				}
			} 
			else if (childTab === TAB.STOCK) {
				if(data && data.meta) {
					return (selectedTags.includes(MCap.L) && data?.meta?.mcap === MCap.L ) || 
					(selectedTags.includes(MCap.M) && data?.meta?.mcap === MCap.M ) ||
					(selectedTags.includes(MCap.H) && data?.meta?.mcap === MCap.H ) ||
					(selectedTags.includes(MCap.S) && data?.meta?.mcap === null ) 
				}
			}
			else if (childTab === TAB.BOND && data) {
				if (selectedTags.includes(AssetSubType.GB)) {
					return data?.subt === AssetSubType.GB || data?.subt === AssetSubType.GBO;
				}
				else {
					return data?.subt === AssetSubType.CB; 
				}
			}
		});

		
		setFilterByTag([ ...filterDataByTag ]);
	};

	useEffect(
		() => {
			filterInstrumentsByTabs();
		},
		[ childTab, instruments, selectedMembers, selectedCurrency ]
	);

	useEffect(
		() => {
			filterInstrumentsByTags();
		},
		[ selectedTags, selectedSubtTags ]
	);

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
				{childTab === TAB.MF &&
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
