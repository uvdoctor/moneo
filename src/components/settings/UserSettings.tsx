import {
  Alert,
  Col,
  Row,
  notification,
  Skeleton,
  Input,
  Tabs,
  PageHeader,
} from "antd";
import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { Auth } from "aws-amplify";
import { parse } from "date-fns";
import { isMobileDevice } from "../utils";
import { AppContext } from "../AppContext";
import { countrylist } from "./CountryCode";
import TextInput from "../form/textinput";
import ModalComponent from "./ModalComponent";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import generatePicker from "antd/lib/date-picker/generatePicker";
import NameComponent from "../form/NameInput";
import PasswordInput from "../form/PasswordInput";
import "antd/lib/date-picker/style/index";
import "./Layout.less";
import GoalImage from "../calc/GoalImage";
const dateFormat = "yyyy-MM-dd";
const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
};

export default function UserSettings(): JSX.Element {
  const { user, appContextLoaded, defaultCountry }: any =
    useContext(AppContext);
  const [disabledForm, setDisabledForm] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [error, setError] = useState<any>("");
  const otp = useRef<any>("");
  const name = useRef<string>("");
  const middleName = useRef<string>("");
  const lastName = useRef<string>("");
  const dob = useRef<string>("");
  const oldPass = useRef<string>("");
  const pass = useRef<string>("");

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
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateEmail = async () => {
    try {
      await Auth.updateUserAttributes(user, { ["email"]: email });
      success("Email updated successfully");
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateBirthDate = async () => {
    try {
      await Auth.updateUserAttributes(user, { ["birthdate"]: dob.current });
      success("Birthdate updated successfully");
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateName = async () => {
    const attr = ["name", "middle_name", "family_name"];
    const attrValue = [name.current, middleName.current, lastName.current];
    let errorLength = 0;
    for (let ind = 0; ind < attr.length; ind++) {
      try {
        await Auth.updateUserAttributes(user, { [attr[ind]]: attrValue[ind] });
      } catch (error) {
        errorLength++;
        failure(`Unable to update ${attrValue[ind]}, ${error}`);
      }
    }
    if (errorLength === 0) success("Name updated successfully");
  };

  const confirmOtp = async (attr: string) => {
    Auth.verifyCurrentUserAttributeSubmit(attr, otp.current)
      .then(() => {
        success("Otp Verified Successfully");
      })
      .catch((err) => {
        failure("Wrong Otp" + err.message);
      });
  };

  const editPassword = async () => {
    Auth.changePassword(user, oldPass.current, pass.current)
      .then(() => {
        success("Password Updated");
      })
      .catch((err) => {
        failure("Wrong Credentials" + err.message);
      });
  };

  useEffect(() => {
    if (!user) return;
    setEmail(user.attributes.email);
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
          <Col xs={24} sm={24} md={24} lg={12}>
            <Tabs
              tabPosition={isMobileDevice(fsb) ? "top" : "left"}
              type={isMobileDevice(fsb) ? "card" : "line"}
              animated
            >
              <TabPane className="tabPane" tab="Personal" key="1">
                <Row justify="start">
                  <Input
                    style={{ width: 350 }}
                    addonBefore="Profile"
                    value={""}
                    size={"large"}
                  />
                  <GoalImage />
                  {/* <ModalComponent
                    title={"Upload Image"}
                    perform={null}
                    onClickAction={null}
                    disableModal={disabledForm}
                    disableButton={false}
                    action={"name_change"}
                    icon={"Edit"}
                    content={
                      <GoalImage/>
                    } */}
                </Row>
                <p>&nbsp;</p>
                <Row justify="start">
                  <Input
                    style={{ width: 350 }}
                    addonBefore="Name"
                    value={`${user?.attributes.name || ""} ${
                      user?.attributes.middle_name || ""
                    } ${user?.attributes.family_name || ""}`}
                    disabled={true}
                    size={"large"}
                  />
                  <ModalComponent
                    title={"Edit Name"}
                    perform={updateName}
                    onClickAction={null}
                    disableModal={disabledForm}
                    disableButton={false}
                    action={"name_change"}
                    icon={"Edit"}
                    content={
                      <NameComponent
                        name={name}
                        middleName={middleName}
                        lastName={lastName}
                        user={user}
                        setDisabledForm={setDisabledForm}
                      />
                    }
                  />
                </Row>
                <p>&nbsp;</p>
                <Row justify="start">
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
                  />
                  <ModalComponent
                    title={"Enter OTP"}
                    content={
                      <Input
                        addonBefore="OTP"
                        onChange={(e) => (otp.current = e.target.value)}
                      />
                    }
                    perform={confirmOtp}
                    disableModal={false}
                    disableButton={disableButton(
                      user.attributes.phone_number,
                      `${counCode?.value}${contact}`
                    )}
                    action={"phone_change"}
                    icon={"Save"}
                    onClickAction={updatePhoneNumber}
                  />
                </Row>
                <p>&nbsp;</p>
                <Row justify="start">
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
                  />
                  <ModalComponent
                    title={"Enter OTP"}
                    content={
                      <Input
                        addonBefore="OTP"
                        onChange={(e) => (otp.current = e.target.value)}
                      />
                    }
                    perform={confirmOtp}
                    disableModal={false}
                    disableButton={disableButton(email, user.attributes.email)}
                    action={"email_change"}
                    icon={"Save"}
                    onClickAction={updateEmail}
                  />
                </Row>
                <p>&nbsp;</p>
                <Row justify="start">
                  <Col>
                    <Input.Group size="large">
                      <label className="dob">Date of birth</label>
                      <DatePicker
                        style={{ width: 250 }}
                        defaultValue={parse(
                          user?.attributes.birthdate || getTodayDate(),
                          dateFormat,
                          new Date()
                        )}
                        format={dateFormat}
                        size="large"
                        onChange={(_, ds) =>
                          //@ts-ignore
                          (dob.current = ds.toString())
                        }
                      />
                    </Input.Group>
                  </Col>
                  <Col>
                    <ModalComponent
                      title={null}
                      onClickAction={updateBirthDate}
                      disableModal={false}
                      disableButton={false}
                      action={"dob_change"}
                      icon={"Save"}
                      content={null}
                      perform={null}
                    />
                  </Col>
                </Row>
                <p>&nbsp;</p>
              </TabPane>
              <TabPane className="tabPane" tab="Password" key="2">
                <Row justify="start">
                  <Col>
                    <Input.Password
                      addonBefore="Password"
                      value={"********"}
                      disabled={true}
                      size={"large"}
                    />
                  </Col>
                  <Col>
                    <ModalComponent
                      title={"Enter Password"}
                      content={
                        <>
                          <h3>Old Password</h3>
                          <Input.Password
                            allowClear
                            onChange={(e) =>
                              (oldPass.current = e.currentTarget.value)
                            }
                          />
                          <p>&nbsp;</p>
                          <PasswordInput
                            pass={pass}
                            setDisabledForm={setDisabledForm}
                          />
                        </>
                      }
                      perform={editPassword}
                      disableModal={disabledForm}
                      disableButton={false}
                      action={"password_change"}
                      icon={"Edit"}
                      onClickAction={null}
                    />
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
