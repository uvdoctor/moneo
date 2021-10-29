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
import "./Settings.less";
import ImageInput from "./ImageInput";
import { COLORS } from "../../CONSTANTS";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import OtpDialogue from "./OtpDialogue";

const dateFormat = "yyyy-MM-dd";
const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

export default function UserSettings(): JSX.Element {
  const { user, appContextLoaded, defaultCountry, validateCaptcha }: any = useContext(AppContext);
  const [email, setEmail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [error, setError] = useState<any>("");
  const [name, setName] = useState<string>(user?.attributes.name);
  const [lastName, setLastName] = useState<string>("");
  const [dob, setDob] = useState<string>();
  const { TabPane } = Tabs;
  const fsb = useFullScreenBrowser();

  const success = (message: any) => notification.success({ message });
  const failure = (message: any) => notification.error({ message });

  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const counCode = countrylist.find((item) => item.countryCode === defaultCountry);

  const disableButton = (prevValue: any, currValue: any) =>
    prevValue === currValue ? true : error.length > 0 ? true : false;

  const updatePhoneNumber = async () => {
    try {
      await Auth.updateUserAttributes(user, { phone_number: `${counCode?.value}${contact}` });
      success("Contact updated successfully. Enter Otp to verify");
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateEmail = async () => {
    try {
      await Auth.updateUserAttributes(user, { email: email });
      success("Email updated successfully. Enter Otp to verify");
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updatePersonaTab = async () => {
    try {
      await Auth.updateUserAttributes(user, { name:name, family_name:lastName, birthdate:dob });
      success("Updated Successfully");
    } catch (error) {
      failure(`Unable to update ${error}`);
    }
  };

  useEffect(() => {
    if (!user) return;
    setEmail(user?.attributes.email);
    setName(user?.attributes.name);
    setLastName(user?.attributes.family_name);
    setDob(user?.attributes.birthdate);
    setContact(user?.attributes.phone_number.replace(counCode?.value, ""));
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
                      <Col className="first-col-view">
                        <TextInput
                          pre="First Name"
                          placeholder="Name"
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
                          placeholder="Last Name"
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
                            defaultValue={parse( user?.attributes.birthdate || getTodayDate(), dateFormat, new Date() )}
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
                        <Button
                          type="primary"
                          style={{ color: COLORS.WHITE }}
                          icon={<SaveOutlined />}
                          disabled={error.length > 0 ? true : false}
                          onClick={()=>{
                            validateCaptcha("personalTab_change").then((success: boolean) => {
                              if (!success) return;
                              updatePersonaTab();
                            })
                          }
                        }
                        >
                          Save
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Contact" key="2">
                <Row justify="start">
                  <Col className="first-col-view">
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
                        <OtpDialogue
                          disableButton={disableButton(user?.attributes.phone_number, `${counCode?.value}${contact}` )}
                          action={"phone_number"}
                          onClickAction={updatePhoneNumber}
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
                      pattern={"^(?!.*(?:.-|-.))[^@]+@[^W_](?:[w-]*[^W_])?(?:.[^W_](?:[w-]*[^W_])?)+$"}
                      setError={setError}
                      fieldName="email"
                      post={
                        <OtpDialogue
                          disableButton={disableButton( email, user?.attributes.email )}
                          action={"email"}
                          onClickAction={updateEmail}
                        />
                      }
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Password" key="3">
                <Row justify="start">
                  <Col>
                    <PasswordInput user={user} />
                  </Col>
                </Row>
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
