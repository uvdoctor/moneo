import { Tooltip } from "antd";
import React from "react";
import {
  toCurrency,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { COLORS } from "../../CONSTANTS";

interface InsPriceProps {
  price: number;
  currency: string;
  previousPrice: number | null;
  noDecimal?: boolean;
}
export default function InsPrice({
  price,
  currency,
  previousPrice,
  noDecimal,
}: InsPriceProps) {
  const getChangeRatio = () =>
    price && previousPrice ? toReadableNumber(price / previousPrice, 2) : 0;

  return (
    <Tooltip title="Today's valuation">
      <strong>
        {noDecimal
          ? toHumanFriendlyCurrency(price, currency)
          : toCurrency(price, currency, true)}
      </strong>
      {previousPrice && previousPrice !== price ? (
        <span
          style={{ color: price > previousPrice ? COLORS.GREEN : COLORS.RED }}>
          &nbsp;
          {price > previousPrice ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {`${getChangeRatio()}%`}
        </span>
      ) : null}
    </Tooltip>
  );
}
