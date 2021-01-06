import React, { useContext } from "react";
import { Row, Col } from "antd";
import Content from "../Content";
import { JoinContext } from "./JoinContext";
import Join from "./Join";
import { Status } from "../../api/goals";

import "./TakeQuickStep.less";

export default function TakeQuickStep() {
  const { status }: any = useContext(JoinContext);

  return status !== Status.Y ? (
    <Content className="take-quick-step" whiteBg>
      <Row align="middle" gutter={[50, 0]}>
        <Col xs={24} sm={24} md={12}>
          <h2 className="text-green-primary">Take quick step</h2>
          <p>Unlock money and make your future safe and secure.</p>
          <Join />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <img src="images/quick-step.jpg" />
        </Col>
      </Row>
    </Content>
  ) : null;
}
