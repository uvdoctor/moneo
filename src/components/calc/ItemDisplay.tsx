import React, { Fragment, ReactNode } from "react";
import { toCurrency, toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { Tooltip, Statistic } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { COLORS } from "../../CONSTANTS";
interface ItemDisplayProps {
	label?: any;
	svg?: any;
	result: number | string;
	noResultFormat?: boolean;
	currency?: string;
	unit?: any;
	footer?: ReactNode;
	decimal?: number;
	info?: string;
	imp?: string;
	pl?: boolean;
	precise?: boolean
}

export default function ItemDisplay(props: ItemDisplayProps) {
	return (
		<Fragment>
			<Statistic
				title={
					<Fragment>
						{props.label}
						{(props.imp || props.info) && (
							<Fragment>
								{props.imp && (
									<Tooltip title={props.imp} color="red">
										<InfoCircleOutlined />
									</Tooltip>
								)}
								{props.info && (
									<Tooltip
										title={props.info}
										color={`${
											props.pl && props.result < 0 ? "red" : COLORS.DEFAULT
										}`}
									>
										<InfoCircleOutlined />
									</Tooltip>
								)}
							</Fragment>
						)}
					</Fragment>
				}
				value={props.result}
				prefix={props.svg}
				suffix={props.unit ? props.unit : ""}
				formatter={() =>
					typeof props.result === "number" && !props.noResultFormat
						? props.currency
							? props.precise ?
								toCurrency(
									Math.abs(props.result),
									props.currency,
									props.decimal ? true : false
							  ) : toHumanFriendlyCurrency(Math.abs(props.result), props.currency)
							: toReadableNumber(
									Math.abs(props.result),
									props.decimal ? props.decimal : 0
							  )
						: props.result
				}
				valueStyle={{
					color: props.pl
						? props.result < 0
							? COLORS.RED
							: props.result > 0
							? COLORS.GREEN
							: COLORS.DEFAULT
						: COLORS.DEFAULT,
					textAlign: "center",
				}}
			/>
			<div className="text-center">{props.footer}</div>
		</Fragment>
	);
}
