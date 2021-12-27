import { Col, Empty, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import { NWContext, TAB } from './NWContext';
import { doesHoldingMatch } from './nwutils';
import CategoryColumn from './CategoryColumn';
import AmountColumn from './AmountColumn';
import MemberAndValuation from './MemberAndValuation';
import DateColumn from './DateColumn';
import TextInput from '../form/textinput';
require('./ListHoldings.less');

interface ListHoldingsProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
}

export default function ListHoldings({ data, changeData, categoryOptions, subCategoryOptions }: ListHoldingsProps) {
	const { selectedMembers, selectedCurrency, childTab }: any = useContext(NWContext);
	const { PM, NPS, CRYPTO, INS } = TAB;
	const [ dataSource, setDataSource ] = useState<Array<any>>([]);

	const changeName = (val: any, i: number) => {
		data[i].name = val;
		changeData([ ...data ]);
	};

	const hasName = (childTab: string) => ![ PM, NPS, CRYPTO, INS ].includes(childTab);

	const expandedRow = (i: number) => {
		const columns: any = [];

		const expandedRowData: any = {
			key: i,
			date: <DateColumn data={data} changeData={changeData} record={data[i]} />,
			label: hasName(childTab) && (
				<Col>
					<TextInput
						pre=""
						changeHandler={(val: string) => changeName(val, i)}
						value={data[i].name as string}
						size={'middle'}
						width={200}
					/>
				</Col>
			)
		};

		Object.keys(expandedRowData).map((title) => {
			if (title === 'date') {
				expandedRowData.date ? columns.push({ title: 'Date', dataIndex: 'date', key: 'date' }) : null;
			}
			if (title === 'label') {
				expandedRowData.label ? columns.push({ title: 'Label', dataIndex: 'label', key: 'label' }) : null;
			}
		});

		return columns.length ? <Table columns={columns} dataSource={[ expandedRowData ]} /> : null;
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
						cat: (
							<CategoryColumn
								data={data}
								changeData={changeData}
								categoryOptions={categoryOptions}
								subCategoryOptions={subCategoryOptions}
								record={holding}
							/>
						),
						amt: <AmountColumn data={data} changeData={changeData} record={holding} />,
						fid: <MemberAndValuation data={data} changeData={changeData} record={holding} index={index} />
					});
				}
			});
			setDataSource([ ...dataSource ]);
		},
		[ data, selectedMembers, selectedCurrency ]
	);

	return dataSource.length ? (
		<Table
			className="property-nested-table"
			columns={columns.filter((col) => {
				if (col.dataIndex === 'cat') return categoryOptions;
				else return col;
			})}
			expandable={{
				expandedRowRender: (record) => expandedRow(record.key)
			}}
			dataSource={dataSource}
			size="small"
		/>
	) : (
		<Empty description={<p>No property found.</p>} />
	);
}
