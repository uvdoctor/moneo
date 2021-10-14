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
  const [disabledForm, setDisabledForm] = useState(true);
  const [email, setEmail] = useState<string>(user?.attributes.email);
  const [contact, setContact] = useState<string>(user?.attributes.phone_number);
  const [error, setError] = useState<any>("");
  const otp = useRef<any>("");
  const name = useRef<string>("");
  const middleName = useRef<string>("");
  const surname = useRef<string>("");
  const dob = useRef<string>(user?.attributes.birthdate || "");
  const oldPass = useRef<string>("");
  const newPass = useRef<string>("");
  const attrName = useRef<string>("");
  const [form] = useForm();

  const counCode = countrylist.find(
    (item) => item.countryCode === defaultCountry
  );

  const handleFormChange = () =>
    setDisabledForm(
      form.getFieldsError().some(({ errors }) => errors.length) ||
        !form.isFieldsTouched(true)
    );

  const success = () =>
    notification.success({ message: "Updated Successfully" });

  const failure = () =>
    notification.error({ message: `Unable to update, ${error}` });

  const updateUserAttributes = (attr: string, attrValue: any) =>
    Auth.updateUserAttributes(user, { [attr]: attrValue });

  const updatePhoneNumber = async () => {
    try {
      await updateUserAttributes(
        "phone_number",
        `${counCode?.value}${contact}`
      );
      success();
    } catch (error) {
      failure();
    }
  };

  const updateEmail = async () => {
    try {
      await updateUserAttributes("email", setEmail);
      success();
    } catch (error) {
      failure();
    }
  };

  const updateBirthDate = async () => {
    try {
      await updateUserAttributes("birthdate", dob.current);
      success();
    } catch (error) {
      failure();
    }
  };

  const updateName = async () => {
    const attr = ["name", "middle_name", "family_name"];
    const attrValue = [name.current, middleName.current, surname.current];
    const dataValue = [];
    for (const ind in attr) {
      attrName.current = attr[ind];
      try {
        const data = await Auth.updateUserAttributes(user, {
          [attr[ind]]: attrValue[ind],
        });
        dataValue.push(data);
      } catch (error) {
        dataValue.push(error);
      }
    }
    const check = (ele: any, _index: number, _array: any) => {
      return ele === "SUCCESS";
    };
    if (dataValue.every(check)) {
      success();
    } else {
      failure();
    }
  };

  const confirmOtp = async (attrName: string) => {
    Auth.verifyCurrentUserAttributeSubmit(attrName, otp.current)
      .then(() => {
        notification.success({
          message: "Otp Verified Successfully",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Wrong Otp" + err.message,
        });
      });
  };

  const editPassword = async () => {
    Auth.changePassword(user, oldPass.current, newPass.current)
      .then(() => {
        notification.success({
          message: "Password Updated",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Wrong Credentials" + err.message,
        });
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
      <p>&nbsp;</p>
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
                disableModal={false}
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
                      rules={nameRules()}
                    >
                      <Input
                        defaultValue={user?.attributes.name}
                        onChange={(e) => (name.current = e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="middleName"
                      label="Enter your Middle Name"
                      rules={nameRules()}
                    >
                      <Input
                        defaultValue={user?.attributes.middle_name}
                        onChange={(e) => (middleName.current = e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item
                      name="surname"
                      label="Enter your Surname"
                      rules={nameRules()}
                    >
                      <Input
                        defaultValue={user?.attributes.family_name}
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
                disableButton={
                  user.attributes.phone_number ===
                  `${counCode?.value}${contact}`
                    ? true
                    : error.length > 0
                    ? true
                    : false
                }
                action={"contact_change"}
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
                disableButton={
                  email === user.attributes.email
                    ? true
                    : error.length > 0
                    ? true
                    : false
                }
                action={"contact_change"}
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
                perform={null}
                onClickAction={updateBirthDate}
                disableModal={false}
                disableButton={false}
                action={"dob_change"}
                icon={"Save"}
                content={null}
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
