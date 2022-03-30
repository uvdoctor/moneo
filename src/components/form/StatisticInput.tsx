import React, { useContext } from "react";
import { Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { AppContext } from "../AppContext";

interface StatisticInputProps {
  value: string;
  title: string;
  negative: boolean;
  isVolume?: boolean;
  price?: number;
  isNotPercentage?: boolean;
}

export default function StatisticInput({
  value,
  title,
  negative,
  price,
  isVolume,
  isNotPercentage
}: StatisticInputProps) {
  const { defaultCurrency }: any = useContext(AppContext);
  return (
    <Statistic
      title={<strong style={{ fontSize: "16px" }}>{title}</strong>}
      value={Math.abs(Number(value))}
      valueStyle={{
        color: !negative ? "#3f8600" : "#cf1322",
        fontWeight: "bold",
        fontSize: "16px",
      }}
      prefix={!negative ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      suffix={`${!isNotPercentage ? "%" : ""} ${
        price ? ` - ${isVolume ? toReadableNumber(price) : toHumanFriendlyCurrency(price, defaultCurrency)}` : ""
      }`}
    />
  );
}
