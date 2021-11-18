import { Button, Checkbox, Col, InputNumber, Row, Table } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { OwnershipInput, PropertyInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { NWContext } from './NWContext';
import { DeleteOutlined } from '@ant-design/icons';
import TextInput from '../form/textinput';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import { getDefaultMember, getFamilyOptions } from './nwutils';
import UserAddOutlined from '@ant-design/icons/lib/icons/UserAddOutlined';
import NumberInput from '../form/numberinput';
import DatePickerInput from '../form/DatePickerInput';

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

    const changePin = async (val: string, i: number) => {
		data[i].pin = Number(val);
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

	const changeRes = (val: boolean, i: number) => {
		data[i].res = val;
		changeData([...data]);
	}

	const changePurchaseDate = (val: string, i:number) => {
		// @ts-ignore
		data[i].purchase.month = Number(val.slice(0, val.indexOf('-')));
		// @ts-ignore
		data[i].purchase.year = Number(val.slice(val.indexOf('-') + 1));
		changeData([ ...data ])
	};

	const expandedRow = (i: number) => {
		const owners = data[i].own;
		return (
		<Fragment>
			<Row justify='space-between'>
				<h3>Purchase:-</h3>
				<Col>
					<NumberInput
						pre={'Amount'}
						min={10}
						max={100000}
						value={data[i].purchase?.amt as number}
						// @ts-ignore
						changeHandler={(val: number) => { data[i].purchase?.amt = val; changeData([ ...data ]) }}
						currency={selectedCurrency}
						step={1}
						noSlider
					/>
				</Col>
				<Col>
					<DatePickerInput
						picker="month"
						title={'Date'}
						changeHandler={(val:string)=>changePurchaseDate(val, i)}
						defaultVal={`${data[i].purchase?.year}-${data[i].purchase?.month}` as string}
						size={'middle'}
					/>
				</Col>
				<Col>
					<TextInput pre={'Name'} 
					value={data[i].name as string} 
					changeHandler={(val: string) => { data[i].name = val; changeData([ ...data ]) }} 
					size={'middle'}/>
				</Col>
			</Row>
			<Row justify='space-between'><h3>Address:-</h3>
				<Col>
					<TextInput 
					pre={''} 
					value={data[i].address as string} 
					changeHandler={(val: string) => { data[i].address = val; changeData([ ...data ]) }} 
					size={'middle'} />
				</Col>
				<Col>
					<TextInput pre={''} 
					// @ts-ignore
					value={data[i].pin} 
					changeHandler={(val: string) => {changePin(val, i)}} 
					size={'middle'}/>
				</Col>
				<Col>
					<label>{data[i].city}</label>
				</Col>
				<Col>
					<label>{data[i].state}</label>
				</Col>
			</Row>
			
			<Row justify='space-between'><h3>Own By:-</h3>
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
						&nbsp;&nbsp;
						<Col>
							<Button onClick={() => onAddBtnClick(i)}>
								Add Owners<UserAddOutlined />
							</Button>
						</Col>
				</Row>
				{console.log(data)}
			</Fragment>
		)
	};

	const columns = [
		{ title: "Residential", dataIndex: 'res', key: 'res'},
		{ title: 'Type', dataIndex: 'type', key: 'type' },
		{ title: 'Market value', key: 'mv', dataIndex: 'mv' },
		{ title: 'Rate', dataIndex: 'rate', key: 'rate' },
		{ title: 'Delete', key: 'del', dataIndex: 'del' },
	];

	const dataSource = [];

	for (let i = 0; i < data.length; ++i) {
	    dataSource.push({
            key: i,
			res: data[i].type === 'P' || data[i].type === 'O' ? 'Non-residential' : <Checkbox checked={data[i].res} onChange={(e)=>changeRes(e.target.checked, i)}/>,
            type: <SelectInput
	                pre=""
	                value={data[i].type as string}
	                options={categoryOptions}
	                changeHandler={(val: any) => { data[i].type = val; changeData([ ...data ]) }} />,
            mv: <InputNumber
                    onChange={(val: number) => { data[i].mv = val; changeData([ ...data ]) }}
                    min={10}
                    max={100000}
                    value={data[i].mv as number}
                    step={1} />,
			rate: <InputNumber
					onChange={(val: number) => { data[i].rate = val; changeData([ ...data ]) }}
					min={1}
					max={50}
					value={data[i].rate as number}
					step={0.1} />,
            del: <Button type="link" onClick={() => removeHolding(i)} danger><DeleteOutlined /></Button>,
	    });
	  }

	return (
		<Table
			className="property-nested-table"
			columns={columns}
			expandable={{ expandedRowRender: (record) => {
				return expandedRow(record.key)
			} }}
			dataSource={dataSource}
			size="small"
		/>
	);
}
