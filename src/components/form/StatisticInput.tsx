import React from "react";
import { Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

interface StatisticInputProps {
  value: string;
  title: string;
  negative?: boolean;
}

export default function StatisticInput({
  value,
  title,
  negative,
}: StatisticInputProps) {
  return (
    <Statistic
      title={<strong style={{ fontSize: "16px" }}>{title}</strong>}
      value={value}
      valueStyle={{
        color: negative ? "#cf1322" : "#3f8600",
        fontWeight: "bold",
        fontSize: "16px",
      }}
      prefix={negative ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
      suffix="%"
    />
  );
}