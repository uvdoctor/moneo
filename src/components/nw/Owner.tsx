import React, { Fragment, useContext, useState } from 'react';
import { OwnershipInput, PropertyInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tooltip } from 'antd';
import { getDefaultMember, getFamilyOptions } from './nwutils';
import { NWContext } from './NWContext';

interface OwnerProps {
	data?: Array<PropertyInput>;
	owner?: Array<OwnershipInput>;
	changeData: Function;
	record: PropertyInput;
	setOwner?: Function;
}

export default function Owner({ data, changeData, record, owner, setOwner }: OwnerProps) {
	const { allFamily, selectedMembers }: any = useContext(NWContext);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const isListProperties: boolean = setOwner ? false : true;
	const owners = isListProperties ? record.own : owner;

	const ownerPercent = () => {
		let count = 0;
		owners && owners.map((item: any) => (count += item.per));
		return count;
	};

	return (
		<Fragment>
			{owners &&
				owners.map((own: OwnershipInput, i: number) => {
					return (
						<Col key={'own' + i} xs={24} md={isListProperties ? 24 : 12}>
							<Row gutter={[ 10, 10 ]} align="bottom">
								<Col>
									<NumberInput
										pre={<UserOutlined />}
										min={1}
										max={100}
										value={own.per}
										changeHandler={(val: number) => {
											own.per = val;
											setOwner && owner && setOwner([ ...owner ]);
											const count = ownerPercent();
											if (count > 100) own.per = val - (count - 100);
											isListProperties && data ? changeData([ ...data ]) : changeData(record);
										}}
										step={0.1}
										unit="%"
										addBefore={
											<SelectInput
												pre={''}
												value={own.fId as string}
												options={getFamilyOptions(allFamily)}
												changeHandler={(key: string) => {
													setMemberKey(key);
													own.fId = key;
													setOwner && owner && setOwner([ ...owner ]);
													isListProperties && data
														? changeData([ ...data ])
														: changeData(record);
												}}
											/>
										}
									/>
								</Col>
								{i !== 0 && (
									<Button
										type="link"
										onClick={() => {
											owners.splice(i, 1);
											setOwner && owner && setOwner([ ...owner ]);
											isListProperties && data ? changeData([ ...data ]) : changeData(record);
										}}
										danger
									>
										<DeleteOutlined />
									</Button>
								)}
								{owners.length === i + 1 && (
									<Tooltip title={'Owners'}>
										<Button
											shape={'circle'}
											onClick={() => {
												const count = ownerPercent();
												if (count < 100) {
													owners.push({ fId: memberKey, per: 100 - count });
													setOwner && owner && setOwner([ ...owner ]);
													record.own = owners;
													isListProperties && data
														? changeData([ ...data ])
														: changeData(record);
												}
											}}
											icon={<PlusOutlined />}
											disabled={Object.keys(allFamily).length === 1}
										/>
									</Tooltip>
								)}
							</Row>
						</Col>
					);
				})}
		</Fragment>
	);
}
