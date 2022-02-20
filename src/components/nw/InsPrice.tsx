import { Tooltip } from "antd";
import React from "react";
import { toCurrency } from "../utils";

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
  return (
    <Tooltip title="Today's valuation">
      <strong>{toCurrency(price, currency, true)}</strong>
      {previousPrice && previousPrice !== price
        ? `(${toCurrency(previousPrice, currency, true)})`
        : null}
    </Tooltip>
  );
}
