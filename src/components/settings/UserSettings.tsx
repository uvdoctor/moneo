import { Alert, Col, Row, notification, Skeleton, Form, Input } from "antd";
import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import TextInput from "../form/textinput";
import ModalComponent from "./ModalComponent";
import { AppContext } from "../AppContext";
import { Auth } from "aws-amplify";
import { useForm } from "antd/lib/form/Form";
import { countrylist } from "./CountryCode";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import "antd/lib/date-picker/style/index";
import { parse } from "date-fns";
import generatePicker from "antd/lib/date-picker/generatePicker";

const dateFormat = "yyyy-MM-dd";
const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

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
  const surname = useRef<string>("");
  const dob = useRef<string>("");
  const oldPass = useRef<string>("");
  const newPass = useRef<string>("");
  const [form] = useForm();

  const counCode = countrylist.find(
    (item) => item.countryCode === defaultCountry
  );

  const handleFormChange = () => {
    setDisabledForm(
      form.getFieldsError().some(({ errors }) => errors.length) ||
        !form.isFieldsTouched(true)
    );
  };

  const disableButton = (prevValue: any, currValue: any) => {
    return prevValue === currValue ? true : error.length > 0 ? true : false;
  };

  const success = (message: any) => notification.success({ message: message });

  const failure = (message: any) => notification.error({ message: message });

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
    const attrValue = [name.current, middleName.current, surname.current];
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
    Auth.changePassword(user, oldPass.current, newPass.current)
      .then(() => {
        success("Password Updated");
      })
      .catch((err) => {
        failure("Wrong Credentials" + err.message);
      });
  };

  const nameRules = () => [
    {
      pattern: new RegExp("^[a-zA-Z'-.,]+$"),
      message: "Invalid Format",
    },
    {
      min: 2,
      max: 20,
      message: "Length 2-20",
    },
  ];

  useEffect(() => {
    if (!user) return;
    setContact(user.attributes.phone_number);
    setEmail(user.attributes.email);
    setContact(user.attributes.phone_number.replace(counCode?.value, ""));
  }, [appContextLoaded]);

  return (
    <Fragment>
      {error ? (
        <Fragment>
          <Alert type="error" message={error} />
        </Fragment>
      ) : null}
      <Row justify="center" style={{ fontSize: 25 }}>
        Settings
      </Row>
      <p>&nbsp;</p>
      {appContextLoaded ? (
        <Fragment>
          <Row justify="center">
            <Col>
              <Input
                addonBefore="Name"
                value={`${user?.attributes.name || ""} ${
                  user?.attributes.middle_name || ""
                } ${user?.attributes.family_name || ""}`}
                style={{ width: 400 }}
                disabled={true}
                size={"large"}
              />
            </Col>
            <Col>
              <ModalComponent
                perform={updateName}
                onClickAction={null}
                disableModal={disabledForm}
                disableButton={false}
                action={"name_change"}
                icon={"Edit"}
                content={
                  <Form
                    name="namechange"
                    layout="vertical"
                    form={form}
                    onFieldsChange={handleFormChange}
                  >
                    <Form.Item
                      name="name"
                      label="Enter your name"
                      required={true}
                      initialValue={user?.attributes.name}
                      rules={nameRules()}
                    >
                      <Input
                        onChange={(e) => (name.current = e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="middleName"
                      label="Enter your Middle Name"
                      initialValue={user?.attributes.middle_name}
                      rules={nameRules()}
                    >
                      <Input
                        onChange={(e) => (middleName.current = e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="surname"
                      label="Enter your Surname"
                      rules={nameRules()}
                      initialValue={user?.attributes.family_name}
                    >
                      <Input
                        onChange={(e) => (surname.current = e.target.value)}
                      />
                    </Form.Item>
                  </Form>
                }
              />
            </Col>
          </Row>
          <p>&nbsp;</p>
          <Row justify="center">
            <Col>
              <TextInput
                pre="Contact"
                prefix={counCode?.value}
                value={contact}
                changeHandler={setContact}
                fieldName="contact"
                pattern="^[0-9]"
                setError={setError}
                minLength={10}
                maxLength={10}
              />
            </Col>
            <Col>
              <ModalComponent
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
            </Col>
          </Row>
          <p>&nbsp;</p>
          <Row justify="center">
            <Col>
              <TextInput
                pre="Email Id"
                value={email}
                changeHandler={setEmail}
                pattern="^(?!.*(?:\.-|-\.))[^@]+@[^\W_](?:[\w-]*[^\W_])?(?:\.[^\W_](?:[\w-]*[^\W_])?)+$"
                setError={setError}
                fieldName="email"
              />
            </Col>
            <Col>
              <ModalComponent
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
            </Col>
          </Row>
          <p>&nbsp;</p>
          <Row justify="center">
            <Col>
              <Input.Password
                addonBefore="Password"
                value={"********"}
                disabled={true}
                style={{ width: 400 }}
                size={"large"}
              />
            </Col>
            <Col>
              <ModalComponent
                content={
                  <Form
                    name="password"
                    layout="vertical"
                    form={form}
                    onFieldsChange={handleFormChange}
                  >
                    <Form.Item
                      name="oldpassword"
                      label="Enter Your Old Password"
                      required={true}
                    >
                      <Input.Password
                        allowClear
                        onChange={(e) => (oldPass.current = e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      required={true}
                      rules={[
                        {
                          min: 8,
                          max: 20,
                          message: "Password must be between 8-20 length",
                        },
                        {
                          pattern: new RegExp("(?=.*[a-z])"),
                          message: "Atleast one lowercase",
                        },
                        {
                          pattern: new RegExp("(?=.*[A-Z])"),
                          message: "Atleast one uppercase",
                        },
                        {
                          pattern: new RegExp(".*[0-9].*"),
                          message: "Atleast one digit",
                        },
                        {
                          pattern: new RegExp("(?=.*[!@#$%^&*])"),
                          message: "Atleast one special characters",
                        },
                      ]}
                    >
                      <Input.Password
                        allowClear
                        onChange={(e) => (newPass.current = e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="reenterPassword"
                      label="Re-enter Password"
                      dependencies={["newPassword"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (getFieldValue("newPassword") === value)
                              return Promise.resolve();
                            return Promise.reject(
                              "The two passwords that you entered do not match!"
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password allowClear />
                    </Form.Item>
                  </Form>
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
          <Row justify="center">
            <Col>
              <Input.Group style={{ width: 400 }} size="large">
                <Input
                  style={{ width: "30%" }}
                  defaultValue="DOB"
                  disabled={true}
                />
                <DatePicker
                  style={{ width: "70%" }}
                  defaultValue={parse(
                    user?.attributes.birthdate,
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
        </Fragment>
      ) : (
        <Skeleton active />
      )}
    </Fragment>
  );
}
