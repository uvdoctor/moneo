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
    "Terms & Conditions": "",
    Privacy: <MajorAssumptions elements={[...privacyContent]} />,
    Security: <MajorAssumptions elements={[...securityContent]} />,
  };

  const tcSections: any = {
    General: <MajorAssumptions elements={[...tcConent.General]} />,
    Rewards: <MajorAssumptions elements={[...tcConent.Rewards]} />,
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
                {key === "Terms & Conditions" ? (
                  <Tabs tabPosition={"top"} type={"line"} animated>
                    {Object.keys(tcSections).map((key) => (
                      <TabPane key={key} tab={key}>
                        {sections[key]}
                      </TabPane>
                    ))}
                  </Tabs>
                ) : (
                  sections[key]
                )}
              </TabPane>
            ))}
          </Tabs>
        </Col>
      </Row>
    </Fragment>
  );
}
