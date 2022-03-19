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
      title={<strong style={{ fontSize: "20px" }}>{title}</strong>}
      value={value}
      valueStyle={{
        color: negative ? "#3f8600" : "#cf1322",
        fontWeight: "bold",
        fontSize: "20px",
      }}
      prefix={negative ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
      suffix="%"
    />
  );
}
