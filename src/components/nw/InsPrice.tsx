import { Tooltip } from "antd";
import React from "react";
import {
  toCurrency,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { COLORS } from "../../CONSTANTS";
import LabelWithTooltip from "../form/LabelWithTooltip";

interface InsPriceProps {
  price: number;
  currency: string;
  previousPrice: number | null;
  noDecimal?: boolean;
  noPerCalc?: boolean;
  info?: string;
  noColor?: boolean;
}
export default function InsPrice({
  price,
  currency,
  previousPrice,
  noDecimal,
  noPerCalc,
  info,
  noColor,
}: InsPriceProps) {
  const getChangeRatio = () =>
    price && previousPrice
      ? toReadableNumber(
          noPerCalc
            ? Math.abs(previousPrice)
            : Math.abs((price / previousPrice - 1) * 100),
          2
        )
      : 0;

  return (
    <>
      <Tooltip title="Today's valuation">
        <strong>
          {noDecimal
            ? toHumanFriendlyCurrency(price, currency)
            : toCurrency(price, currency, true)}
        </strong>
      </Tooltip>
      {previousPrice && previousPrice !== price ? (
        <span
          style={{
            color: noColor
              ? COLORS.WHITE
              : (noPerCalc && previousPrice > 0) ||
                (!noPerCalc && price > previousPrice)
              ? COLORS.GREEN
              : COLORS.RED,
          }}>
          <LabelWithTooltip
            label={
              <span>
                &nbsp;
                {(noPerCalc && previousPrice > 0) ||
                (!noPerCalc && price > previousPrice) ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
                {`${getChangeRatio()}%`}
              </span>
            }
            info={info}
          />
        </span>
      ) : null}
    </>
  );
}
