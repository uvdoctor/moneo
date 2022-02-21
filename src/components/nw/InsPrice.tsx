import { Tooltip } from "antd";
import React from "react";
import { toCurrency, toReadableNumber } from "../utils";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { COLORS } from "../../CONSTANTS";

interface InsPriceProps {
  price: number;
  currency: string;
  previousPrice: number | null;
}
export default function InsPrice({
  price,
  currency,
  previousPrice,
}: InsPriceProps) {
  const getChangeRatio = () =>
    price && previousPrice ? toReadableNumber(price / previousPrice, 2) : 0;

  return (
    <Tooltip title="Today's valuation">
      <strong>{toCurrency(price, currency, true)}</strong>
      {previousPrice && previousPrice !== price ? (
        <>
          &nbsp;
          {price > previousPrice ? (
            <ArrowUpOutlined style={{ color: COLORS.GREEN }} />
          ) : (
            <ArrowDownOutlined style={{ color: COLORS.RED }} />
          )}
          {`${getChangeRatio()}%`}
        </>
      ) : null}
    </Tooltip>
  );
}
