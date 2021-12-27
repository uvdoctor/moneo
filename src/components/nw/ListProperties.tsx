import {
	Button,
	Checkbox,
	Col,
	Empty,
	InputNumber,
	Row,
	Table,
	Tooltip,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { OwnershipInput, PropertyInput } from "../../api/goals";
import SelectInput from "../form/selectinput";
import { NWContext } from "./NWContext";
import TextInput from "../form/textinput";
import {
	doesPropertyMatch,
	getDefaultMember,
	getFamilyOptions,
} from "./nwutils";
import { PlusOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import NumberInput from "../form/numberinput";
import DatePickerInput from "../form/DatePickerInput";
import { COLORS } from "../../CONSTANTS";
import { getMonthName, getMonthIndex, toHumanFriendlyCurrency } from "../utils";
import { getCompoundedIncome } from "../calc/finance";
import { calculateDifferenceInYears, calculateProperty } from "./valuationutils";

interface ListPropertiesProps {
	data: Array<PropertyInput>;
	changeData: Function;
	categoryOptions: any;
}

export default function ListProperties({
	data,
	changeData,
	categoryOptions,
}: ListPropertiesProps) {
	const { selectedCurrency, allFamily, selectedMembers }: any = useContext(
		NWContext
	);
	const [indexForMv, setIndexForMv] = useState<number | null>(null);
	const [memberKey, setMemberKey] = useState<string>(
		getDefaultMember(allFamily, selectedMembers)
	);
	const [dataSource, setDataSource] = useState<Array<any>>([]);
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

	const onAddBtnClick = (index: number) => {
		let count = 0;
		data[index].own.map((item: OwnershipInput) => (count += item.per));
		if (count < 100) {
			data[index].own.push({ fId: memberKey, per: 100 - count });
			changeData([...data]);
		}
	};

	const removeOwners = (index: number, i: number) => {
		data[index].own.splice(i, 1);
		changeData([...data]);
	};

	const changeRes = (val: boolean, i: number) => {
		data[i].res = val;
		changeData([...data]);
	};

	const changePurchaseDate = (val: string, i: number) => {
		// @ts-ignore
		data[i].purchase.month = getMonthIndex(val.substring(0, 3));
		// @ts-ignore
		data[i].purchase.year = Number(val.substring(val.length - 4));
		setIndexForMv(i);
		changeData([...data]);
	};

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
		const owners = data[i].own;
		return (
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
								<Col>Amount</Col>
								<Col>
									<NumberInput
										pre=""
										isBasic={true}
										min={10}
										max={1000000000}
										value={data[i].purchase?.amt as number}
										changeHandler={(val: number) => changeAmt(i, val)}
										currency={selectedCurrency}
										step={10}
										noSlider
									/>
								</Col>
							</Row>
						</Col>
						<Col xs={24}>
							<DatePickerInput
								picker="month"
								title={"Date"}
								changeHandler={(val: string) => changePurchaseDate(val, i)}
								value={
									// @ts-ignore
									`${getMonthName(data[i].purchase?.month, true)}-${
										data[i].purchase?.year
									}` as string
								}
								size={"middle"}
							/>
						</Col>
						<Col xs={24}>
							<Row gutter={[10, 0]}>
								<Col>Name</Col>
								<Col>
									<TextInput
										pre=""
										value={data[i].name as string}
										changeHandler={(val: string) => {
											data[i].name = val;
											changeData([...data]);
										}}
										size={"middle"}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col xs={24} sm={12} md={8}>
					<Row gutter={[0, 10]}>
						<Col xs={24}>
							<strong>Address</strong>
							<hr />
						</Col>
						<Col xs={24}>
							<TextInput
								pre={""}
								value={data[i].address as string}
								changeHandler={(val: string) => {
									data[i].address = val;
									changeData([...data]);
								}}
								size={"middle"}
							/>
						</Col>
						<Col xs={24}>
							<TextInput
								pre={""}
								value={String(data[i].pin)}
								changeHandler={(val: string) => {
									changePin(val, i);
								}}
								size={"middle"}
							/>
						</Col>
						<Col>
							<label>{data[i].city}</label>
						</Col>
						<Col>
							<label>{data[i].state}</label>
						</Col>
					</Row>
				</Col>
				<Col xs={24} sm={12} md={8}>
					<Row gutter={[0, 10]}>
						<Col xs={24}>
							<strong>Own By</strong>
							<hr />
						</Col>
						{owners &&
							owners.map((own: OwnershipInput, ind: number) => {
								return (
									<Col key={`owners-${ind}`}>
										<SelectInput
											pre={<UserOutlined />}
											value={own.fId as string}
											options={getFamilyOptions(allFamily)}
											changeHandler={(val: string) => {
												own.fId = val;
												setMemberKey(val);
												changeData([...data]);
											}}
										/>
										<InputNumber
											min={1}
											max={100}
											value={own.per}
											onChange={(val: number) => {
												own.per = val;
												changeData([...data]);
											}}
										/>
										<Button
											type="link"
											onClick={() => removeOwners(i, ind)}
											danger
										>
											<DeleteOutlined />
										</Button>
									</Col>
								);
							})}
						&nbsp;&nbsp;
						<Col>
							<Tooltip title="Add Owners">
								<Button
									shape={"circle"}
									onClick={() => onAddBtnClick(i)}
									style={{ background: COLORS.GREEN }}
									icon={<PlusOutlined />}
									disabled={Object.keys(allFamily).length === 1}
								/>
							</Tooltip>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	};

	const columns = [
		{ title: "Residential", dataIndex: "res", key: "res" },
		{ title: "Type", dataIndex: "type", key: "type" },
		{ title: "Market value", key: "mv", dataIndex: "mv" },
		{ title: "Rate", dataIndex: "rate", key: "rate" },
		{ title: "", key: "del", dataIndex: "del" },
	];

	useEffect(() => {
		let dataSource: Array<any> = [];
		for (let i = 0; i < data.length; ++i) {
			if (!doesPropertyMatch(data[i], selectedMembers, selectedCurrency))
				continue;
			dataSource.push({
				key: i,
				res: (
					<Checkbox
						checked={data[i].res}
						disabled={data[i].type === "O"}
						onChange={(e) => changeRes(e.target.checked, i)}
					/>
				),
				type: categoryOptions && (
					<SelectInput
						pre=""
						value={data[i].type as string}
						options={categoryOptions}
						changeHandler={(val: any) => {
							data[i].type = val;
							changeData([...data]);
						}}
					/>
				),
				mv: (
					<InputNumber
						onChange={(val: number) => changeMv(i, val)}
						min={10}
						max={100000000000}
						value={data[i].mv as number}
						step={100}
					/>
				),
				rate: (
					<InputNumber
						onChange={(val: number) => changeRate(i, val)}
						min={1}
						max={50}
						value={data[i].rate as number}
						step={0.1}
					/>
				),
				del: (
					<Row justify="space-between">
						<Col>
						{toHumanFriendlyCurrency(calculateProperty(data[i]), selectedCurrency)}
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
	}, [data, selectedMembers, selectedCurrency]);

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
