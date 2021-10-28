import { Col, Row, Tabs } from "antd";
import React, { Fragment } from "react";
import MajorAssumptions from "../calc/blog/MajorAssumptions";
import { isMobileDevice } from "../utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import privacyContent from "./PrivacyContent";
import securityContent from "./SecurityContent";
import tcConent from "./TCContent";

interface PoliciesProps {
  stringParams: string;
}

export default function Policies({ stringParams }: PoliciesProps) {
  const fsb = useFullScreenBrowser();
  const { TabPane } = Tabs;

  const tabKey: any = {
    "Terms and Conditions": "terms-and-conditions",
    Privacy: "privacy",
    Security: "security",
  };

  const sections: any = {
    "Terms & Conditions": <MajorAssumptions elements={[...tcConent]} />,
    Privacy: <MajorAssumptions elements={[...privacyContent]} />,
    Security: <MajorAssumptions elements={[...securityContent]} />,
  };

  return (
    <Fragment>
      <Row className="steps-content">
        <Col>
          <Tabs
            defaultActiveKey={stringParams}
            tabPosition={isMobileDevice(fsb) ? "top" : "left"}
            type={isMobileDevice(fsb) ? "card" : "line"}
            animated
          >
            {Object.keys(sections).map((key) => (
              <TabPane key={tabKey[key]} tab={key}>
                {sections[key]}
              </TabPane>
            ))}
          </Tabs>
        </Col>
      </Row>
    </Fragment>
  );
}
