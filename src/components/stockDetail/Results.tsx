import { useEffect, useState } from "react";
import { Table, Typography, Row, Col, Card } from "antd";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "../utils";

interface ResultsProps {
	title: string;
	resultsData: any;
	particulars: any;
}

export default function Results({
	title,
	resultsData,
	particulars,
}: ResultsProps) {
	const fsb = useFullScreenBrowser();
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
		setData(Object.values(newData));
	}, []);

	return (
		<div style={{ paddingBottom: "30px" }}>
			{isMobileDevice(fsb) ? (
				<Card title={title}>
					{/* @ts-ignore */}
					{data.map(({ particulars, ...rest }) => (
						<div style={{ paddingBottom: "15px" }}>
							<Text strong>{particulars}</Text>
							{Object.keys(rest)
								.slice(0, 5)
								.map((key) => {
									return (
										<Row gutter={[10, 10]}>
											<Col xs={12} sm={6}>
												<Text>{key}</Text>
											</Col>
											<Col style={{ textAlign: "right" }} xs={12} sm={6}>
												<Text>{rest[key]}</Text>
											</Col>
										</Row>
									);
								})}
						</div>
					))}
				</Card>
			) : (
				<>
					<Row gutter={[10, 0]}>
						<Col>
							<h3>{title}</h3>
						</Col>
						<Col>
							<Text type="secondary">(All Figures are in Crores.)</Text>
						</Col>
					</Row>

					<Table dataSource={data} columns={columns} pagination={false} />
				</>
			)}
		</div>
	);
}
