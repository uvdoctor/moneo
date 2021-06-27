import { Badge, Empty, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { HoldingInput, InsSubType, InsType } from '../../api/goals';
import { ALL_FAMILY } from './FamilyInput';
import { NWContext } from './NWContext';
import Holding from './Holding';
import { getInsSubTypeName } from './nwutils';

export default function InstrumentValuation() {
	const { holdings, selectedMembers, selectedCurrency, allFamily, currencyList }: any = useContext(NWContext);
	const [ filteredInstruments, setFilteredInstruments ] = useState<Array<any>>([]);
    const [ typeFilterValues, setTypeFilterValues ] = useState<Array<any>>([ {} ]);
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
			render: (record: any) => 
				<Holding holding={record as HoldingInput} onDelete={delRecord} />
		},
        {
            title: 'Type',
            key: 'type',
			filteredValue: filteredInfo.name || null,
			filters: typeFilterValues,
            onFilter: (value: Array<any>, record: any) => record.type.includes(value),
            render: (record: any) => <Badge count={getInsSubTypeName(record.type, record.subt)} />
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
			Object.keys(allFamily).length <= 1 ||
			selectedMembers.includes(ALL_FAMILY) ||
			Object.keys(allFamily).length === selectedMembers.length
		) {
			if (Object.keys(currencyList).length === 1) return holdings.instruments;
			return holdings.instruments.filter((instrument: HoldingInput) => instrument.curr === selectedCurrency);
		}
		return holdings.instruments.filter(
			(instrument: HoldingInput) =>
				selectedMembers.includes(instrument.fIds[0]) && instrument.curr === selectedCurrency
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
			setFilteredInstruments([ ...filteredData ]);
		},
		[ holdings.instruments.length, selectedMembers, selectedCurrency ]
	);

    const hasSubType = (filterItems: Array<any>, subType: string) => {
        for(let i = 0; i < filterItems.length; i++) {
            if(filterItems[i].value === subType) return true;
        }
        return false;
    };

	useEffect(
		() => {
			let filteredTypes: Array<any> = [];
			let filteredNames: Array<any> = [];
			filteredInstruments.forEach((instrument: HoldingInput) => {
                let typeName: string = getInsSubTypeName(instrument.type as InsType, instrument.subt as InsSubType);
                if(!hasSubType(filteredTypes, typeName))
				    filteredTypes.push(getFilterItem(typeName));
				filteredNames.push(getFilterItem(instrument.name as string));
			});
            setTypeFilterValues([...filteredTypes]);
			setNameFilterValues([ ...filteredNames ]);
		},
		[ filteredInstruments ]
	);

	return filteredInstruments.length ? (
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
	);
}
