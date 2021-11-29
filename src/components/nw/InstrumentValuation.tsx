import { Empty, Table } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import { NWContext } from './NWContext';
import Holding from './Holding';
import { doesHoldingMatch } from './nwutils';
import { toHumanFriendlyCurrency } from '../utils';
import { COLORS } from '../../CONSTANTS';
import { FilterTwoTone } from '@ant-design/icons';
import { AppContext } from '../AppContext';

export default function InstrumentValuation() {
	const { insData }: any = useContext(AppContext);
	const { instruments, setInstruments, selectedMembers, selectedCurrency, totalInstruments }: any = useContext(
		NWContext
	);
	const [ filteredInstruments, setFilteredInstruments ] = useState<Array<any>>([ ...instruments ]);
	const [ nameFilterValues, setNameFilterValues ] = useState<Array<any>>([ {} ]);
	const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});
	const [ total, setTotal ] = useState<number>(totalInstruments);

	const delRecord = (id: string) => setInstruments([ ...instruments.filter((record: any) => record.id !== id) ]);

	const columns = [
		{
			title: (
				<strong
					style={{
						color: COLORS.GREEN
					}}
				>
					Total ~ {toHumanFriendlyCurrency(total, selectedCurrency)}
				</strong>
			),
			key: 'id',
			filterIcon: <FilterTwoTone twoToneColor={filteredInfo?.id ? COLORS.GREEN : COLORS.DEFAULT} style={{ fontSize: 20 }} />,
			filteredValue: filteredInfo.id || null,
			filters: nameFilterValues,
			onFilter: (values: Array<string>, record: any) => values.indexOf(record.id) > -1,
			render: (record: any) => {
				return <Holding key={record.id} holding={record as HoldingInput} onDelete={delRecord} showPrice />
			}
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
				if(doesHoldingMatch(instrument, selectedMembers, selectedCurrency)){
					return true;
					// console.log(instrument, instrument.subt , childTab, instrument.type);
					// return instrument.subt === childTab
				}
			});
			setFilteredInstruments([ ...filteredData ]);
		},
		[ instruments, selectedMembers, selectedCurrency, filteredInfo ]
	);

	useEffect(
		() => {
			let filteredNames: Array<any> = [];
			let ids: Set<string> = new Set();
			instruments.forEach((instrument: HoldingInput) => {
				if(!ids.has(instrument.id))
					filteredNames.push(getFilterItem(instrument.id as string, instrument.name as string));
				ids.add(instrument.id);
			});
			setNameFilterValues([ ...filteredNames ]);
		},
		[ instruments ]
	);

	useEffect(
		() => {
			let total = 0;
			filteredInstruments.forEach(
				(instrument: HoldingInput) =>
					(total += instrument.qty * (insData[instrument.id] ? insData[instrument.id].price : 0))
			);
			setTotal(total);
		},
		[ filteredInstruments ]
	);

	return instruments.length ? (
		<Fragment>
			<p style={{ textAlign: 'center' }}>
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
			) : null}
		</Fragment>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
