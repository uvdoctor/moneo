import { Alert, Col, Row, Skeleton, Tabs, PageHeader } from "antd";
import React, { Fragment, useContext, useEffect } from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { getDiscountRate, isMobileDevice } from "../utils";
import { AppContext } from "../AppContext";
import PasswordTab from "./PasswordTab";
import DeleteAccount from "./DeleteAccount";
import PersonalTab from "./PersonalTab";
import ProfileTab from "./ProfileTab";
import { UserSettingsContext } from "./UserSettingsContext";
import AccountTab from "./AccountTab";
require("./UserSettings.less");

export default function UserSettingsView() {
  const { appContextLoaded, userInfo, setDiscountRate, defaultCountry }: any =
    useContext(AppContext);
  const { error, isDrManual, riskProfile }: any =
    useContext(UserSettingsContext);
  const fsb = useFullScreenBrowser();
  const { TabPane } = Tabs;

  useEffect(() => {
    !isDrManual &&
      setDiscountRate(getDiscountRate(riskProfile, defaultCountry));
  }, [riskProfile, defaultCountry, userInfo, isDrManual]);

  return (
    <Fragment>
      <Row className="primary-header">
        <Col>
          <PageHeader title="Settings" />
        </Col>
      </Row>

      {appContextLoaded ? (
        <>
          {error ? <Alert type="error" message={error} /> : null}
          <Tabs
            className="settings-tab-view"
            tabPosition={isMobileDevice(fsb) ? "top" : "left"}
            type={isMobileDevice(fsb) ? "card" : "line"}
            animated
          >
            <TabPane className="settings-tabpane-view" tab="Personal" key="1">
              <PersonalTab />
            </TabPane>
            <TabPane className="settings-tabpane-view" tab="Profile" key="2">
              <ProfileTab />
            </TabPane>
            <TabPane className="settings-tabpane-view" tab="Account" key="3">
              <AccountTab />
            </TabPane>
            <TabPane className="settings-tabpane-view" tab="Password" key="4">
              <PasswordTab />
            </TabPane>
            <TabPane className="settings-tabpane-view" tab="Delete" key="5">
              <DeleteAccount />
            </TabPane>
          </Tabs>
        </>
      ) : (
        <Skeleton active />
      )}
    </Fragment>
  );
}
