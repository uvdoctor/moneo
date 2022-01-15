import { Badge, Col, Row } from "antd";
import React from "react";
import LabelWithTooltip from "../form/LabelWithTooltip";
import { toHumanFriendlyCurrency } from "../utils";

interface CashAAProps {
  emergency: number;
  emergencyPer: number;
  longTerm: number;
  longTermPer: number;
  currency: string;
}

export default function CashAA({
  emergency,
  emergencyPer,
  longTerm,
  longTermPer,
  currency,
}: CashAAProps) {
  return (
    <Row>
      <Col xs={24} lg={6}>
        <div className="cash active">
          <span className="arrow-right" />
          Total Cash <Badge count={`${emergencyPer + longTermPer} %`} />
        </div>
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <div className="cash deposits">
          <LabelWithTooltip
            label="Emergency"
            info="Emergency cash including savings, short-term deposits and liquid funds"
            inline
          />{" "}
          <Badge count={`${emergencyPer} %`} />
          <strong>
            {toHumanFriendlyCurrency(Math.round(emergency / 100), currency)}
          </strong>
        </div>
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <div className="cash">
          <LabelWithTooltip
            label="Long-term"
            info="Long-term cash investments in deposits and retirement related funds"
            inline
          />{" "}
          <Badge count={`${longTermPer} %`} />
          <strong>
            {toHumanFriendlyCurrency(Math.round(longTerm / 100), currency)}
          </strong>
        </div>
      </Col>
    </Row>
  );
}
