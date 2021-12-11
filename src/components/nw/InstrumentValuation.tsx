import { Badge, Empty, Table, Tag } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { NWContext, TAB } from './NWContext';
import Holding from './Holding';
import { doesHoldingMatch, getAssetTypes, getColourForAssetType, getMarketCap, getFixedCategories } from './nwutils';
import { toHumanFriendlyCurrency } from '../utils';
import { COLORS } from '../../CONSTANTS';
import { FilterTwoTone } from '@ant-design/icons';
import { AppContext } from '../AppContext';
import { InstrumentInput } from '../../api/goals';

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
	const [ subtTags, setSubtTags ] = useState<any>({});
	const [ selectedSubtTags, setSelectedSubtTags ] = useState<Array<string>>([]);
	const [ totalFilterAmt, setTotalFilterAmt ] = useState<number>(0);

	const bondTags = { CB: 'Corporate Bond', GB: 'Government Bond' };
	const itTags = { REIT: 'Real Estate', InvIT: 'Infrastructure' };
	const tagsData: any = {
		Stocks: { tags: getMarketCap() },
		'Mutual Funds': { tags: getAssetTypes(), subt: { E: getMarketCap(), F: getFixedCategories() } },
		Bonds: { tags: bondTags },
		'Investment Trusts': { tags: itTags }
	};

	const hasTags = (childTab: string) => [ TAB.STOCK, TAB.MF, TAB.BOND, TAB.IT ].includes(childTab);

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
				return <Holding key={record.id} holding={record as InstrumentInput} onDelete={delRecord} showPrice onChange={()=>setTotal()}/>
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
		if (selectedTags.includes('E') && selectedTags.includes('F')) {
			setSubtTags({ ...tagsData[childTab].subt.E, ...tagsData[childTab].subt.F });
			setSelectedSubtTags([
				...Object.keys(tagsData[childTab].subt.E),
				...Object.keys(tagsData[childTab].subt.F)
			]);
			return;
		}
		if (selectedTags.includes('E')) {
			setSubtTags(tagsData[childTab].subt.E);
			setSelectedSubtTags([ ...Object.keys(tagsData[childTab].subt.E) ]);
			return;
		}
		if (selectedTags.includes('F')) {
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
			if (filteredInfo.id) {
				const id = filteredInfo.id.some((item: string) => item === instrument.id);
				if (id) filterAmt += price;
			}
			total += price;
		});
		setTotalFilterInstruments(total);
		!filteredInfo.id ? setTotalFilterAmt(total) : setTotalFilterAmt(filterAmt);
	}

	useEffect(() => {
		setTotal();
	},[ filteredInstruments, filteredInfo ]);

	useEffect(
		() => {
			if (hasTags(childTab)) {
				const tags = tagsData[childTab].tags;
				tags ? setTags(tags) : setTags({});
			}
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
				if (childTab === TAB.MF && instrument.id === "INF") return instrument.id;
				else if (childTab === TAB.STOCK) return instrument.id;
			} 
			if (data && doesHoldingMatch(instrument, selectedMembers, selectedCurrency)) {		
				if (childTab === TAB.IT) return data.itype === 'InvIT' || data.itype === 'REIT';
				if (childTab === TAB.MF) return instrument.id.startsWith('INF') && !data.itype;
				else if (childTab === TAB.STOCK) return data.subt === 'S' && !instrument.id.startsWith('INF');
				else if (childTab === TAB.BOND) return [ 'CB', 'GB', 'GBO' ].includes(data.subt) && !data.itype; 
				else if (childTab === TAB.GOLDB) return data.subt === 'GoldB';
				else if (childTab === TAB.ETF) return data.itype === 'ETF';
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
						 (selectedSubtTags.includes('CB') && (data.subt === 'CB')) || 
						 (selectedSubtTags.includes('I') && (data.type === 'F' && data.subt === 'I')) || 
						(selectedSubtTags.includes('GovB') && (data.subt === 'GB' || data.subt === 'GBO')) || 
						(selectedSubtTags.includes('IF') && (data.subt === 'HB' && data.mftype === 'I')) ||
						(selectedSubtTags.includes('FMP') && (data.subt === 'HB' && data.mftype === 'C')) ||
						(selectedSubtTags.includes('LF') && (data.subt === 'L')) 
					}
				}
			} 
			else if (childTab === TAB.STOCK) {
				if(data && data?.meta) {
					return (selectedSubtTags.includes('L') && data.meta.mcap === "L" ) || 
					(selectedSubtTags.includes('M') && data.meta.mcap === "M" ) ||
					(selectedSubtTags.includes('H') && data.meta.mcap === "H" ) ||
					(selectedSubtTags.includes('S') && data.meta.mcap === null ) 
				}
			}
			else if (childTab === TAB.BOND && data) {
				if (selectedTags.includes('GB')) return data?.subt === 'GB' || data?.subt === 'GBO';
				return selectedTags.indexOf(data?.subt as string) > -1;
			} else if (childTab === TAB.IT) return selectedTags.indexOf(data && data?.itype as string) > -1;
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
