import { Button, Col, Empty, Row, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import { NWContext, TAB } from './NWContext';
import {
	calculateValuation,
	doesHoldingMatch,
	getFamilyOptions,
	hasDate,
	hasminimumCol,
	hasName,
	hasPF,
	hasQtyWithRate,
	hasRate
} from './nwutils';
import Category from './Category';
import Amount from './Amount';
import DateColumn from './DateColumn';
import { toHumanFriendlyCurrency } from '../utils';
import { UserOutlined, DeleteOutlined } from '@ant-design/icons';
import SelectInput from '../form/selectinput';
import { calculateCompundingIncome } from './valuationutils';
import { AppContext } from '../AppContext';
import Rate from './Rate';
import Contribution from './Contribution';
import Comment from './Comment';
require('./ListHoldings.less');

interface ListHoldingsProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	fields: any;
}
export default function ListHoldings({ data, changeData, categoryOptions, fields }: ListHoldingsProps) {
	const { selectedMembers, selectedCurrency, childTab, allFamily, npsData }: any = useContext(NWContext);
	const { ratesData, discountRate, userInfo }: any = useContext(AppContext);
	const { PM, NPS, CRYPTO, INS, VEHICLE, LENT, LOAN, PF, OTHER, P2P, LTDEP } = TAB;
	const [ dataSource, setDataSource ] = useState<Array<any>>([]);

	const allColumns: any = {
		type: { title: fields.type, dataIndex: 'type', key: 'type' },
		amount: { title: hasQtyWithRate(childTab) ? fields.qty : fields.amount, dataIndex: 'amount', key: 'amount' },
		rate: { title: fields.rate, dataIndex: 'rate', key: 'rate' },
		val: { title: 'Valuation', key: 'val', dataIndex: 'val' },
		date: { title: fields.date, dataIndex: 'date', key: 'date' },
		label: { title: fields.name, dataIndex: 'label', key: 'label' },
		qty: { title: fields.qty, dataIndex: 'qty', key: 'qty' },
		del: { title: '', dataIndex: 'del', key: 'del', align: 'left' },
		mat: { title: 'Maturity Amount', key: 'mat', dataIndex: 'mat' }
	};
	let defaultColumns: Array<string> = [];
	let expandedColumns: Array<string> = [];
	if (hasminimumCol(childTab)) {
		defaultColumns = [ 'amount', 'label', 'del' ];
		expandedColumns = Object.keys(getFamilyOptions(allFamily)).length > 1 ? [ 'fid' ] : [];
	} else if (childTab === OTHER) {
		defaultColumns = [ 'amount', 'type', 'del' ];
		expandedColumns = [ 'label', 'fid' ];
	} else if (childTab === PM || childTab === CRYPTO || childTab === NPS) {
		defaultColumns = [ 'amount', 'val', 'del' ];
		expandedColumns = [ 'type', 'fid' ];
	} else if (childTab === VEHICLE) {
		defaultColumns = [ 'amount', 'val', 'del' ];
		expandedColumns = [ 'label', 'type', 'date', 'fid' ];
	} else if (childTab === LENT || childTab === LTDEP || childTab === P2P) {
		defaultColumns = [ 'amount', 'val', 'del' ];
		expandedColumns = [ 'label', 'type', 'date', 'rate', 'mat', 'fid' ];
	} else if (childTab === PF) {
		defaultColumns = [ 'amount', 'val', 'del' ];
		expandedColumns = [ 'type', 'rate', 'qty', 'fid' ];
	} else if (childTab === LOAN) {
		defaultColumns = [ 'amount', 'val', 'del' ];
		expandedColumns = [ 'label', 'date', 'rate', 'fid' ];
	} else if (childTab === INS) {
		defaultColumns = [ 'amount', 'val', 'del' ];
		expandedColumns = [ 'type', 'date', 'rate', 'fid' ];
	}

	const changeOwner = (ownerKey: string, i: number) => {
		data[i].fId = ownerKey;
		changeData([ ...data ]);
	};

	const removeHolding = (i: number) => {
		data.splice(i, 1);
		changeData([ ...data ]);
	};

	const getAllData = (holding: HoldingInput, i: number, valuation?: number) => {
		if (!holding) return;
		const dataToRender: any = {
			key: i,
			amount: <Amount data={data} changeData={changeData} record={holding} />,
			type: categoryOptions && (
				<Category
					category={''}
					categoryOptions={categoryOptions}
					subCategory={''}
					record={holding}
					changeData={changeData}
					data={data}
				/>
			),
			val: valuation && toHumanFriendlyCurrency(valuation, selectedCurrency),
			del: <Button type="link" onClick={() => removeHolding(i)} danger icon={<DeleteOutlined />} />,
			qty: hasPF(childTab) && <Contribution changeData={changeData} data={data} record={holding} pre={''} />,
			mat: toHumanFriendlyCurrency(calculateCompundingIncome(holding).maturityAmt, selectedCurrency)
		};

		if (hasDate(childTab, holding.subt as string) && expandedColumns.includes('date')) {
			dataToRender.date = <DateColumn data={data} changeData={changeData} record={holding} pre={''} />;
		}
		if (hasRate(childTab) || (holding.subt !== 'L' && childTab === INS)) {
			dataToRender.rate = <Rate changeData={changeData} record={holding} pre={''} data={data} />;
		}
		if (Object.keys(getFamilyOptions(allFamily)).length > 1) {
			dataToRender.fid = (
				<SelectInput
					pre=""
					value={holding.fId}
					options={getFamilyOptions(allFamily)}
					changeHandler={(key: string) => changeOwner(key, i)}
				/>
			);
		}
		if (hasName(childTab)) {
			dataToRender.label = <Comment changeData={changeData} data={data} record={holding} pre={''} />;
		}
		return dataToRender;
	};

	const expandedRow = (i: number) => {
		const dataSource = getAllData(data[i], i);
		if (!dataSource) return;
		return (
			<Row gutter={[ { xs: 0, sm: 10, md: 30 }, { xs: 20, sm: 10, md: 20 } ]}>
				{expandedColumns.map((item: any) => {
					return (
						dataSource[item] && (
							<Col xs={24} sm={12} md={8} key={item}>
								<Row gutter={[ 10, 5 ]}>
									<Col xs={24}>{item === 'fid' ? <UserOutlined /> : allColumns[item].title}</Col>
									<Col xs={24}>{dataSource[item]}</Col>
								</Row>
							</Col>
						)
					);
				})}
			</Row>
		);
	};

	const columns = defaultColumns.map((col: string) => allColumns[col]);

	useEffect(
		() => {
			let dataSource: Array<any> = [];
			data.map((holding: HoldingInput, index: number) => {
				if (doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
					const valuation = calculateValuation(
						childTab,
						holding,
						userInfo,
						discountRate,
						ratesData,
						selectedCurrency,
						npsData
					);
					dataSource.push(getAllData(holding, index, valuation));
				}
			});
			setDataSource([ ...dataSource ]);
		},
		[ data, selectedMembers, selectedCurrency, discountRate ]
	);

	return dataSource.length ? (
		<Table
			className="list-holdings"
			columns={columns}
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
