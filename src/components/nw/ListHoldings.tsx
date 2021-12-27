import { Empty, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import { NWContext } from './NWContext';
import { doesHoldingMatch } from './nwutils';

import CategoryColumn from './CategoryColumn';
import AmountColumn from './AmountColumn';
import MemberAndValuation from './MemberAndValuation';

require('./ListHoldings.less');

interface ListHoldingsProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
}

export default function ListHoldings({ data, changeData, categoryOptions, subCategoryOptions }: ListHoldingsProps) {
	const { selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const [ dataSource, setDataSource ] = useState<Array<any>>([]);

	const expandedRow = (i: number) => {
		const columns = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
    ];

    const data = [{
			key: i,
			date: '2014-12-24 23:12:00',
			name: 'This is production name',
		}];
    return <Table columns={columns} dataSource={data} />;
	};

	const columns = [
		{ title: 'Category', dataIndex: 'cat', key: 'cat' },
		{ title: 'Amount', dataIndex: 'amt', key: 'amt' },
		{ title: 'Family Member', key: 'fid', dataIndex: 'fid' }
	];

	useEffect(
		() => {
			let dataSource: Array<any> = [];
			data.map((holding: HoldingInput, index: number) => {
				if (doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
					dataSource.push({
						key: index,
						cat: <CategoryColumn data={data} changeData={changeData} categoryOptions={categoryOptions} subCategoryOptions={subCategoryOptions} record={holding}/>,
						amt: <AmountColumn data={data} changeData={changeData} record={holding}/>,
						fid: <MemberAndValuation data={data} changeData={changeData} record={holding} index={index}/>
			});
		}})
			setDataSource([ ...dataSource ]);
		},
		[ data, selectedMembers, selectedCurrency ]
	);

	return dataSource.length ? (
		<Table
			className="property-nested-table"
			columns={columns.filter(col => {
				if(col.dataIndex === 'cat') return categoryOptions;
				else return col}) }
			expandable={{
				expandedRowRender: (record) => expandedRow(record.key),
			}}
			dataSource={dataSource}
			size="small"
		/>
	) : (
		<Empty description={<p>No property found.</p>} />
	);
}
