import React from "react";
import { Row, Col } from "antd";
import DDContent from "../DDContent";

export default function Security() {
  return (
    <DDContent className="security" whiteBg>
      <Row align="middle" gutter={[50, 0]}>
        <Col span={12}>
          <h2>
            We give <span className="text-green-primary">security</span> &amp;{" "}
            <span className="text-green-primary">control on the go!</span>
          </h2>
          <p>
            This is dummy content and will replace in future. Link with various
            accounts to automatically calculate, what you own minus, what you
            owe.
          </p>
        </Col>
        <Col span={12}>
          <img src="images/security.jpg" />
        </Col>
      </Row>
    </DDContent>
  );
}
