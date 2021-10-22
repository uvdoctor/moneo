import { Alert, Col, Row, notification, Skeleton, Tabs, PageHeader, Button } from "antd";
import React, { Fragment, useContext, useState, useEffect } from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { Auth } from "aws-amplify";
import { parse } from "date-fns";
import { isMobileDevice } from "../utils";
import { AppContext } from "../AppContext";
import { countrylist } from "./CountryCode";
import TextInput from "../form/textinput";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import generatePicker from "antd/lib/date-picker/generatePicker";
import PasswordInput from "./PasswordInput";
import "antd/lib/date-picker/style/index";
import "./Layout.less";
import ImageInput from "./ImageInput";
import { COLORS } from "../../CONSTANTS";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";

const dateFormat = "yyyy-MM-dd";
const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export default function UserSettings(): JSX.Element {
  const { user, appContextLoaded, defaultCountry }: any = useContext(AppContext);
  const [email, setEmail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [error, setError] = useState<any>("");
  const [otp, setOtp] = useState<any>("");
  const [otpMode, setOtpMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dob, setDob] = useState<string>("");

  const { TabPane } = Tabs;
  const fsb = useFullScreenBrowser();
  const success = (message: any) => notification.success({ message: message });
  const failure = (message: any) => notification.error({ message: message });
  const counCode = countrylist.find(
    (item) => item.countryCode === defaultCountry
  );

  const disableButton = (prevValue: any, currValue: any) =>
    prevValue === currValue ? true : error.length > 0 ? true : false;

  const updatePhoneNumber = async () => {
    try {
      await Auth.updateUserAttributes(user, {
        ["phone_number"]: `${counCode?.value}${contact}`,
      });
      success("Contact updated successfully");
      setOtpMode(true);
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateEmail = async () => {
    try {
      await Auth.updateUserAttributes(user, { ["email"]: email });
      success("Email updated successfully");
      setOtpMode(true);
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const displayOtp = (attr: string) => {
    return (
      <TextInput
        pre={"Enter Otp"}
        value={otp}
        changeHandler={setOtp}
        post={
          <Button
            type="link"
            style={{ color: COLORS.GREEN }}
            icon={<SaveOutlined />}
            onClick={() => confirmOtp(attr)}
          />
        }
      />
    );
  };

  const confirmOtp = async (attr: string) => {
    Auth.verifyCurrentUserAttributeSubmit(attr, otp)
      .then(() => {
        success("Otp Verified Successfully");
      })
      .catch((err) => {
        failure("Wrong Otp" + err.message);
      });
    setOtpMode(false);
  };

  const updatePersonaTab = async () => {
    const values: any = {
      name: "First Name",
      family_name: "Last Name",
      birthdate: "Date of Birh",
    };
    const attr = ["name", "family_name", "birthdate"];
    const attrValue = [name, lastName, dob];
    let errorLength = 0;
    for (let ind = 0; ind < attr.length; ind++) {
      try {
        await Auth.updateUserAttributes(user, { [attr[ind]]: attrValue[ind] });
      } catch (error) {
        errorLength++;
        failure(`Unable to update ${values[attr[ind]]}, ${error}`);
      }
    }
    if (errorLength === 0) success("Updated Successfully");
  };

  useEffect(() => {
    if (!user) return;
    setEmail(user.attributes.email);
    setName(user.attributes.name || "");
    setLastName(user.attributes.family_name || "");
    setDob(user?.attributes.birthdate);
    setContact(user.attributes.phone_number.replace(counCode?.value, ""));
  }, [appContextLoaded]);

  return (
    <Fragment>
      {error ? <Alert type="error" message={error} /> : null}
      <Row className="primary-header">
        <Col>
          <PageHeader title="Settings" />
        </Col>
      </Row>
      <p>&nbsp;</p>
      {appContextLoaded ? (
        <Row className=".steps-content">
          <Col>
            <Tabs
              tabPosition={isMobileDevice(fsb) ? "top" : "left"}
              type={isMobileDevice(fsb) ? "card" : "line"}
              animated
            >
              <TabPane className="tabPane" tab="Personal" key="1">
                <Row>
                  <Col className="personal-tabpane-image-view">
                    <ImageInput user={user} />
                  </Col>
                  <p>&nbsp;</p>
                  <Col>
                    <Row justify="center">
                      <Col className="firstname-view">
                        <TextInput
                          pre="First Name"
                          placeholder="abcdefg"
                          value={name}
                          changeHandler={setName}
                          width={300}
                          minLength={2}
                          maxLength={20}
                          setError={setError}
                          fieldName="firstname"
                          pattern="^[a-zA-Z'-.,]+$"
                        />
                      </Col>
                    </Row>
                    <span>&nbsp;</span>
                    <Row justify="center">
                      <Col>
                        <TextInput
                          pre="Last Name"
                          placeholder="abcdefg"
                          value={lastName}
                          changeHandler={setLastName}
                          width={300}
                          minLength={2}
                          maxLength={20}
                          setError={setError}
                          fieldName="lastname"
                          pattern="^[a-zA-Z'-.,]+$"
                        />
                      </Col>
                    </Row>
                    <span>&nbsp;</span>
                    <Row justify="center">
                      <Col>
                        <span>
                          <label className="dob">Date of birth</label>
                          <DatePicker
                            style={{ width: 200 }}
                            defaultValue={parse(
                              dob || getTodayDate(),
                              dateFormat,
                              new Date()
                            )}
                            format={dateFormat}
                            size="large"
                            onChange={(_, ds) => setDob(ds.toString())}
                          />
                        </span>
                      </Col>
                    </Row>
                    <p>&nbsp;</p>
                    <Row justify="center">
                      <Col>
                        <Button type="primary" style={{ color: COLORS.WHITE }} icon={<SaveOutlined />}
                          onClick={updatePersonaTab}>Save</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <p>&nbsp;</p>
              </TabPane>
              <TabPane tab="Contact" key="2">
                <Row justify="start">
                  <Col>
                    <TextInput
                      pre="Mobile"
                      prefix={counCode?.value}
                      value={contact}
                      changeHandler={setContact}
                      fieldName="contact"
                      pattern="^[0-9]"
                      setError={setError}
                      minLength={10}
                      maxLength={10}
                      post={
                        <Button
                          type="text"
                          style={{ color: COLORS.GREEN }}
                          icon={<SaveOutlined />}
                          onClick={updatePhoneNumber}
                          disabled={disableButton(
                            user.attributes.phone_number,
                            `${counCode?.value}${contact}`
                          )}
                        />
                      }
                    />
                  </Col>
                </Row>

                <p>&nbsp;</p>
                <Row justify="start">
                  <Col>
                    <TextInput
                      pre="Email Id"
                      placeholder={"abc@xyz.com"}
                      value={email}
                      changeHandler={setEmail}
                      pattern={
                        "^(?!.*(?:.-|-.))[^@]+@[^W_](?:[w-]*[^W_])?(?:.[^W_](?:[w-]*[^W_])?)+$"
                      }
                      setError={setError}
                      fieldName="email"
                      post={
                        <Button
                          type="link"
                          style={{ color: COLORS.GREEN }}
                          icon={<SaveOutlined />}
                          onClick={updateEmail}
                          disabled={disableButton(email, user.attributes.email)}
                        />
                      }
                    />
                  </Col>
                </Row>
                <p>&nbsp;</p>
                <Row>
                  <Col>{otpMode ? displayOtp("email") : null}</Col>
                </Row>
              </TabPane>
              <TabPane tab="Password" key="3">
                <Row justify="start">
                  <Col>
                    <PasswordInput user={user} />
                  </Col>
                </Row>
                <p>&nbsp;</p>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      ) : (
        <Skeleton active />
      )}
    </Fragment>
  );
}
