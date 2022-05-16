import {
  Alert,
  Col,
  Row,
  notification,
  Skeleton,
  Tabs,
  PageHeader,
  Button,
  Checkbox,
} from "antd";
import React, {
  Fragment,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { Auth } from "aws-amplify";
import { countrylist, getDiscountRate, isMobileDevice } from "../utils";
import { AppContext } from "../AppContext";
import TextInput from "../form/textinput";
import PasswordTab from "./PasswordTab";
import { COLORS } from "../../CONSTANTS";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import OtpDialogue from "./OtpDialogue";
import {
  doesEmailExist,
  doesImExist,
  doesMobExist,
  updateUserDetails,
} from "../userinfoutils";
import DeleteAccount from "./DeleteAccount";
import SaveButton from "./SaveButton";
import PersonalTab from "./PersonalTab";
import ProfileTab from "./ProfileTab";
require("./UserSettings.less");

const initialState = {
  email: "",
  mobile: "",
  error: [],
  name: "",
  lastName: "",
  prefuser: "",
  dobMonth: "",
  dobYear: "",
  dobDate: "",
  whatsapp: "",
  riskProfile: "",
  isDrManual: 0,
  notify: 0,
  tax: "",
};

const userReducer = (
  userState: any,
  { type, data }: { type: string; data: any }
) => {
  switch (type) {
    case "single":
      return {
        ...userState,
        [data.field]: data.val,
      };
    default:
      return {
        ...userState,
        ...data,
      };
  }
};

export default function UserSettings() {
  const {
    user,
    defaultCountry,
    validateCaptcha,
    owner,
    userInfo,
    discountRate,
    setDiscountRate,
    appContextLoaded,
    setUserInfo,
  }: any = useContext(AppContext);
  const [userState, dispatch] = useReducer(userReducer, initialState);
  const {
    email,
    mobile,
    error,
    name,
    lastName,
    prefuser,
    whatsapp,
    riskProfile,
    notify,
    isDrManual,
    tax,
    dobDate,
    dobMonth,
    dobYear,
  } = userState;
  const [loading, setLoading] = useState<boolean>(false);
  const fsb = useFullScreenBrowser();
  const { TabPane } = Tabs;
  const countryCode = countrylist.find(
    (item) => item.countryCode === defaultCountry
  );
  const countryCodeWithoutPlusSign = countryCode
    ? countryCode.value.slice(1)
    : "91";
  const success = (message: any) => notification.success({ message });
  const failure = (message: any) => notification.error({ message });
  const sendOtp = async () =>
    user?.attributes?.phone_number &&
    (await Auth.resendSignUp(user?.attributes?.phone_number));

  const disableButton = (prevValue: any, currValue: any) =>
    prevValue === currValue ? true : error.length > 0 ? true : false;

  const updateAccountTab = async (
    input: string,
    func: Function,
    attr: String,
    updateAttr: any
  ) => {
    try {
      const data =
        attr === "Email" ? input : Number(countryCodeWithoutPlusSign + input);
      if (await func(data)) {
        failure(`${attr} is already used by another account`);
        return false;
      }
      await Auth.updateUserAttributes(user, updateAttr);
      success(
        `${attr} updated successfully. ${
          attr === "Whatsapp Number" ? "" : "Enter Otp to verify"
        }`
      );
      if (attr === "Whatsapp Number") {
        const result = await updateUserDetails({
          uname: owner,
          im: data as number,
        });
        setUserInfo(result);
      }
      return true;
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateImIfSameAsMob = async () => {
    if (user?.attributes?.phone_number) {
      dispatch({ type: "single", data: { field: "whatsapp", val: mobile } });
      await updateAccountTab(mobile, doesImExist, "Whatsapp Number", {
        nickname: countryCode?.value + mobile,
      });
    } else {
      failure("Update your mobile, your mobile number is empty.");
    }
  };

  const updatePrefUsername = async () => {
    try {
      await Auth.updateUserAttributes(user, { preferred_username: prefuser });
      success("Preferred username updated successfully");
    } catch (error: any) {
      failure(`Unable to update ${error.message}`);
    }
  };

  const updatePersonalTab = async () => {
    setLoading(true);
    try {
      const getStr = (num: number) => (num < 10 ? `0${num}` : "" + num);
      let input: { [key: string]: string } = {};
      if (user?.attributes.name !== name) input.name = name;
      if (user?.attributes.family_name !== lastName)
        input.family_name = lastName;
      if (Object.keys(input).length) {
        await Auth.updateUserAttributes(user, input);
      }
      const result = await updateUserDetails({
        uname: owner,
        dob: `${dobYear}-${getStr(dobMonth)}-${getStr(dobDate)}`,
      });
      setUserInfo(result);
      success("Updated Successfully");
    } catch (error) {
      failure(`Unable to update ${error}`);
    }
    setLoading(false);
  };

  const updateProfileTab = async () => {
    setLoading(true);
    try {
      const results = await updateUserDetails({
        uname: owner,
        dr: isDrManual ? discountRate : 0,
        notify,
        rp: riskProfile,
        tax,
      });
      setUserInfo(results);
      success("Updated Successfully");
    } catch (error) {
      failure("Unable to update");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    const {
      phone_number,
      nickname,
      preferred_username,
      family_name,
      email,
      name,
    } = user?.attributes;
    const mobile = phone_number
      ? phone_number.replace(countryCode?.value, "")
      : "";
    const whatsapp = nickname ? nickname.replace(countryCode?.value, "") : "";
    dispatch({
      type: "userUpdate",
      data: {
        email,
        mobile,
        name,
        whatsapp,
        lastName: family_name,
        prefuser: preferred_username,
      },
    });
  }, [countryCode?.value, user]);

  useEffect(() => {
    if (!userInfo) return;
    const { rp, notify, dr, tax, dob, tid, exp, ta, invest } = userInfo;
    const date = new Date(dob);
    dispatch({
      type: "userUpdate",
      data: {
        riskProfile: rp,
        notify,
        tax,
        isDrManual: !dr ? 0 : 1,
        dobYear: date.getFullYear(),
        dobMonth: date.getMonth() + 1,
        dobDate: date.getDate(),
        tid,
        exp,
        ta,
        invest,
      },
    });
  }, [userInfo]);

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
            animated>
            <TabPane className="settings-tabpane-view" tab="Personal" key="1">
              <Row>
                <Col span={24}>
                  <PersonalTab
                    name={name}
                    lastName={lastName}
                    dispatch={dispatch}
                    dobDate={dobDate}
                    dobMonth={dobMonth}
                    dobYear={dobYear}
                    user={user}
                  />
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
              <Row>
                <Col span={24}>
                  <ProfileTab
                    dispatch={dispatch}
                    isDrManual={isDrManual}
                    notify={notify}
                    riskProfile={riskProfile}
                    tax={tax}
                  />
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
                    changeHandler={(val: any) =>
                      dispatch({
                        type: "single",
                        data: { field: "prefuser", val },
                      })
                    }
                    style={{ width: 300 }}
                    fieldName="prefusername"
                    setError={(val: any) =>
                      dispatch({
                        type: "single",
                        data: { field: "error", val },
                      })
                    }
                    post={
                      <Button
                        type="link"
                        style={{ color: COLORS.GREEN }}
                        icon={<SaveOutlined />}
                        disabled={error.length > 0 ? true : false}
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
                    changeHandler={(val: any) =>
                      dispatch({
                        type: "single",
                        data: { field: "email", val },
                      })
                    }
                    pattern={
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    }
                    setError={(val: any) =>
                      dispatch({
                        type: "single",
                        data: { field: "error", val },
                      })
                    }
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
                        resendOtp={sendOtp}
                      />
                    }
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <TextInput
                    pre="Mobile"
                    prefix={countryCode?.value}
                    value={mobile}
                    changeHandler={(val: any) =>
                      dispatch({
                        type: "single",
                        data: { field: "mobile", val },
                      })
                    }
                    style={{ width: 300 }}
                    fieldName="mobile"
                    pattern="^[0-9]"
                    setError={(val: any) =>
                      dispatch({
                        type: "single",
                        data: { field: "error", val },
                      })
                    }
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
                        resendOtp={sendOtp}
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
                        changeHandler={(val: any) =>
                          dispatch({
                            type: "single",
                            data: { field: "whatsapp", val },
                          })
                        }
                        fieldName="whatsapp"
                        pattern="^[0-9]"
                        setError={(val: any) =>
                          dispatch({
                            type: "single",
                            data: { field: "error", val },
                          })
                        }
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
                        }>
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
