import React, { useContext } from "react";
import { Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { AppContext } from "../AppContext";

interface StatisticInputProps {
  value: string;
  title: string;
  negative: boolean;
  isValPercent: boolean;
  price: number;
}

export default function StatisticInput({
  value,
  title,
  negative,
  price,
  isValPercent,
}: StatisticInputProps) {
  const { defaultCurrency }: any = useContext(AppContext);
  return (
    <Statistic
      title={<strong style={{ fontSize: "16px" }}>{title}</strong>}
      value={!isValPercent ? toReadableNumber(Math.abs(Number(value))) : Math.abs(Number(value))}
      valueStyle={{
        color: !negative ? "#3f8600" : "#cf1322",
        fontWeight: "bold",
        fontSize: "16px",
      }}
      prefix={!negative ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      suffix={`${isValPercent ? "%" : ""} ${
        price ? ` - ${toHumanFriendlyCurrency(price, defaultCurrency)}` : ""
      }`}
    />
  );
}
