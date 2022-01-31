import { Button, Col, Empty, Row, Table } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { PropertyInput, PropertyType } from '../../api/goals';
import { NWContext } from './NWContext';
import { doesPropertyMatch, getFamilyOptions } from './nwutils';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { presentMonth, presentYear, toHumanFriendlyCurrency } from '../utils';
import { getCompoundedIncome } from '../calc/finance';
import { calculateDifferenceInYears, calculateProperty } from './valuationutils';
import Owner from './Owner';
import Category from './Category';
import Amount from './Amount';
import DateColumn from './DateColumn';
import Rate from './Rate';
import Comment from './Comment';
import Pincode from './Pincode';
import MarketValue from './MarketValue';
import Address from './Address';
import Residential from './Residential';
require('./ListProperties.less');

interface ListPropertiesProps {
	data: Array<PropertyInput>;
	changeData: Function;
	categoryOptions: any;
	fields: any;
}

export default function ListProperties({ data, changeData, categoryOptions, fields }: ListPropertiesProps) {
	const { selectedCurrency, allFamily, selectedMembers }: any = useContext(NWContext);
	const [ indexForMv, setIndexForMv ] = useState<number | null>(null);
	const [ dataSource, setDataSource ] = useState<Array<any>>([]);
	const [ isEditMode, setIsEditMode ] = useState<boolean>(false);
	const today = new Date();
	const removeHolding = (i: number) => {
		data.splice(i, 1);
		changeData([ ...data ]);
	};

	useEffect(
		() => {
			if (indexForMv !== null) {
				const duration = calculateDifferenceInYears(
					today.getMonth() + 1,
					today.getFullYear(),
					data[indexForMv].purchase?.month as number,
					data[indexForMv].purchase?.year as number
				);

				data[indexForMv].mv = Math.round(
					getCompoundedIncome(
						data[indexForMv].rate,
						data[indexForMv].purchase?.amt as number,
						duration
					)
				);
				data[indexForMv].mvm = today.getMonth() + 1;
				data[indexForMv].mvy = today.getFullYear();
				changeData([ ...data ]);
				setIndexForMv(null);
			}
		},
		[ changeData, data, indexForMv ]
	);

	const expandedRow = (i: number) => {
		if (!data[i]) return;
		return (
			<Fragment>
				<Row gutter={[ 0, 10 ]}>
					{!(data[i].type === PropertyType.COMM || data[i].type === PropertyType.P) && (
						<Col xs={24} md={12}>
							<Residential changeData={changeData} record={data[i]} data={data} />
						</Col>
					)}
				</Row>
				<Row gutter={[ { xs: 0, sm: 10, md: 30 }, { xs: 20, sm: 10, md: 0 } ]}>
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 0, 10 ]}>
							<Col xs={24}>
								<strong>Purchase</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<Amount
									changeData={changeData}
									record={data[i]}
									fields={fields}
									data={data}
									setIndexForMv={setIndexForMv}
									index={i}
								/>
							</Col>
							<Col xs={24}>
								<DateColumn
									changeData={changeData}
									record={data[i]}
									data={data}
									pre={fields.date}
									setIndexForMv={setIndexForMv}
									index={i}
								/>
							</Col>
							<Col>
								<Rate
									changeData={changeData}
									record={data[i]}
									pre={fields.rate}
									data={data}
									setIndexForMv={setIndexForMv}
									index={i}
								/>
							</Col>
						</Row>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[ 0, 10 ]}>
							<Col xs={24}>
								<strong>{fields.address}</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<Address changeData={changeData} record={data[i]} pre={''} data={data} />
							</Col>
							<Col xs={24}>
								<Pincode changeData={changeData} record={data[i]} pre={''} data={data} />
							</Col>
							<Col xs={24}>
								<strong>{fields.name}</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<Comment changeData={changeData} record={data[i]} data={data} pre={''} />
							</Col>
						</Row>
					</Col>
					{Object.keys(getFamilyOptions(allFamily)).length > 1 && (
						<Col xs={24} sm={12} md={8}>
							<Row gutter={[ 0, 10 ]}>
								<Col xs={24}>
									<strong>{fields.owner}</strong>
									<hr />
								</Col>
								<Owner changeData={changeData} data={data} record={data[i]} />
							</Row>
						</Col>
					)}
				</Row>
			</Fragment>
		);
	};

	const columns = [
		{ title: fields.type, dataIndex: 'type', key: 'type' },
		{ title: 'Valuation', key: 'val', dataIndex: 'val' }
	];

	useEffect(
		() => {
			let dataSource: Array<any> = [];
			setDataSource([ ...[] ]);
			for (let i = 0; i < data.length; ++i) {
				if (!doesPropertyMatch(data[i], selectedMembers, selectedCurrency)) continue;
				const valuation = calculateProperty(data[i]);
				if (valuation > 0 && valuation !== data[i].mv) {
					data[i].mv = valuation;
					data[i].mvm = presentMonth;
					data[i].mvy = presentYear;
					changeData([ ...data ]);
				}
				dataSource.push({
					key: i,
					type: categoryOptions && (
						<Category
							categoryOptions={categoryOptions}
							record={data[i]}
							changeData={changeData}
							data={data}
						/>
					),
					val: (
						<Row justify="space-between" align="middle">
							<Col>
								<Row align={isEditMode ? 'top' : 'middle'}>
									<Col>
										{isEditMode ? (
											<MarketValue
												changeData={changeData}
												record={data[i]}
												pre={''}
												data={data}
											/>
										) : (
											toHumanFriendlyCurrency(Number(data[i].mv), data[i].curr)
										)}
									</Col>
									<Col>
										<Button
											type="link"
											icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
											onClick={() => (isEditMode ? setIsEditMode(false) : setIsEditMode(true))}
										/>
									</Col>
								</Row>
							</Col>
							<Col>
								<Button type="link" onClick={() => removeHolding(i)} danger>
									<DeleteOutlined />
								</Button>
							</Col>
						</Row>
					)
				});
			}
			setDataSource([ ...dataSource ]);
		},
		[ data, selectedMembers, selectedCurrency, isEditMode ]
	);

	return dataSource.length ? (
		<Table
			className="property-nested-table"
			columns={columns}
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
