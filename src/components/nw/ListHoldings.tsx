import { Empty, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import { NWContext, TAB } from './NWContext';
import { doesHoldingMatch } from './nwutils';
import Category from './Category';
import Amount from './Amount';
import MemberAndValuation from './MemberAndValuation';
import DateColumn from './DateColumn';
import TextInput from '../form/textinput';
import NumberInput from '../form/numberinput';
require('./ListHoldings.less');

interface ListHoldingsProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
	fields: any;
}

export default function ListHoldings({
	data,
	changeData,
	categoryOptions,
	subCategoryOptions,
	fields
}: ListHoldingsProps) {
	const { selectedMembers, selectedCurrency, childTab }: any = useContext(NWContext);
	const { PM, NPS, CRYPTO, INS, VEHICLE, LENT, LOAN, PF, ANGEL, OTHER, SAV, CREDIT } = TAB;
	const [ dataSource, setDataSource ] = useState<Array<any>>([]);
	const allColumns: any = {
		cat: { title: fields.type, dataIndex: 'cat', key: 'cat' },
		amt: { title: fields.amount, dataIndex: 'amt', key: 'amt' },
		rate: { title: fields.rate, dataIndex: 'rate', key: 'rate' },
		fid: { title: 'Valuation', key: 'fid', dataIndex: 'fid' },
		date: { title: fields.date, dataIndex: 'date', key: 'date' },
		label: { title: fields.name, dataIndex: 'label', key: 'label' },
		qty: { title: fields.qty, dataIndex: 'qty', key: 'qty' }
	};
	let defaultColumns: Array<string> = [];
	let expandedColumns: Array<string> = [];

	const hasminimumCol = (childTab: string) => [ ANGEL, SAV, CREDIT ].includes(childTab);

	if (hasminimumCol(childTab)) {
		defaultColumns = [ 'label', 'fid' ];
	} else if (childTab === OTHER) {
		defaultColumns = [ 'label', 'fid' ];
		expandedColumns = [ 'cat' ];
	} else if (childTab === PM || childTab === CRYPTO || childTab === NPS) {
		defaultColumns = [ 'cat', 'fid' ];
		expandedColumns = [ 'amt' ];
	} else if (childTab === VEHICLE) {
		defaultColumns = [ 'cat', 'fid' ];
		expandedColumns = [ 'label', 'amt', 'date' ];
	} else if (childTab === LENT || childTab === LOAN || childTab === PF) {
		defaultColumns = [ 'cat', 'fid' ];
		expandedColumns = [ 'label', 'amt', 'date', 'rate', 'qty' ];
	} else if (childTab === INS) {
		defaultColumns = [ 'cat', 'fid' ];
		expandedColumns = [ 'date', 'amt', 'rate', 'qty' ];
	}

	const changeName = (val: any, i: number) => {
		data[i].name = val;
		changeData([ ...data ]);
	};

	const changeQty = (qty: number, i: number) => {
		data[i].qty = qty;
		if (hasPF(childTab)) {
			data[i].sm = new Date().getMonth() + 1;
			data[i].sy = new Date().getFullYear();
		}
		changeData([ ...data ]);
	};

	const hasDate = (childTab: string, record: HoldingInput) =>
		[ VEHICLE, LENT, LOAN, INS ].includes(childTab) && record.subt !== 'H';
	const hasName = (childTab: string) => ![ PM, NPS, CRYPTO, INS ].includes(childTab);
	const hasPF = (childTab: string) => [ PF ].includes(childTab);

	const getAllData = (holding: HoldingInput, i: number) => {
		const dataToRender = {
			key: i,
			cat: (
				<Category
					data={data}
					changeData={changeData}
					categoryOptions={categoryOptions}
					subCategoryOptions={subCategoryOptions}
					record={holding}
				/>
			),
			amt: <Amount data={data} changeData={changeData} record={holding} />,
			rate: (hasRate(childTab) || (childTab === INS && holding.subt !== 'L')) && (
				<NumberInput
					pre=""
					min={0}
					max={50}
					value={holding.chg as number}
					changeHandler={(val: number) => changeChg(val, holding)}
					step={0.1}
					unit="%"
				/>
			),
			fid: <MemberAndValuation data={data} changeData={changeData} record={holding} index={i} />,
			label: hasName(childTab) && (
				<TextInput
					pre=""
					changeHandler={(val: string) => changeName(val, i)}
					value={holding.name as string}
					size={'middle'}
					style={{ width: 200 }}
				/>
			)
		};
		if (hasDate(childTab, data[i])) {
			// @ts-ignore
			dataToRender.date = <DateColumn data={data} changeData={changeData} record={holding} />;
		}
		if (hasPF(childTab)) {
			// @ts-ignore
			dataToRender.qty = (
				<NumberInput
					pre=""
					value={holding.qty as number}
					changeHandler={(val: number) => changeQty(val, i)}
					currency={holding.curr as string}
				/>
			);
		}
		return dataToRender;
	};

	const expandedRow = (i: number) => {
		const columns: any = expandedColumns.map((col: string) => allColumns[col]);
		const expandedRowData: any = getAllData(data[i], i);

		return <Table columns={columns} dataSource={[ expandedRowData ]} />;
	};

	const changeChg = (chg: number, record: HoldingInput) => {
		record.chg = chg;
		changeData([ ...data ]);
	};

	const columns = defaultColumns.map((col: string) => allColumns[col]);

	const hasRate = (childTab: string) => [ PF, LENT, LOAN ].includes(childTab);

	useEffect(
		() => {
			let dataSource: Array<any> = [];
			data.map((holding: HoldingInput, index: number) => {
				if (doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
					dataSource.push(getAllData(holding, index));
				}
			});
			setDataSource([ ...dataSource ]);
		},
		[ data, selectedMembers, selectedCurrency ]
	);

	return dataSource.length ? (
		<Table
			columns={columns.filter((col) => {
				if (col.dataIndex === 'cat') return categoryOptions;
				else return col;
			})}
			expandable={
				expandedColumns.length ? (
					{
						expandedRowRender: (record) => expandedRow(record.key)
					}
				) : (
					{}
				)
			}
			dataSource={dataSource}
			size="small"
		/>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
