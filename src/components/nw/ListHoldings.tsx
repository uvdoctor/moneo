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
}

export default function ListHoldings({ data, changeData, categoryOptions, subCategoryOptions }: ListHoldingsProps) {
	const { selectedMembers, selectedCurrency, childTab, activeTab, tabs }: any = useContext(NWContext);
	const { PM, NPS, CRYPTO, INS, VEHICLE, LENT, LOAN, PF } = TAB;
	const [ dataSource, setDataSource ] = useState<Array<any>>([]);
	const { fields } = tabs[activeTab].children[childTab];
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

	if (childTab === 'Deposits') {
		defaultColumns = [ 'cat', 'amt', 'rate', 'fid' ];
		expandedColumns = [ 'date', 'label', 'qty' ];
	} else {
		defaultColumns = [ 'cat', 'amt', 'rate', 'fid' ];
		expandedColumns = [ 'date', 'label', 'qty' ];
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

	const expandedRow = (i: number) => {
		const columns: any = expandedColumns.map((col: string) => allColumns[col]);

		const expandedRowData: any = {
			key: i,
			date: <DateColumn data={data} changeData={changeData} record={data[i]} />,
			label: hasName(childTab) && (
				<TextInput
					pre=""
					changeHandler={(val: string) => changeName(val, i)}
					value={data[i].name as string}
					size={'middle'}
					style={{ width: 200 }}
				/>
			),
			qty: hasPF(childTab) && (
				<NumberInput
					pre=""
					value={data[i].qty as number}
					changeHandler={(val: number) => changeQty(val, i)}
					currency={data[i].curr as string}
				/>
			)
		};

		return (
			<Table
				columns={columns.filter((col: any) => {
					if (col.dataIndex === 'date') return hasDate(childTab, data[i]);
					if (col.dataIndex === 'label') return hasName(childTab);
					if (col.dataIndex === 'qty') return hasPF(childTab);
				})}
				dataSource={[ expandedRowData ]}
			/>
		);
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
					dataSource.push({
						key: index,
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
