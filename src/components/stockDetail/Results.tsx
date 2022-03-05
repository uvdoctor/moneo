import { useEffect, useState } from "react";
import { Typography, Row, Col } from "antd";
import DataSwitcher from "../DataSwitcher";
import ResultsList from "./ResultsList";
import { default as TransactionsChart } from "./Chart";

interface ResultsProps {
	title: string;
	resultsData: any;
	particulars: any;
	chartOptions?: any;
}

export default function Results({
	title,
	resultsData,
	particulars,
	chartOptions,
}: ResultsProps) {
	const { Chart, List } = DataSwitcher;
	const { Text } = Typography;
	const [data, setData] = useState([]);
	const [columns, setColumns] = useState([
		{
			title: "Particulars",
			dataIndex: "particulars",
			key: "particulars",
		},
	]);
	const getDateToStr = (date: any) => {
		const dateSplit = date.split("-");
		const monthNames = [
			"JAN",
			"FEB",
			"MAR",
			"APR",
			"MAY",
			"JUN",
			"JUL",
			"AUG",
			"SEP",
			"OCT",
			"NOV",
			"DEC",
		];
		const currentMonth = monthNames[parseInt(dateSplit[1]) - 1];
		const currentYear = dateSplit[0];

		return {
			dateValue: `${currentMonth} ${currentYear}`,
			dateKey: `${currentMonth}${currentYear}`,
		};
	};
	const valueInCrores = (value: any) =>
		(parseInt(value) / 10000000).toLocaleString("hi-IN");

	useEffect(() => {
		const newColumns = [];
		const newData = { ...particulars };
		const particularsKeys = Object.keys(newData);
		let count = 0;

		for (var date in resultsData) {
			if (count > 4) break;

			const { dateValue, dateKey } = getDateToStr(date);

			newColumns.unshift({
				title: dateValue,
				dataIndex: dateKey,
				key: dateKey,
				align: "right",
			});

			particularsKeys.forEach(
				(particular) =>
					(newData[particular][dateKey] = valueInCrores(
						resultsData[date][particular]
					))
			);

			count++;
		}

		setColumns([...columns, ...newColumns]);
		setData(newData);
		console.log("data => ", newData, Object.values(newData));
	}, []);

	return (
		<div style={{ paddingBottom: "30px" }}>
			<DataSwitcher
				title={
					<Row gutter={[10, 0]}>
						<Col>
							<h3>{title}</h3>
						</Col>
						<Col>
							<Text type="secondary">(All Figures are in Crores.)</Text>
						</Col>
					</Row>
				}
			>
				<Chart>
					<TransactionsChart
						options={chartOptions}
						data={data}
						particulars={particulars}
					/>
				</Chart>
				<List>
					<ResultsList data={Object.values(data)} columns={columns} />
				</List>
			</DataSwitcher>
		</div>
	);
}
