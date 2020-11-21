import React, { Fragment, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { List, Badge } from "antd";
import {
	getAllAssetCategories,
	getAllAssetTypesByCategory,
	getAssetColour,
	toCurrency,
} from "../utils";
import { CalcContext } from "../calc/CalcContext";
import DataSwitcher from "../DataSwitcher";

const TreemapChart = dynamic(() => import("bizcharts/lib/plots/TreemapChart"), {
	ssr: false,
});

interface RenderItemProp {
	name?: any;
	value?: any;
}

export default function AssetAllocationChart() {
	const { Chart, List: DataSwitcherList } = DataSwitcher;
	const { cfs, ffResult, currency }: any = useContext(CalcContext);
	const [data, setData] = useState<Array<any>>([]);
	const [colors, setColors] = useState<Array<string>>([]);

	const sortDesc = (data: Array<any>) => data.sort((a, b) => b.value - a.value);

	const initChartData = () => {
		let data: Array<any> = [];
		let colors: Array<string> = [];
		const aa = ffResult.aa;
		getAllAssetCategories().forEach((cat) => {
			let children: Array<any> = [];
			let total = 0;
			getAllAssetTypesByCategory(cat).forEach((at) => {
				if (aa[at][0]) {
					total += aa[at][0];
					children.push({
						name: at,
						value: aa[at][0],
						children: [],
					});
				}
			});
			data.push({
				name: cat,
				value: total,
				children: children,
			});
		});
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
			<DataSwitcher>
				<Chart>
					<TreemapChart
						data={{
							name: "Portfolio",
							value: 100,
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
												Math.round((cfs[0] * ffResult.aa[v][0]) / 100),
												currency
											) +
											"\n" +
											ffResult.aa[v][0] +
											"%"
									: v;
							},
						}}
						color={colors}
						rectStyle={{ stroke: "#fff", lineWidth: 2 }}
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
