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
import {
  countrylist,
  getDiscountRate,
  getRiskProfileOptions,
  getTaxLiabilityOptions,
  isMobileDevice,
  toStringArr,
} from "../utils";
import { AppContext } from "../AppContext";
import TextInput from "../form/textinput";
import PasswordInput from "./PasswordInput";
import ImageInput from "./ImageInput";
import { COLORS } from "../../CONSTANTS";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import OtpDialogue from "./OtpDialogue";
import {
  doesEmailExist,
  doesImExist,
  doesMobExist,
  updateUserDetails,
} from "../userinfoutils";
import DateInput from "../form/DateInput";
import SelectInput from "../form/selectinput";
import NumberInput from "../form/numberinput";
import RadialInput from "../form/radialinput";
import DeleteAccount from "./DeleteAccount";
import RadioInput from "../form/RadioInput";
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
  lifeExpectancy: 0,
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

export default function UserSettings(): JSX.Element {
  const {
    user,
    defaultCountry,
    validateCaptcha,
    owner,
    userInfo,
    discountRate,
    setDiscountRate,
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
    lifeExpectancy,
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
  const disableButton = (prevValue: any, currValue: any) =>
    prevValue === currValue ? true : error.length > 0 ? true : false;
  const sendOtp = async () =>
    user?.attributes?.phone_number &&
    (await Auth.resendSignUp(user?.attributes?.phone_number));

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
        await updateUserDetails({ uname: owner, im: data as number });
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
    } catch (error) {
      failure(`Unable to update ${error}`);
    }
  };

  const updatePersonalTab = async () => {
    setLoading(true);
    try {
      const getStr = (num: number) => (num < 10 ? `0${num}` : "" + num);
      await Auth.updateUserAttributes(user, {
        name: name,
        family_name: lastName,
      });
      await updateUserDetails({
        uname: owner,
        dob: `${dobYear}-${getStr(dobMonth)}-${getStr(dobDate)}`,
      });
      success("Updated Successfully");
    } catch (error) {
      failure(`Unable to update ${error}`);
    }
    setLoading(false);
  };

  const updateOthersTab = async () => {
    setLoading(true);
    try {
      await updateUserDetails({
        uname: owner,
        rp: riskProfile,
        tax,
        le: lifeExpectancy,
      });
      success("Updated Successfully");
    } catch {
      failure("Unable to update");
    }
    setLoading(false);
  };

  const updatePreferenceTab = async () => {
    setLoading(true);
    try {
      await updateUserDetails({
        uname: owner,
        dr: isDrManual ? discountRate : 0,
        notify,
      });
      success("Updated Successfully");
    } catch {
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
    if (userInfo) {
      const { rp, notify, dr, tax, le, dob } = userInfo;
      const date = new Date(dob);
      dispatch({
        type: "userUpdate",
        data: {
          riskProfile: rp,
          notify,
          tax,
          isDrManual: !dr ? 0 : 1,
          lifeExpectancy: le,
          dobYear: date.getFullYear(),
          dobMonth: date.getMonth() + 1,
          dobDate: date.getDate(),
        },
      });
    }
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
      {error ? <Alert type="error" message={error} /> : null}
      {user ? (
        <Tabs
          className="settings-tab-view"
          tabPosition={isMobileDevice(fsb) ? "top" : "left"}
          type={isMobileDevice(fsb) ? "card" : "line"}
          animated
        >
          <TabPane className="settings-tabpane-view" tab="Personal" key="1">
            <Row gutter={[20, 10]}>
              <Col className="personal-tabpane-image-view">
                <ImageInput user={user} />
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Row gutter={[10, 10]}>
                  <Col span={24}>
                    <Row gutter={[0, 5]}>
                      <Col span={24}>First Name</Col>
                      <Col xs={24} sm={24} md={12}>
                        <TextInput
                          pre=""
                          placeholder="Name"
                          value={name}
                          changeHandler={(val: any) =>
                            dispatch({
                              type: "single",
                              data: { field: "name", val },
                            })
                          }
                          minLength={2}
                          maxLength={20}
                          setError={(val: any) =>
                            dispatch({
                              type: "single",
                              data: { field: "error", val },
                            })
                          }
                          fieldName="firstname"
                          pattern="^[a-zA-Z'-.,]+$"
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row gutter={[0, 5]}>
                      <Col span={24}>Last Name</Col>
                      <Col xs={24} sm={24} md={12}>
                        <TextInput
                          pre=""
                          placeholder="Last Name"
                          value={lastName}
                          changeHandler={(val: any) =>
                            dispatch({
                              type: "single",
                              data: { field: "lastName", val },
                            })
                          }
                          minLength={2}
                          maxLength={20}
                          setError={(val: any) =>
                            dispatch({
                              type: "single",
                              data: { field: "error", val },
                            })
                          }
                          fieldName="lastname"
                          pattern="^[a-zA-Z'-.,]+$"
                        />
                      </Col>
                    </Row>
                  </Col>
                  {dobDate && (
                    <Col span={24}>
                      <Row gutter={[0, 5]}>
                        <Col span={24}>Date of Birth</Col>
                        <Col xs={24} sm={24} md={12}>
                          <DateInput
                            title=""
                            className="dob"
                            startDateValue={dobDate}
                            startMonthValue={dobMonth}
                            startYearValue={dobYear}
                            startYearHandler={(val: number) =>
                              dispatch({
                                type: "single",
                                data: { field: "dobYear", val },
                              })
                            }
                            startMonthHandler={(val: number) =>
                              dispatch({
                                type: "single",
                                data: { field: "dobMonth", val },
                              })
                            }
                            startDateHandler={(val: number) =>
                              dispatch({
                                type: "single",
                                data: { field: "dobDate", val },
                              })
                            }
                            size="large"
                          />
                        </Col>
                      </Row>
                    </Col>
                  )}
                  <Col span={24}>
                    <Row justify="center">
                      <Col md={12}>
                        <Button
                          type="primary"
                          loading={loading}
                          style={{ color: COLORS.WHITE }}
                          icon={<SaveOutlined />}
                          disabled={error.length > 0 ? true : false}
                          onClick={() => {
                            validateCaptcha("personal_settings").then(
                              (success: boolean) => {
                                if (!success) return;
                                updatePersonalTab();
                              }
                            );
                          }}
                        >
                          Save
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </TabPane>
          <TabPane className="settings-tabpane-view" tab="Profile" key="2">
            <Row gutter={[24, 24]} justify="center">
              <Col xs={24} sm={24} md={8}>
                <Row gutter={[10, 0]}>
                  <Col>
                    <SelectInput
                      info="How much Risk are You willing to take in order to achieve higher Investment Return?"
                      pre="Can Tolerate"
                      unit="Loss"
                      value={riskProfile}
                      changeHandler={(val: string) =>
                        dispatch({
                          type: "single",
                          data: { field: "riskProfile", val },
                        })
                      }
                      options={getRiskProfileOptions()}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Row gutter={[10, 0]}>
                  <Col>
                    <SelectInput
                      info="How much do you earn in a year?"
                      pre="Yearly Income"
                      value={tax}
                      changeHandler={(val: string) =>
                        dispatch({
                          type: "single",
                          data: { field: "tax", val },
                        })
                      }
                      options={getTaxLiabilityOptions()}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Row gutter={[10, 0]}>
                  <Col>
                    <RadialInput
                      pre="Life Expectancy"
                      label="Years"
                      value={lifeExpectancy}
                      changeHandler={(val: number) =>
                        dispatch({
                          type: "single",
                          data: { field: "lifeExpectancy", val },
                        })
                      }
                      step={1}
                      data={toStringArr(70, 100, 1)}
                      labelBottom
                      trackColor={COLORS.WHITE}
                      info="This will be used to define the duration for which Financial Planning is Needed."
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row justify="center">
              <Col>
                <Button
                  type="primary"
                  loading={loading}
                  style={{ color: COLORS.WHITE }}
                  icon={<SaveOutlined />}
                  onClick={() => {
                    validateCaptcha("profile_settings").then(
                      (success: boolean) => {
                        if (!success) return;
                        updateOthersTab();
                      }
                    );
                  }}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </TabPane>
          <TabPane className="settings-tabpane-view" tab="Account" key="3">
            <Row gutter={[0, 24]}>
              <Col xs={24} sm={24} md={12}>
                <Row gutter={[10, 10]}>
                  <Col span={24}>Login Name</Col>
                  <Col xs={24} sm={24} md={12}>
                    <TextInput
                      pre=""
                      value={prefuser}
                      changeHandler={(val: any) =>
                        dispatch({
                          type: "single",
                          data: { field: "prefuser", val },
                        })
                      }
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
                </Row>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Row gutter={[0, 10]}>
                  <Col span={24}>Email Id</Col>
                  <Col xs={24} sm={24} md={12}>
                    <TextInput
                      pre=""
                      placeholder={"abc@xyz.com"}
                      value={email}
                      changeHandler={(val: any) =>
                        dispatch({
                          type: "single",
                          data: { field: "email", val },
                        })
                      }
                      pattern={
                        "^(?!.*(?:.-|-.))[^@]+@[^W_](?:[w-]*[^W_])?(?:.[^W_](?:[w-]*[^W_])?)+$"
                      }
                      setError={(val: any) =>
                        dispatch({
                          type: "single",
                          data: { field: "error", val },
                        })
                      }
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
                </Row>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Row gutter={[0, 10]}>
                  <Col span={24}>Mobile</Col>
                  <Col xs={24} sm={24} md={12}>
                    <TextInput
                      pre=""
                      prefix={countryCode?.value}
                      value={mobile}
                      changeHandler={(val: any) =>
                        dispatch({
                          type: "single",
                          data: { field: "mobile", val },
                        })
                      }
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
                              { phone_number: countryCode?.value + mobile }
                            )
                          }
                          resendOtp={sendOtp}
                        />
                      }
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Row gutter={[0, 10]}>
                  <Col span={24}>Whatsapp</Col>
                  <Col xs={24} sm={24} md={12}>
                    <TextInput
                      pre=""
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
                              { nickname: countryCode?.value + whatsapp }
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
              <Col xs={24} sm={24} md={12}>
                <DeleteAccount />
              </Col>
            </Row>
          </TabPane>
          <TabPane className="settings-tabpane-view" tab="Password" key="4">
            <Row justify="start">
              <Col>
                <PasswordInput user={user} />
              </Col>
            </Row>
          </TabPane>
          <TabPane className="settings-tabpane-view" tab="Preferences" key="5">
            <Row gutter={[24,24]}>
              <Col>
                <Row gutter={[24, 24]}>
                  <Col>
                    <NumberInput
                      unit="%"
                      pre="Discount Rate"
                      value={discountRate}
                      changeHandler={setDiscountRate}
                      disabled={!isDrManual}
                      addBefore={
                        <SelectInput
                          pre=""
                          value={isDrManual ? "manual" : "auto"}
                          options={{ manual: "Manual", auto: "Auto" }}
                          changeHandler={(value: string) =>
                            dispatch({
                              type: "single",
                              data: {
                                field: "isDrManual",
                                val: value === "manual",
                              },
                            })
                          }
                        />
                      }
                    />
                  </Col>
                  <Col>
                    Subscribe to offers and newsletters
                    <br />
                    <RadioInput
                      options={["Yes", "No"]}
                      value={notify ? "Yes" : "No"}
                      changeHandler={(value: string) =>
                        dispatch({
                          type: "single",
                          data: { field: "notify", val: value === "Yes" },
                        })
                      }
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Button
                  type="primary"
                  loading={loading}
                  style={{ color: COLORS.WHITE }}
                  icon={<SaveOutlined />}
                  onClick={() => {
                    validateCaptcha("preferences_settings").then(
                      (success: boolean) => {
                        if (!success) return;
                        updatePreferenceTab();
                      }
                    );
                  }}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      ) : (
        <Skeleton active />
      )}
    </Fragment>
  );
}
