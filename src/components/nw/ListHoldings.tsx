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
import NumberInput from '../form/numberinput';
require('./ListHoldings.less');

interface ListHoldingsProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
}

export default function ListHoldings({ data, changeData, categoryOptions, subCategoryOptions }: ListHoldingsProps) {
	const { selectedMembers, selectedCurrency, childTab }: any = useContext(NWContext);
	const { PM, NPS, CRYPTO, INS, VEHICLE, LENT, LOAN, PF } = TAB;
	const [ dataSource, setDataSource ] = useState<Array<any>>([]);

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

	const hasDate = (childTab: string) => [ VEHICLE, LENT, LOAN, INS ].includes(childTab);
	const hasName = (childTab: string) => ![ PM, NPS, CRYPTO, INS ].includes(childTab);
	const hasPF = (childTab: string) => [ PF ].includes(childTab);

	const expandedRow = (i: number) => {
		const columns: any = [
			{ title: 'Date', dataIndex: 'date', key: 'date' },
			{ title: 'Label', dataIndex: 'label', key: 'label' },
			{ title: 'Contribution Per Year', dataIndex: 'qty', key: 'qty' }
		];

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
			),
			qty: hasPF(childTab) && (
				<Col>
					<NumberInput
						isBasic={true}
						pre=""
						value={data[i].qty as number}
						changeHandler={(val: number) => changeQty(val, i)}
						currency={data[i].curr as string}
						step={1}
						isBasic
					/>
				</Col>
			)
		};

		return (
			<Table
				columns={columns.filter((col: any) => {
					if (col.dataIndex === 'date') return hasDate(childTab);
					if (col.dataIndex === 'label') return hasName(childTab);
					if (col.dataIndex === 'qty') return hasPF(childTab);
				})}
				dataSource={[ expandedRowData ]}
			/>
		);
	};

	const columns = [
		{ title: 'Category', dataIndex: 'cat', key: 'cat' },
		{ title: 'Amount', dataIndex: 'amt', key: 'amt' },
		{ title: 'Valuation', key: 'fid', dataIndex: 'fid' }
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
		<Empty description={<p>No data found.</p>} />
	);
}
