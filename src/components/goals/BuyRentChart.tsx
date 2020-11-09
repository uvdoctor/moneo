import React, { Fragment, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from "../chartutils";
import { buildYearsArray } from "../utils";
import { GoalContext } from "./GoalContext";
import { Col, Row } from "antd";
import ItemDisplay from "../calc/ItemDisplay";
import { CalcContext } from "../calc/CalcContext";
import NumberInput from "../form/numberinput";

const GroupedColumnChart = dynamic(
	() => import("bizcharts/lib/plots/GroupedColumnChart"),
	{ ssr: false }
);

export default function BuyRentChart() {
	const { currency }: any = useContext(CalcContext);
	const { brChartData, analyzeFor, sellAfter, setAnalyzeFor }: any = useContext(
		GoalContext
	);
	const [stackedData, setStackedData] = useState<Array<any>>(
		buildYearsArray(1, brChartData[0].values.length)
	);
	const [rentDiff, setRentDiff] = useState<number | null>(null);

	const provideRentAns = () => {
		if (
			!sellAfter ||
			!brChartData ||
			brChartData.length === 0 ||
			brChartData[0].values.length < sellAfter
		) {
			setRentDiff(null);
			return;
		}
		setRentDiff(
			brChartData[1].values[sellAfter - 1] -
				brChartData[0].values[sellAfter - 1]
		);
	};

	useEffect(() => {
		provideRentAns();
	}, [brChartData, sellAfter]);

	useEffect(() => {
		let chartData: Array<any> = [];
		if (brChartData[0].values.length === 0) {
			setStackedData([...chartData]);
			return;
		}
		for (let year = 1; year <= brChartData[0].values.length; year++) {
			chartData.push({
				name: brChartData[0].name,
				years: year,
				value: brChartData[0].values[year - 1],
			});
			chartData.push({
				name: brChartData[1].name,
				years: year,
				value: brChartData[1].values[year - 1],
			});
		}
		setStackedData([...chartData]);
	}, [brChartData]);

	return (
		<Fragment>
			<Row className="chart-options-row" justify="space-around">
				<Col className="chart-stats" xs={24} sm={24} md={24} lg={12}>
					{rentDiff && (
						<ItemDisplay
							result={rentDiff}
							label={`Rent is ${rentDiff < 0 ? "Costlier" : "Cheaper"} by`}
							footer={`Over ${sellAfter} Years`}
							currency={currency}
							pl
						/>
					)}
				</Col>
				<Col xs={24} sm={24} md={24} lg={12}>
					<NumberInput
						pre="Compare from 1 to "
						value={analyzeFor}
						changeHandler={setAnalyzeFor}
						min={10}
						max={50}
						step={5}
						unit="Years"
					/>
				</Col>
			</Row>
			<Col span={24} style={{ minHeight: "400px" }}>
				<GroupedColumnChart
					meta={getCommonMeta(currency)}
					xField="years"
					yField="value"
					groupField="name"
					data={stackedData}
					yAxis={getCommonYAxis()}
					xAxis={getCommonXAxis("Number of Years")}
				/>
			</Col>
		</Fragment>
	);
}
