import { Button, Col, Empty, Row, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { PropertyInput, PropertyType } from "../../api/goals";
import { NWContext } from "./NWContext";
import TextInput from "../form/textinput";
import { doesPropertyMatch, getFamilyOptions } from "./nwutils";
import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import NumberInput from "../form/numberinput";
import DateInput from "../form/DateInput";
import { presentMonth, presentYear, toHumanFriendlyCurrency } from "../utils";
import { getCompoundedIncome } from "../calc/finance";
import { calculateDifferenceInYears, calculateProperty } from "./valuationutils";
import HSwitch from "../HSwitch";
import CascaderInput from "../form/CascaderInput";
import Owner from "./Owner";
require('./ListProperties.less');

interface ListPropertiesProps {
	data: Array<PropertyInput>;
	changeData: Function;
	categoryOptions: any;
	fields: any;
}

export default function ListProperties({
	data,
	changeData,
	categoryOptions,
	fields
}: ListPropertiesProps) {
	const { selectedCurrency, allFamily, selectedMembers }: any = useContext(
		NWContext
	);
	const [indexForMv, setIndexForMv] = useState<number | null>(null);
	const [dataSource, setDataSource] = useState<Array<any>>([]);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const today = new Date();
	const removeHolding = (i: number) => {
		data.splice(i, 1);
		changeData([...data]); 
	};

	const changePin = async (val: string, i: number) => {
		data[i].pin = Number(val);
		if (selectedCurrency === "INR") {
			if (val.length === 6) {
				const response = await fetch(
					`https://api.postalpincode.in/pincode/${val}`
				);
				const resdata = await response.json();
				data[i].state = resdata[0].PostOffice[0].State;
				data[i].city = resdata[0].PostOffice[0].District;
			}
		}
		changeData([...data]);
	};

	const changeRes = (val: boolean, i: number) => {
		data[i].res = val;
		changeData([...data]);
	};

	const changePurchaseMonth = (val: number, i: number) => {
		// @ts-ignore
		data[i].purchase.month = val
		setIndexForMv(i);
		changeData([...data]);
	}

	const changePurchaseYear = (val: number, i: number) => {
		// @ts-ignore
		data[i].purchase.year = val
		setIndexForMv(i);
		changeData([...data]);
	}

	const changeMv = (i: number, val: number) => {
		data[i].mv = val;
		data[i].mvm = today.getMonth() + 1;
		data[i].mvy = today.getFullYear();
		changeData([...data]);
	};

	useEffect(() => {
		if (indexForMv !== null) {
			const duration = calculateDifferenceInYears(
				today.getMonth()+1, 
				today.getFullYear(), 
				data[indexForMv].purchase?.month as number, 
				data[indexForMv].purchase?.year as number);

			data[indexForMv].mv = Math.round(
				getCompoundedIncome(
					data[indexForMv].rate,
					data[indexForMv].purchase?.amt as number,
					duration
				)
			);
			data[indexForMv].mvm = today.getMonth() + 1;
			data[indexForMv].mvy = today.getFullYear();
			changeData([...data]);
			setIndexForMv(null);
		}
	}, [changeData, data, indexForMv]);

	const changeAmt = (i: number, val: number) => {
		// @ts-ignore
		data[i].purchase?.amt = val;
		changeData([...data]);
		setIndexForMv(i);
	};

	const changeRate = (i: number, val: number) => {
		data[i].rate = val;
		changeData([...data]);
		setIndexForMv(i);
	};

	const expandedRow = (i: number) => {
		return (
			<>
			<Row gutter={[ 0, 10 ]}>
				{!(data[i].type === PropertyType.COMM || data[i].type === PropertyType.P ) && 
				<Col xs={24} md={12}>
				{/* @ts-ignore */}
					<HSwitch value={data[i].res} setter={(val: boolean)=>changeRes(val, i)} rightText="I live here"/>
				</Col>}
			</Row>
			<Row
				gutter={[
					{ xs: 0, sm: 10, md: 30 },
					{ xs: 20, sm: 10, md: 0 },
				]}
			>
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[0, 10]}>
							<Col xs={24}>
								<strong>Purchase</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<Row gutter={[10, 0]}>
									<Col xs={24}>{fields.amount}</Col>
									<Col>
										<NumberInput
											pre=""
											min={10}
											value={data[i].purchase?.amt as number}
											changeHandler={(val: number) => changeAmt(i, val)}
											currency={selectedCurrency}
											step={10} />
									</Col>
								</Row>
							</Col>
							<Col xs={24}>
								<Row gutter={[10, 0]}>
								<Col xs={24}>{fields.date}</Col>
								<Col>
								<DateInput
									title=''
									startMonthHandler={(val: number)=>changePurchaseMonth(val, i)}
									startYearHandler={(val: number)=>changePurchaseYear(val, i)}
									startMonthValue={data[i].purchase?.month}
									startYearValue={data[i].purchase?.year as number}
									size="middle"
								/>
							</Col>
							</Row>
							</Col>
							<Col>
								<Row gutter={[10, 0]}>
									<Col xs={24}>{fields.rate}</Col>
									<Col>
										<NumberInput
											changeHandler={(val: number) => changeRate(i, val)}
											min={1}
											max={50}
											value={data[i].rate as number}
											step={0.1}
											unit="%"
											pre=""
										/>
								</Col>
								</Row>
							</Col>
						</Row>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[0, 10]}>
							<Col xs={24}>
								<strong>{fields.address}</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<TextInput
									pre={""}
									value={data[i].address as string}
									changeHandler={(val: string) => {
										data[i].address = val;
										changeData([...data]);
									} }
									size={"middle"} />
							</Col>
							<Col xs={24}>
								<TextInput
									pre={""}
									value={String(data[i].pin)}
									changeHandler={(val: string) => {
										changePin(val, i);
									} }
									post={
										data[i].city && data[i].state &&
										<label>{`${data[i].city}, ${data[i].state}`}</label>
									}
									size={"middle"} />
							</Col>
							<Col xs={24}>
								<strong>{fields.name}</strong>
								<hr />
							</Col>
							<Col xs={24}>
							<TextInput
						pre={''}
						value={data[i].name as string}
						changeHandler={(val: string) => {
							data[i].name = val;
							changeData([...data]);
						}}
						size={"middle"} />
							</Col>
						</Row>
					</Col>
					{Object.keys(getFamilyOptions(allFamily)).length > 1 &&
					<Col xs={24} sm={12} md={8}>
						<Row gutter={[0, 10]}>
							<Col xs={24}>
								<strong>{fields.owner}</strong>
								<hr />
							</Col>
								<Owner changeData={changeData} data={data} record={data[i]}/>	
						</Row>
					</Col>}
				</Row></>
		);
	};

	const columns = [
		{ title: fields.type, dataIndex: "type", key: "type" },
		{ title: "Valuation", key: "val", dataIndex: "val" },
	];

	useEffect(() => {
		let dataSource: Array<any> = [];
		for (let i = 0; i < data.length; ++i) {
			if (!doesPropertyMatch(data[i], selectedMembers, selectedCurrency))
				continue;
			const valuation = calculateProperty(data[i]);
			if (valuation > 0 && valuation !== data[i].mv) {
				data[i].mv = valuation;
				data[i].mvm = presentMonth;
				data[i].mvy = presentYear;
				changeData([...data])
			}
			dataSource.push({
				key: i,
				type: categoryOptions && (
					<CascaderInput pre={''} parentValue={data[i].type} parentChangeHandler={(val:any)=>{
						data[i].type = val;
						changeData([...data])
					}} options={categoryOptions}/>
				),
				val: (
					<Row justify="space-between" align="middle">
						<Col>
						<Row align={isEditMode ? 'top': 'middle'}>
							<Col>
							{isEditMode ? <NumberInput
							changeHandler={(val: number) => changeMv(i, val)}
							min={100}
							value={data[i].mv as number}
							step={100}
							pre=""
							currency={selectedCurrency}/>
							: toHumanFriendlyCurrency(data[i].mv as number, selectedCurrency)}
						</Col>
						<Col>
							<Button
								type="link"
								icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
								onClick={()=>isEditMode ? setIsEditMode(false) : setIsEditMode(true)}
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
				),
			});
		}
		setDataSource([...dataSource]);
	}, [data, selectedMembers, selectedCurrency, isEditMode]);

	return dataSource.length ? (
		<Table
			className="property-nested-table"
			columns={columns}
			expandable={{
				expandedRowRender: (record) => expandedRow(record.key),
			}}
			dataSource={dataSource}
			size="small"
		/>
	) : (
		<Empty description={<p>No property found.</p>} />
	);
}
