import React, { useContext } from "react";
import { Row, Col } from "antd";
import DDContent from "../DDContent";
import { JoinContext } from "./JoinContext";
import Join from "./Join";

export default function TakeQuickStep() {
  const { status }: any = useContext(JoinContext);

  return status !== "Y" ? (
    <DDContent whiteBg>
      <Row align="middle" gutter={[50, 0]}>
        <Col span={12}>
          <h2 className="text-green-primary">Take quick step</h2>
          <p>Unlock money and make your future safe and secure.</p>
          <Join />
        </Col>
        <Col span={12}>
          <img src="images/quick-step.jpg" />
        </Col>
      </Row>
    </DDContent>
  ) : null;
}
