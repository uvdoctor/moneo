import { Empty, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import { ALL_FAMILY } from './FamilyInput';
import { NWContext } from './NWContext';

export default function InstrumentValuation() {
    const { holdings, selectedMembers, selectedCurrency, allFamily, currencyList }: any = useContext(NWContext);
    const [ filteredInstruments, setFilteredInstruments ] = useState<Array<any>>([]);
    const [ idFilterValues, setIdFilterValues ] = useState<Array<any>>([ {} ]);
	const [ nameFilterValues, setNameFilterValues ] = useState<Array<any>>([ {} ]);
    const [ filteredInfo, setFilteredInfo ] = useState<any | null>({});

    const columns = [
		{
			title: 'Identifier',
			dataIndex: 'id',
			key: 'id',
			filteredValue: filteredInfo.id || null,
			filters: idFilterValues,
			onFilter: (value: Array<any>, record: any) => record.id.includes(value)
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			filteredValue: filteredInfo.name || null,
			filters: nameFilterValues,
			onFilter: (value: Array<any>, record: any) => record.name.includes(value)
		},
		{
			title: 'Quantity',
			dataIndex: 'qty',
			key: 'qty'
		},
	];

    const getFilterItem = (val: string) => {
		return {
			text: val,
			value: val
		};
	};

    const getDataItem = (id: string, name: string, qty: number) => {
		return {
			key: id,
            id: id,
			name: name,
			qty: '' + qty,
		};
	};

    //@ts-ignore
	const handleChange = (pagination: any, filters: any, sorters: any) => {
		setFilteredInfo(filters);
	};

    const filterByFamilyAndCurrency = () => {
        if(Object.keys(allFamily).length <= 1 
            || selectedMembers.includes(ALL_FAMILY) 
            || Object.keys(allFamily).length === selectedMembers.length) {
            if(Object.keys(currencyList).length === 1) return holdings.instruments;
            return holdings.instruments.filter((instrument: HoldingInput) => instrument.curr === selectedCurrency);
        }
        return holdings.instruments.filter((instrument: HoldingInput) => selectedMembers.includes(instrument.fIds[0]) && instrument.curr === selectedCurrency);
    };

    useEffect(() => {
        if(!holdings.instruments.length) return;
        let filteredData: Array<HoldingInput> = filterByFamilyAndCurrency();
        if(!filteredData.length) {
            setFilteredInstruments([...[]]);
            return;
        }
        let data: Array<any> = [];
        filteredData.forEach((instrument: HoldingInput) => {
            data.push(getDataItem(instrument.id, instrument.name as string, instrument.qty));
        });
        setFilteredInstruments([...data]);
    }, [ holdings.instruments.length, selectedMembers, selectedCurrency ]);
    
    useEffect(() => {
        let filteredIds: Array<any> = [];
        let filteredNames: Array<any> = [];
        filteredInstruments.forEach((instrument: HoldingInput) => {
            filteredIds.push(getFilterItem(instrument.id));
            filteredNames.push(getFilterItem(instrument.name as string));
        });
        setIdFilterValues([...filteredIds]);
        setNameFilterValues([...filteredNames]);
    }, [filteredInstruments]);

    return (
        filteredInstruments.length ? 
            <Table 
                dataSource={filteredInstruments} 
                //@ts-ignore
                columns={columns}
                size="small"
                bordered
                onChange={handleChange}
            /> : 
            <Empty description={<p>No data found.</p>} />
    );
}