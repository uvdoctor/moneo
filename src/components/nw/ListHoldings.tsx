import { Col, Empty, Row, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { HoldingInput } from "../../api/goals";
import { NWContext, TAB } from "./NWContext";
import { doesHoldingMatch } from "./nwutils";
import Category from "./Category";
import Amount from "./Amount";
import MemberAndValuation from "./MemberAndValuation";
import DateColumn from "./DateColumn";
import TextInput from "../form/textinput";
import NumberInput from "../form/numberinput";
require("./ListHoldings.less");

interface ListHoldingsProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
	fields: any;
}
export default function ListHoldings({
	data,
	changeData,
	categoryOptions,
	subCategoryOptions,
	fields,
}: ListHoldingsProps) {
	const { selectedMembers, selectedCurrency, childTab }: any = useContext(
		NWContext
	);
	const {
		PM,
		NPS,
		CRYPTO,
		INS,
		VEHICLE,
		LENT,
		LOAN,
		PF,
		ANGEL,
		OTHER,
		SAV,
		CREDIT,
	} = TAB;
	const [dataSource, setDataSource] = useState<Array<any>>([]);
	const allColumns: any = {
		cat: { title: fields.type, dataIndex: "cat", key: "cat" },
		amt: { title: fields.amount, dataIndex: "amt", key: "amt" },
		rate: { title: fields.rate, dataIndex: "rate", key: "rate" },
		fid: { title: "Valuation", key: "fid", dataIndex: "fid" },
		date: { title: fields.date, dataIndex: "date", key: "date" },
		label: { title: fields.name, dataIndex: "label", key: "label" },
		qty: { title: fields.qty, dataIndex: "qty", key: "qty" },
	};
	let defaultColumns: Array<string> = [];
	let expandedColumns: Array<string> = [];
	const hasminimumCol = (childTab: string) =>
		[ANGEL, SAV, CREDIT].includes(childTab);
	if (hasminimumCol(childTab)) {
		defaultColumns = ["label", "fid"];
	} else if (childTab === OTHER) {
		defaultColumns = ["cat", "fid"];
		expandedColumns = ["label"];
	} else if (childTab === PM || childTab === CRYPTO || childTab === NPS) {
		defaultColumns = ["cat", "fid"];
		expandedColumns = ["amt"];
	} else if (childTab === VEHICLE) {
		defaultColumns = ["cat", "fid"];
		expandedColumns = ["label", "amt", "date"];
	} else if (childTab === LENT || childTab === PF) {
		defaultColumns = ["cat", "fid"];
		expandedColumns = ["label", "amt", "date", "rate", "qty"];
	} else if (childTab === LOAN) {
		defaultColumns = ["label", "fid"];
		expandedColumns = ["amt", "date", "rate"];
	} else if (childTab === INS) {
		defaultColumns = ["cat", "fid"];
		expandedColumns = ["date", "amt", "rate", "qty"];
	}
	const changeName = (val: any, i: number) => {
		data[i].name = val;
		changeData([...data]);
	};
	const changeQty = (qty: number, i: number) => {
		data[i].qty = qty;
		if (hasPF(childTab)) {
			data[i].sm = new Date().getMonth() + 1;
			data[i].sy = new Date().getFullYear();
		}
		changeData([...data]);
	};
	const hasDate = (childTab: string, record: HoldingInput) =>
		[VEHICLE, LENT, LOAN, INS].includes(childTab) && record.subt !== "H";
	const hasName = (childTab: string) =>
		![PM, NPS, CRYPTO, INS, PF].includes(childTab);
	const hasPF = (childTab: string) => [PF].includes(childTab);
	const hasQtyWithRate = (childTab: string) =>
		[PM, NPS, CRYPTO].includes(childTab);
	const getAllData = (holding: HoldingInput, i: number) => {
		const dataToRender = {
			key: i,
			cat: (
				<Category
					data={data}
					changeData={changeData}
					categoryOptions={categoryOptions}
					subCategoryOptions={subCategoryOptions}
					record={holding}
				/>
			),
			fid: (
				<MemberAndValuation
					data={data}
					changeData={changeData}
					record={holding}
					index={i}
				/>
			),
			label: (
				<TextInput
					pre=""
					changeHandler={(val: string) => changeName(val, i)}
					value={holding.name as string}
					size={"middle"}
					style={{ width: 200 }}
				/>
			),
		};
		return dataToRender;
	};

	const expandedRow = (i: number) => {
		return (
			<Row
				gutter={[
					{ xs: 0, sm: 10, md: 30 },
					{ xs: 20, sm: 10, md: 0 },
				]}
			>
				{hasName(childTab) && expandedColumns.includes("label") && (
					<Col xs={24} sm={12} md={6}>
						<Row gutter={[0, 10]}>
							<Col xs={24}>
								<strong>{fields.name}</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<Row gutter={[10, 0]}>
									<Col>
										<TextInput
											pre=""
											changeHandler={(val: string) => changeName(val, i)}
											value={data[i].name as string}
											size={"middle"}
											style={{ width: 200 }}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{expandedColumns.includes("amt") && (
					<Col xs={24} sm={12} md={6}>
						<Row gutter={[0, 10]}>
							<Col xs={24}>
								<strong>
									{hasQtyWithRate(childTab) ? fields.qty : fields.amount}
								</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<Row gutter={[10, 0]}>
									<Col>
										<Amount
											data={data}
											changeData={changeData}
											record={data[i]}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{hasDate(childTab, data[i]) && expandedColumns.includes("date") && (
					<Col xs={24} sm={12} md={6}>
						<Row gutter={[0, 10]}>
							<Col xs={24}>
								<strong>{fields.date}</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<Row gutter={[10, 0]}>
									<Col>
										<DateColumn
											data={data}
											changeData={changeData}
											record={data[i]}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				)}
				{hasPF(childTab) && expandedColumns.includes("qty") && (
					<Col xs={24} sm={12} md={6}>
						<Row gutter={[0, 10]}>
							<Col xs={24}>
								<strong>{fields.qty}</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<Row gutter={[10, 0]}>
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
				{hasRate(childTab) && expandedColumns.includes("rate") && (
					<Col xs={24} sm={12} md={6}>
						<Row gutter={[0, 10]}>
							<Col xs={24}>
								<strong>{fields.rate}</strong>
								<hr />
							</Col>
							<Col xs={24}>
								<Row gutter={[10, 0]}>
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
			</Row>
		);
	};
	const changeChg = (chg: number, record: HoldingInput) => {
		record.chg = chg;
		changeData([...data]);
	};
	const columns = defaultColumns.map((col: string) => allColumns[col]);
	const hasRate = (childTab: string) => [PF, LENT, LOAN].includes(childTab);
	useEffect(() => {
		let dataSource: Array<any> = [];
		data.map((holding: HoldingInput, index: number) => {
			if (doesHoldingMatch(holding, selectedMembers, selectedCurrency)) {
				dataSource.push(getAllData(holding, index));
			}
		});
		setDataSource([...dataSource]);
	}, [data, selectedMembers, selectedCurrency]);

	return dataSource.length ? (
		<Table
			className="list-holdings"
			columns={columns.filter((col) => {
				if (col.dataIndex === "cat") return categoryOptions;
				else return col;
			})}
			expandable={
				expandedColumns.length
					? {
							expandedRowRender: (record) => expandedRow(record.key),
					  }
					: {}
			}
			dataSource={dataSource}
			size="small"
		/>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
