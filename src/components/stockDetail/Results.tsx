import { useEffect, useState } from "react";
import { Typography, Row, Col, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import DataSwitcher from "../DataSwitcher";
import ResultsList from "./ResultsList";
import { default as TransactionsChart } from "./Chart";

require("./Results.less");

interface ResultsProps {
	title: string;
	resultsData: any;
	particulars: any;
	chartOptions?: any;
}

const labelWithTooltip = (label: string, tooltipText: string) => (
	<Row gutter={[10, 0]}>
		<Col>{label}</Col>
		<Col>
			<Tooltip title={tooltipText}>
				<InfoCircleOutlined />
			</Tooltip>
		</Col>
	</Row>
);

export default function Results({
	title,
	resultsData,
	particulars,
	chartOptions,
}: ResultsProps) {
	const { Chart, List } = DataSwitcher;
	const { Text } = Typography;
	const [data, setData] = useState([]);
	const [columns, setColumns] = useState<any>([
		{
			title: "Particulars",
			dataIndex: "particulars",
			key: "particulars",
			render: ({ label, tooltip }: any) =>
				tooltip ? labelWithTooltip(label, tooltip) : label,
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
		const newData = JSON.parse(JSON.stringify(particulars));
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
	}, []);

	return (
		<div className="results-container">
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
					<div className="transactions-chart">
						<TransactionsChart
							options={chartOptions}
							data={data}
							particulars={particulars}
						/>
					</div>
				</Chart>
				<List>
					<ResultsList data={Object.values(data)} columns={columns} />
				</List>
			</DataSwitcher>
		</div>
	);
}
