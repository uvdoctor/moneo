import { Badge, Col, Row } from "antd";
import React from "react";
import LabelWithTooltip from "../form/LabelWithTooltip";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";

interface CashAAProps {
  emergency: number;
  emergencyPer: number;
  longTerm: number;
  longTermPer: number;
  currency: string;
  emergencyInfo: any;
  longTermInfo: any;
  decimal?: boolean;
}

export default function CashAA({
  emergency,
  emergencyPer,
  longTerm,
  longTermPer,
  currency,
  emergencyInfo,
  longTermInfo,
  decimal,
}: CashAAProps) {
  return (
    <Row>
      <Col xs={24} lg={6}>
        <div className="cash active">
          <span className="arrow-right" />
          <LabelWithTooltip label="Total Cash" info="" />
          <Badge
            count={`${toReadableNumber(
              emergencyPer + longTermPer,
              decimal ? 2 : 0
            )} %`}
          />
        </div>
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <div className="cash deposits">
          <LabelWithTooltip label="Emergency" info={emergencyInfo} inline />{" "}
          <Badge
            count={`${toReadableNumber(emergencyPer, decimal ? 2 : 0)} %`}
          />
          <strong>
            {toHumanFriendlyCurrency(Math.round(emergency), currency)}
          </strong>
        </div>
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <div className="cash">
          <LabelWithTooltip label="Long-term" info={longTermInfo} inline />{" "}
          <Badge
            count={`${toReadableNumber(longTermPer, decimal ? 2 : 0)} %`}
          />
          <strong>
            {toHumanFriendlyCurrency(Math.round(longTerm), currency)}
          </strong>
        </div>
      </Col>
    </Row>
  );
}
