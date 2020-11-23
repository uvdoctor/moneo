import React, { Fragment, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { List, Badge, Row, Col, Button } from "antd";
import {
	getAllAssetCategories,
	getAllAssetTypesByCategory,
	getAssetColour,
	toCurrency,
} from "../utils";
import { CalcContext } from "../calc/CalcContext";
import DataSwitcher from "../DataSwitcher";
import { ArrowLeftOutlined } from "@ant-design/icons";

const TreemapChart = dynamic(() => import("bizcharts/lib/plots/TreemapChart"), {
	ssr: false,
});

interface RenderItemProp {
	name?: any;
	value?: any;
}

interface CashDataKeys {
	[key: string]: any;
}

interface CashData extends CashDataKeys {
	value: number;
	deposits: number;
	savings: number;
}

interface AssetAllocationChartProps {
	year?: number;
	backFunction?: Function;
}

export default function AssetAllocationChart({year = new Date().getFullYear() + 1, backFunction}: AssetAllocationChartProps) {
	const cashDataDefault = {
		value: 0,
		deposits: 0,
		savings: 0,
	};
	const { Chart, List: DataSwitcherList } = DataSwitcher;
	const { cfs, ffResult, currency, startYear }: any = useContext(CalcContext);
	const index = year - startYear - 1;
	const [data, setData] = useState<Array<any>>([]);
	const [colors, setColors] = useState<Array<string>>([]);
	const [cashData, setCashData] = useState<CashData>(cashDataDefault);

	const sortDesc = (data: Array<any>) => data.sort((a, b) => b.value - a.value);

	const initChartData = () => {
		let data: Array<any> = [];
		let colors: Array<string> = [];
		const aa = ffResult.aa;
		const cash: CashData = cashDataDefault;

		getAllAssetCategories().forEach((cat) => {
			let children: Array<any> = [];
			let total = 0;
			getAllAssetTypesByCategory(cat).forEach((at) => {
				if (aa[at][index]) {
					total += aa[at][index];

					cat === "Cash"
						? (cash[at.toLowerCase()] = aa[at][index])
						: children.push({
								name: at,
								value: aa[at][index],
								children: [],
						  });
				}
			});

			cat === "Cash"
				? (cash.value = total)
				: data.push({
						name: cat,
						value: total,
						children: children,
				  });
		});
		setCashData(cash);
		sortDesc(data).forEach((cat) => colors.push(getAssetColour(cat.name)));
		data.forEach((cat) => {
			sortDesc(cat.children).forEach((at) =>
				colors.push(getAssetColour(at.name))
			);
			cat.name += ` ${cat.value}%`;
		});
		setData([...data]);
		setColors([...colors]);
	};

	useEffect(() => {
		initChartData();
	}, [cfs]);

	return (
		<Fragment>
			<DataSwitcher
				title={
					<Fragment>
						{backFunction && <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => backFunction() } />}
						Target Asset Allocation of{" "}
						<strong>{toCurrency(cfs[index], currency)}</strong> for Year{" "}
						<strong>{year}</strong>
					</Fragment>
				}
				header={
					cashData ? (
						<Fragment>
							<Row>
								<Col xs={24} lg={8}>
									<div className="cash active">
										<span className="arrow-right"></span>
										Cash <Badge count={`${cashData.value} %`} />
										<strong>
											{toCurrency(
												Math.round((cfs[index] * cashData.value) / 100),
												currency
											)}
										</strong>
									</div>
								</Col>
								<Col xs={24} sm={12} lg={8}>
									<div className="cash">
										Deposits <Badge count={`${cashData.deposits} %`} />
										<strong>
											{toCurrency(
												Math.round((cfs[index] * cashData.deposits) / 100),
												currency
											)}
										</strong>
									</div>
								</Col>
								<Col xs={24} sm={12} lg={8}>
									<div className="cash">
										Savings <Badge count={`${cashData.savings} %`} />
										<strong>
											{toCurrency(
												Math.round((cfs[index] * cashData.savings) / 100),
												currency
											)}
										</strong>
									</div>
								</Col>
							</Row>
						</Fragment>
					) : null
				}
			>
				<Chart>
					<TreemapChart
						data={{
							name: "Portfolio",
							value: 100 - (cashData.value || 0),
							children: data,
						}}
						meta={{
							value: {
								formatter: (v) => {
									return v + "%";
								},
							},
						}}
						colorField="name"
						label={{
							visible: true,
							formatter: (v) => {
								return ffResult.aa.hasOwnProperty(v)
									? v +
											"\n" +
											toCurrency(
												Math.round((cfs[index] * ffResult.aa[v][index]) / 100),
												currency
											) +
											"\n" +
											ffResult.aa[v][index] +
											"%"
									: v;
							},
						}}
						color={colors}
						rectStyle={{ stroke: "#fff", lineWidth: 2 }}
						forceFit
					/>
				</Chart>
				<DataSwitcherList>
					{(() => {
						let count = 0;

						return (
							<List
								dataSource={data}
								renderItem={({ name, children }) => {
									const [title, percentage] = name.split(" ");

									count++;

									return (
										<Fragment>
											<List.Item className="heading">
												{title} <Badge count={percentage} />
											</List.Item>
											<List.Item>
												<List
													dataSource={children}
													renderItem={({ name, value }: RenderItemProp) => {
														count++;

														return (
															<List.Item actions={[<span>{value} %</span>]}>
																<span
																	style={{ background: colors[count - 1] }}
																></span>
																{name}
															</List.Item>
														);
													}}
												/>
											</List.Item>
										</Fragment>
									);
								}}
							/>
						);
					})()}
				</DataSwitcherList>
			</DataSwitcher>
		</Fragment>
	);
}
