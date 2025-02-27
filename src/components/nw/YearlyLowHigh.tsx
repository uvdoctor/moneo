import { Col, Row, Tooltip } from "antd";
import React from "react";
import {
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { toCurrency } from "../utils";
import { COLORS } from "../../CONSTANTS";
import InsPrice from "./InsPrice";

interface YearlyLowHighProps {
  instrument: any;
  price: number;
  currency: string;
  previousPrice: number | null;
  noColor?: boolean;
}

export default function YearlyLowHigh({
  instrument,
  price,
  currency,
  previousPrice,
  noColor,
}: YearlyLowHighProps) {
  return (
    <Row justify="space-between">
      <Col>
        <Tooltip title="52-week low">
          <div style={{ color: noColor ? COLORS.WHITE : COLORS.RED }}>
            <VerticalAlignBottomOutlined />
            &nbsp;
            {toCurrency(instrument.ylow, currency)}
          </div>
        </Tooltip>
      </Col>
      <Col>
        <InsPrice
          price={price}
          previousPrice={previousPrice}
          currency={currency}
          noColor={noColor}
        />
      </Col>
      <Col>
        <Tooltip title="52-week high">
          <div style={{ color: noColor ? COLORS.WHITE : COLORS.GREEN }}>
            <VerticalAlignTopOutlined />
            &nbsp;
            {toCurrency(instrument.yhigh, currency)}
          </div>
        </Tooltip>
      </Col>
    </Row>
  );
}
