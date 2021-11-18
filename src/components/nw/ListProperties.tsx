import { Button, Col, Input, InputNumber, Row, Table } from 'antd';
import React, { useContext, useState } from 'react';
import { OwnershipInput, PropertyInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { NWContext } from './NWContext';
import { DeleteOutlined } from '@ant-design/icons';
import TextInput from '../form/textinput';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import { getDefaultMember, getFamilyOptions } from './nwutils';
import UserAddOutlined from '@ant-design/icons/lib/icons/UserAddOutlined';

interface ListPropertiesProps {
	data: Array<PropertyInput>;
	changeData: Function;
	categoryOptions: any;
}

export default function ListProperties({ data, changeData, categoryOptions }: ListPropertiesProps) {
    const { selectedCurrency, allFamily, selectedMembers }: any = useContext(NWContext);
    const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));

	const removeHolding = (i: number) => {
		data.splice(i, 1);
		changeData([ ...data ]);
	};

    const changePin = async (val: any, i: number) => {
		data[i].pin = val;
		if (selectedCurrency === 'INR') {
			if (val.length === 6) {
				const response = await fetch(`https://api.postalpincode.in/pincode/${val}`);
				const resdata = await response.json();
				data[i].state = (resdata[0].PostOffice[0].State);
				data[i].city = (resdata[0].PostOffice[0].District);
			}
		}
		changeData([ ...data ]);
	};

    const onAddBtnClick = (index: number) => {
		let count = 0;
		data[index].own.map((item: any) => (count += item.per));
		if (count < 100) {
			data[index].own.push({ fId: memberKey, per: 100 - count });
			changeData([ ...data ]);
		}
	};

	const removeTgt = (index: number, i: number) => {
		data[index].own.splice(i, 1);
		changeData([ ...data ]);
	};

	const expandedRow = (i: number) => {
		const owners = data[i].own;
		return (
			<>
			<Row><h3>Owners</h3>
				{owners.map((own: OwnershipInput, ind: number) => {
					return(
						// eslint-disable-next-line react/jsx-key
						<Col>
							<SelectInput
								pre={<UserOutlined />}
								value={own.fId as string}
								options={getFamilyOptions(allFamily)}
								changeHandler={(val: string) => { own.fId = val; setMemberKey(val); changeData([...data]); } } />
							<InputNumber
								min={1}
								max={100}
								value={own.per}
								onChange={(val: number) => { own.per = val; changeData([...data]); } } />
							<Button type="link" onClick={() => removeTgt(i, ind)} danger>
								<DeleteOutlined />
							</Button>
						</Col>
						)})}
						<Col>
							<Button onClick={() => onAddBtnClick(i)}>
								Add Owners<UserAddOutlined />
							</Button>
						</Col>
				</Row>
			<Row><h3>Purchase</h3>
				<Col>
					<InputNumber
					min={1000}
					max={100000}
					value={data[i].purchase?.amt as number}
					// @ts-ignore
					onChange={(val: number) => { data[i].purchase?.amt = val; changeData([ ...data ]) }}
					step={1}
				/>
				</Col>
				<Col> 
					<InputNumber 
						// @ts-ignore	
						onChange={(val: number) => { data[i].purchase?.year = val; changeData([ ...data ]) }} 
						min={1900} 
						max={new Date().getFullYear()} 
						value={data[i].purchase?.year as number} />
				</Col>
            	<Col>
					<InputNumber 
					// @ts-ignore
					onChange={(val: number) => { data[i].purchase?.month = val; changeData([ ...data ]) }} 
					min={1} 
					max={12} 
					value={data[i].purchase?.month as number } />
				</Col>
			</Row>
			<Row><h3>Address</h3>
				<Col>
					<Input value={data[i].pin as number} onChange={(e: any) => changePin(e.target.value, i)} />
				</Col>
				<Col>
					<TextInput pre={''} value={data[i].city as string} changeHandler={(val: string) => { data[i].city = val; changeData([ ...data ]) }} size={'middle'} />
				</Col>
				<Col>
					<TextInput pre={''} value={data[i].state as string} changeHandler={(val: string) => { data[i].state = val; changeData([ ...data ]) }} size={'middle'} />
				</Col>
				<Col>
					<TextInput pre={''} value={data[i].address as string} changeHandler={(val: string) => { data[i].address = val; changeData([ ...data ]) }} size={'middle'} />
				</Col>
			</Row>
			</>
					
		)
	};

	const columns = [
		{ title: 'Type', dataIndex: 'type', key: 'type' },
		{ title: 'Rate', dataIndex: 'rate', key: 'rate' },
		{ title: 'Market value', key: 'mv', dataIndex: 'mv' },
		{ title: 'Delete', key: 'del', dataIndex: 'del' }
	];

	const dataSource = [];

	for (let i = 0; i < data.length; ++i) {
	    dataSource.push({
            key: i,
            type: <SelectInput
	                pre=""
	                value={data[i].type as string}
	                options={categoryOptions}
	                changeHandler={(val: any) => { data[i].type = val; changeData([ ...data ]) }}
	            />,
	        rate: <InputNumber
					onChange={(val: number) => { data[i].rate = val; changeData([ ...data ]) }}
					min={1}
					max={50}
					value={data[i].rate as number}
					step={0.1}
				/>,
            mv: <InputNumber
                    onChange={(val: number) => { data[i].mv = val; changeData([ ...data ]) }}
                    min={10}
                    max={100000}
                    value={data[i].mv as number}
                    step={1} />,
            del: <Button type="link" onClick={() => removeHolding(i)} danger><DeleteOutlined /></Button>,
	    });
	  }

	return (
		<Table
			className="components-table-demo-nested"
			columns={columns}
			expandable={{ expandedRowRender: (record) => {
				return expandedRow(record.key)
			} }}
			dataSource={dataSource}
			size="small"
		/>
	);
}
