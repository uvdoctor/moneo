import { Col, Input, InputNumber } from 'antd';
import React, { Fragment, useContext } from 'react';
import { PropertyInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { NWContext } from './NWContext';

interface ViewPropertiesInputProps {
	data: Array<PropertyInput>;
	changeData: Function;
	record: PropertyInput;
	categoryOptions: any;
}

export default function ViewPropertiesInput({ data, changeData, record, categoryOptions }: ViewPropertiesInputProps) {
	const { selectedCurrency }: any = useContext(NWContext);
	const changeAmount = (quantity: number) => {
		record.purchase.amt = quantity;
		changeData([ ...data ]);
	};

	const changeRate = (rate: number) => {
		record.rate = rate;
		changeData([ ...data ]);
	};

	const changeMonth = (e: any) => {
		record.purchase.month = e.target.value;
		changeData([ ...data ]);
	};

	const changeYear = (e: any) => {
		record.purchase.year = e.target.value;
		changeData([ ...data ]);
	};

	const changeSubtype = (subtype: any) => {
		record.type = subtype;
		changeData([ ...data ]);
	};

	const changeAddress = (e: any) => {
		record.address = (e.target.value);
		changeData([ ...data ]);
	};

	const changeMv = (val: number) => {
		record.mv = (val);
		record.mvm = (new Date().getMonth() + 1);
		record.mvy = (new Date().getFullYear());
		changeData([ ...data ]);
	};

	const changePin = async (e: any) => {
		record.pin = (e.target.value);
		if (selectedCurrency === 'INR') {
			if (e.target.value.length === 6) {
				const response = await fetch(`https://api.postalpincode.in/pincode/${e.target.value}`);
				const data = await response.json();
				record.state = (data[0].PostOffice[0].State);
				record.city = (data[0].PostOffice[0].Block);
				record.district = (data[0].PostOffice[0].District);
			}
		}
		changeData([ ...data ]);
	};

	const changeDistrict = (val: string) => {
		record.district = val; 
		changeData([ ...data ]);
	};

	const changeCity = (val: string) => {
		record.city = val;
		changeData([ ...data ]);
	};

	const changeState = (val: string) => {
		record.state = val;
		changeData([ ...data ]);
	};

	return (
		<Fragment>
			 <Col>
				<SelectInput
					pre=""
					value={record.type as string}
					options={categoryOptions}
					changeHandler={(val: any) => changeSubtype(val)}
				/>
			</Col>
			<Col><Input addonBefore={'Pincode'} value={record.pin as number} onChange={changePin} /></Col>
			<Col><TextInput pre={'District'} value={record.district as string} changeHandler={changeDistrict} size={'middle'} /></Col>
			<Col><TextInput pre={'City'} value={record.city as string} changeHandler={changeCity} size={'middle'} /></Col>
			<Col><TextInput pre={'State'} value={record.state as string} changeHandler={changeState} size={'middle'} /></Col>
			<Col><Input addonBefore={'Address'} value={record.address as string} onChange={changeAddress} /></Col>
			<Col>
				<NumberInput
					pre={'Purchase Amount'}
					min={10}
					max={100000}
					value={record.purchase?.amt as number}
					changeHandler={changeAmount}
					currency={selectedCurrency}
					step={1}
					noSlider
				/></Col>
			<Col><label>Purchase Month</label>
				<InputNumber onChange={changeMonth} min={1} max={12} value={record.purchase?.month as number } /></Col>
			<Col><label>Purchase Year</label>
				<InputNumber onChange={changeYear} min={1900} max={new Date().getFullYear()} value={record.purchase?.year as number} />
			</Col>
			<Col>
				<NumberInput
					pre={'Rate'}
					changeHandler={changeRate}
					post={'%'}
					min={0}
					max={50}
					value={record.rate}
					step={0.1}
					noSlider
				/>
			</Col>
			<Col>
				<NumberInput
					pre={'Market Value'}
					min={10}
					max={100000}
					value={record.mv as number}
					changeHandler={changeMv}
					currency={selectedCurrency}
					step={1}
					noSlider
				/>
			</Col>
			{/* <Col>
					{own &&
						own[0] &&
						own.map((own: Ownership, i: number) => (
							<Fragment key={'own' + i}>
								<Row justify="center">
									<Col>
										<SelectInput
											pre={<UserOutlined />}
											value={own.fId as string}
											options={getFamilyOptions(allFamily)}
											changeHandler={(key: string) => changeMember(i, key)}
										/>
									</Col>
									<Col>
										<InputNumber
											placeholder="Percentage"
											min={1}
											max={100}
											value={own.per}
											onChange={(val: number) => changePer(i, val)}
										/>
									</Col>
									<Button type="link" onClick={() => removeTgt(i)} danger>
										<DeleteOutlined />
									</Button>
								</Row>
							</Fragment>
						))}
					<Row justify="center">
						<Button onClick={onAddBtnClick}>
							Add Owners<UserAddOutlined />
						</Button>
					</Row>
				</Col> */}
		</Fragment>
	);
}
