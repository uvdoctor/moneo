import {
  Alert,
  Col,
  Row,
  Skeleton,
  Tabs,
  PageHeader,
  Button,
  Checkbox,
} from "antd";
import React, { Fragment, useContext, useEffect } from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { emailRegex, getDiscountRate, isMobileDevice } from "../utils";
import { AppContext } from "../AppContext";
import TextInput from "../form/textinput";
import PasswordTab from "./PasswordTab";
import { COLORS } from "../../CONSTANTS";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import OtpDialogue from "./OtpDialogue";
import { doesEmailExist, doesImExist, doesMobExist } from "../userinfoutils";
import DeleteAccount from "./DeleteAccount";
import SaveButton from "./SaveButton";
import PersonalTab from "./PersonalTab";
import ProfileTab from "./ProfileTab";
import { UserSettingsContext } from "./UserSettingsContext";
require("./UserSettings.less");

export default function UserSettingsView() {
  const {
    user,
    validateCaptcha,
    appContextLoaded,
    userInfo,
    setDiscountRate,
    defaultCountry,
  }: any = useContext(AppContext);
  const {
    error,
    loading,
    updatePersonalTab,
    updateProfileTab,
    setError,
    prefuser,
    setPrefuser,
    email,
    setEmail,
    mobile,
    setMobile,
    whatsapp,
    setWhatsapp,
    updatePrefUsername,
    updateAccountTab,
    countryCodeWithoutPlusSign,
    countryCode,
    updateImIfSameAsMob,
    setName,
    isDrManual,
    riskProfile,
  }: any = useContext(UserSettingsContext);
  const fsb = useFullScreenBrowser();
  const { TabPane } = Tabs;

  const disableButton = (prevValue: any, currValue: any) =>
    prevValue === currValue ? true : error?.length > 0 ? true : false;

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
              <Row gutter={[10, 10]}>
                <Col span={24}>
                  <PersonalTab />
                </Col>
                <Col xs={24} sm={24} md={16}>
                  <SaveButton
                    loading={loading}
                    error={error}
                    onClick={updatePersonalTab}
                    action="personal"
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane className="settings-tabpane-view" tab="Profile" key="2">
              <Row gutter={[10, 10]}>
                <Col span={24}>
                  <ProfileTab />
                </Col>
                <Col xs={24} sm={24} md={16}>
                  <SaveButton
                    loading={loading}
                    error={error}
                    onClick={updateProfileTab}
                    action="profile"
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane className="settings-tabpane-view" tab="Account" key="3">
              <Row gutter={[0, 24]}>
                <Col xs={24} sm={24} md={12}>
                  <TextInput
                    pre="Preferred login name"
                    value={prefuser}
                    changeHandler={setPrefuser}
                    style={{ width: 300 }}
                    fieldName="prefusername"
                    setError={setError}
                    post={
                      <Button
                        type="link"
                        style={{ color: COLORS.GREEN }}
                        icon={<SaveOutlined />}
                        disabled={error?.length > 0 ? true : false}
                        onClick={() => {
                          validateCaptcha("prefusername_change").then(
                            (success: boolean) => {
                              if (!success) return;
                              updatePrefUsername();
                            }
                          );
                        }}
                      />
                    }
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <TextInput
                    pre="Email"
                    placeholder={"abc@xyz.com"}
                    value={email}
                    changeHandler={setEmail}
                    pattern={emailRegex}
                    setError={setError}
                    style={{ width: 300 }}
                    fieldName="email"
                    post={
                      <OtpDialogue
                        disableButton={disableButton(
                          email,
                          user?.attributes?.email
                        )}
                        action={"email"}
                        onClickAction={() =>
                          updateAccountTab(email, doesEmailExist, "Email", {
                            email: email,
                          })
                        }
                        email={email}
                        mob={parseFloat(countryCodeWithoutPlusSign + mobile)}
                        im={parseFloat(countryCodeWithoutPlusSign + whatsapp)}
                      />
                    }
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <TextInput
                    pre="Mobile"
                    prefix={countryCode?.value}
                    value={mobile}
                    changeHandler={setMobile}
                    style={{ width: 300 }}
                    fieldName="mobile"
                    pattern="^[0-9]"
                    setError={setError}
                    minLength={10}
                    maxLength={10}
                    post={
                      <OtpDialogue
                        disableButton={disableButton(
                          user?.attributes?.phone_number,
                          countryCode?.value + mobile
                        )}
                        action={"phone_number"}
                        mob={parseFloat(countryCodeWithoutPlusSign + mobile)}
                        onClickAction={() =>
                          updateAccountTab(
                            mobile,
                            doesMobExist,
                            "Mobile Number",
                            {
                              phone_number: countryCode?.value + mobile,
                            }
                          )
                        }
                      />
                    }
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Row gutter={[0, 10]}>
                    <Col xs={24} sm={24} md={12}>
                      <TextInput
                        pre="Whatsapp"
                        prefix={countryCode?.value}
                        value={whatsapp}
                        changeHandler={setWhatsapp}
                        fieldName="whatsapp"
                        pattern="^[0-9]"
                        setError={setError}
                        minLength={10}
                        maxLength={10}
                        post={
                          <OtpDialogue
                            disableButton={disableButton(
                              user?.attributes?.nickname,
                              countryCode?.value + whatsapp
                            )}
                            action={"whatsapp_number"}
                            im={parseFloat(countryCodeWithoutPlusSign + mobile)}
                            onClickAction={() =>
                              updateAccountTab(
                                whatsapp,
                                doesImExist,
                                "Whatsapp Number",
                                {
                                  nickname: countryCode?.value + whatsapp,
                                }
                              )
                            }
                          />
                        }
                      />
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        checked={whatsapp === mobile}
                        onChange={(e) =>
                          e.target.checked ? updateImIfSameAsMob() : null
                        }
                      >
                        <strong>Whatsapp number same as mobile number</strong>
                      </Checkbox>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </TabPane>
            <TabPane className="settings-tabpane-view" tab="Password" key="4">
              <Row justify="start">
                <Col>
                  <PasswordTab user={user} />
                </Col>
              </Row>
            </TabPane>
            <TabPane className="settings-tabpane-view" tab="Delete" key="5">
              <Row justify="start">
                <Col>
                  <DeleteAccount />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </>
      ) : (
        <Skeleton active />
      )}
    </Fragment>
  );
}
