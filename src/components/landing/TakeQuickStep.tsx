import React from "react";
import { Row, Col, Input } from "antd";

export default function TakeQuickStep() {
  const { Search } = Input;
  return (
    <Row align="middle">
      <Col span={12}>
        <h2 className="text-green-primary">Take quick step</h2>
        <p>Unlock money and make your future safe and secure.</p>
        <Search
          placeholder="Enter email address"
          enterButton="Join"
          size="large"
        />
      </Col>
      <Col span={12}>
        <img src="images/quick-step.jpg" />
      </Col>
    </Row>
  );
}
