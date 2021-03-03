import React from "react";
import { Empty } from "antd";
import { toReadableNumber } from "../utils";

export default function HoldingsTable({ data, insNames }) {
	return (
		<>
			{Object.keys(data)?.length ? (
				Object.keys(data)?.map((key: string, i: number) => (
					<p key={"bond" + i}>
						{key} - {insNames[key]}:
						{toReadableNumber(
							data[key],
							("" + data[key]).includes(".") ? 3 : 0
						)}
					</p>
				))
			) : (
				<Empty description={<p>No data found.</p>} />
			)}
		</>
	);
}
