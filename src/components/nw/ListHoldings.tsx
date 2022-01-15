import { Col, Empty, Row, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import { NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from './NWContext';
import { doesHoldingMatch, getFamilyOptions, hasminimumCol, hasName, hasPF, hasQtyWithRate } from './nwutils';
import Category from './Category';
import Amount from './Amount';
import MemberAndValuation from './Valuation';
import DateColumn from './DateColumn';
import TextInput from '../form/textinput';
import NumberInput from '../form/numberinput';
import { isMobileDevice, toHumanFriendlyCurrency } from '../utils';
import { useFullScreenBrowser } from 'react-browser-hooks';
import { UserOutlined } from '@ant-design/icons';
import SelectInput from '../form/selectinput';
import Duration from './Duration';
import Interest from './Interest';
import { calculateCompundingIncome } from './valuationutils';
require('./ListHoldings.less');

interface ListHoldingsProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	fields: any;
}
export default function ListHoldings({ data, changeData, categoryOptions, fields }: ListHoldingsProps) {
	const { selectedMembers, selectedCurrency, childTab, allFamily }: any = useContext(NWContext);
	const { PM, NPS, CRYPTO, INS, VEHICLE, LENT, LOAN, PF, OTHER, P2P } = TAB;
	const [ dataSource, setDataSource ] = useState<Array<any>>([]);
	const fsb = useFullScreenBrowser();
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
	if (hasminimumCol(childTab)) {
		defaultColumns = [ 'label', 'fid' ];
	} else if (childTab === OTHER) {
		defaultColumns = [ 'cat', 'fid' ];
		expandedColumns = [ 'label' ];
	} else if (childTab === PM || childTab === CRYPTO || childTab === NPS) {
		defaultColumns = [ 'cat', 'fid' ];
		expandedColumns = [ 'amt' ];
	} else if (childTab === VEHICLE) {
		defaultColumns = [ 'cat', 'fid' ];
		expandedColumns = [ 'label', 'amt', 'date' ];
	} else if (childTab === LENT || childTab === PF) {
		defaultColumns = [ 'cat', 'fid' ];
		expandedColumns = [ 'label', 'amt', 'date', 'rate', 'qty' ];
	} else if (childTab === LOAN) {
		defaultColumns = [ 'label', 'fid' ];
		expandedColumns = [ 'amt', 'date', 'rate' ];
	} else if (childTab === INS) {
		defaultColumns = [ 'cat', 'fid' ];
		expandedColumns = [ 'date', 'amt', 'rate', 'qty' ];
	} else if (childTab === P2P) {
		defaultColumns = [ 'label', 'fid' ];
		expandedColumns = [ 'amt', 'date', 'rate', 'qty' ];
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

	const changeOwner = (ownerKey: string, i: number) => {
		data[i].fId = ownerKey;
		changeData([ ...data ]);
	};

	const hasDate = (childTab: string, record: HoldingInput) =>
		[ VEHICLE, LENT, LOAN, INS, P2P ].includes(childTab) && record.subt !== 'H';

	const getAllData = (holding: HoldingInput, i: number) => {
		const dataToRender = {
			key: i,
			cat: categoryOptions && (
				<Category data={data} changeData={changeData} categoryOptions={categoryOptions} record={holding} />
			),
			fid: <MemberAndValuation data={data} changeData={changeData} record={holding} index={i} />,
			label: (
				<TextInput
					pre=""
					changeHandler={(val: string) => changeName(val, i)}
					value={holding.name as string}
					size={'middle'}
					style={{ width: isMobileDevice(fsb) ? 120 : 200 }}
				/>
			)
		};
		return dataToRender;
	};

	const expandedRow = (i: number) => {
		return (
			<Row gutter={[ { xs: 0, sm: 10, md: 30 }, { xs: 20, sm: 10, md: 10 } ]}>
				{hasName(childTab) &&
				expandedColumns.includes('label') && (
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 10, 0 ]}>
							<Col>{fields.name}</Col>
							<Col>
								<Row gutter={[ 10, 0 ]}>
									<Col>
										<TextInput
											pre=""
											changeHandler={(val: string) => changeName(val, i)}
											value={data[i].name as string}
											size={'middle'}
											style={{ width: isMobileDevice(fsb) ? 120 : 200 }}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{(data[i].subt === 'NBD' || childTab === P2P) && (
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 10, 0 ]}>
							<Col>Interest</Col>
							<Col>
								<Row gutter={[ 10, 0 ]}>
									<Col>
										<Interest
											value={String(data[i].chgF)}
											onChange={(value: string) => {
												data[i].chgF = Number(value);
												changeData([ ...data ]);
											}}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{expandedColumns.includes('amt') && (
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 10, 0 ]}>
							<Col>{hasQtyWithRate(childTab) ? fields.qty : fields.amount}</Col>
							<Col>
								<Row gutter={[ 10, 0 ]}>
									<Col>
										<Amount data={data} changeData={changeData} record={data[i]} />
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{hasDate(childTab, data[i]) &&
				expandedColumns.includes('date') && (
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 10, 0 ]}>
							<Col>{data[i].subt === NATIONAL_SAVINGS_CERTIFICATE ? "Start Date" : fields.date}</Col>
							<Col>
								<Row gutter={[ 10, 0 ]}>
									<Col>
										<DateColumn data={data} changeData={changeData} record={data[i]} />
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{childTab === LENT &&
				data[i].subt === NATIONAL_SAVINGS_CERTIFICATE && (
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 10, 0 ]}>
							<Col>{'Duration'}</Col>
							<Col>
								<Row gutter={[ 10, 0 ]}>
									<Col>
										<Duration data={data} changeData={changeData} record={data[i]} />
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{hasPF(childTab) &&
				expandedColumns.includes('qty') && (
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 10, 0 ]}>
							<Col>{fields.qty}</Col>
							<Col>
								<Row gutter={[ 10, 0 ]}>
									<Col>
										<NumberInput
											pre=""
											value={data[i].qty as number}
											changeHandler={(val: number) => changeQty(val, i)}
											currency={data[i].curr as string}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{hasRate(childTab) &&
				expandedColumns.includes('rate') && (
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 10, 0 ]}>
							<Col>{fields.rate}</Col>
							<Col>
								<Row gutter={[ 10, 0 ]}>
									<Col>
										<NumberInput
											pre=""
											min={0}
											max={50}
											value={data[i].chg as number}
											changeHandler={(val: number) => changeChg(val, data[i])}
											step={0.1}
											unit="%"
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{(childTab === P2P || childTab === LENT) && (
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 10, 0 ]}>
							<Col>Maturity Amount</Col>
							<Col>
								<Row gutter={[ 10, 0 ]}>
									<Col>
										<label>{toHumanFriendlyCurrency(calculateCompundingIncome(data[i]).maturityAmt, selectedCurrency)}</label>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{!hasminimumCol(childTab) && (
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 10, 0 ]}>
							<Col>
								<UserOutlined />
							</Col>
							<Col>
								<Row gutter={[ 10, 0 ]}>
									<Col>
										<SelectInput
											pre=""
											value={data[i].fId ? data[i].fId : ''}
											options={getFamilyOptions(allFamily)}
											changeHandler={(key: string) => changeOwner(key, i)}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
			</Row>
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
					dataSource.push(getAllData(holding, index));
				}
			});
			setDataSource([ ...dataSource ]);
		},
		[ data, selectedMembers, selectedCurrency ]
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
			bordered
		/>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
