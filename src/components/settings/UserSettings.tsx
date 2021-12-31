import { Alert, Col, Row, notification, Skeleton, Tabs, PageHeader, Button, Checkbox } from "antd";
import React, { useContext, useEffect, useReducer } from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { Auth } from "aws-amplify";
import { countrylist, getDiscountRate, getRiskProfileOptions, getTaxLiabilityOptions, isMobileDevice } from "../utils";
import { AppContext } from "../AppContext";
import TextInput from "../form/textinput";
import PasswordInput from "./PasswordInput";
import ImageInput from "./ImageInput";
import { COLORS } from "../../CONSTANTS";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import OtpDialogue from "./OtpDialogue";
import { doesEmailExist, doesImExist, doesMobExist, updateUserDetails } from "../userinfoutils";
import DatePickerInput from "../form/DatePickerInput";
import SelectInput from "../form/selectinput";
import HSwitch from "../HSwitch";
import NumberInput from "../form/numberinput";
import { TaxLiability } from "../../api/goals";
require("./Settings.less");

const initialState = {
  email: "",
  mobile: "",
  error: [],
  name: "",
  lastName: "",
  prefuser: "",
  dob: "",
  whatsapp: "",
  riskProfile: "",
  isDrManual: 0,
  notify: 0,
  tax: TaxLiability.M,
}

const userReducer = ( userState: any, { type, data }: { type: string; data: any }) => {
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
  const { user, appContextLoaded, defaultCountry, validateCaptcha, owner, userInfo, discountRate, setDiscountRate }: any = useContext(AppContext);
  const [userState, dispatch] = useReducer(userReducer, initialState);
  const { email, mobile, error, name, lastName, prefuser, dob, whatsapp, riskProfile, notify, isDrManual, tax } = userState;
  const fsb = useFullScreenBrowser();
  const { TabPane } = Tabs;
  
  const countryCode = countrylist.find((item) => item.countryCode === defaultCountry);
  const countryCodeWithoutPlusSign = countryCode ? countryCode.value.slice(1) : "91";

  const success = (message: any) => notification.success({ message });
  const failure = (message: any) => notification.error({ message });
  const disableButton = (prevValue: any, currValue: any) => prevValue === currValue ? true : error.length > 0 ? true : false;

  const sendOtp = async () => {
    user?.attributes?.phone_number && await Auth.resendSignUp(user.attributes.phone_number);
  }

  const updateAccountTab = async (input: string, func: Function, attr: String, updateAttr: any) => {
    try {
      const data = attr === "Email" ? input : Number(countryCodeWithoutPlusSign+input);
      if(await func(data)) { 
        failure(`${attr} is already used by another account`);
        return false;
      }
      await Auth.updateUserAttributes(user, updateAttr );
      success(`${attr} updated successfully. Enter Otp to verify`);
      if(attr === "Whatsapp Number") {
        await updateUserDetails({uname: owner, im: data as number});
      }
      return true;
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  }

  const updateImIfSameAsMob = async () => {
    if(user?.attributes?.phone_number) {
      dispatch({ type: "single", data: { field: "whatsapp", val: mobile }});
      await updateAccountTab(mobile, doesImExist, "Whatsapp Number", { nickname: countryCode?.value+mobile });
    }else{
      failure('Update your mobile, your mobile number is empty.');
    }
  }

  const updatePrefUsername = async () => {
    try {
      await Auth.updateUserAttributes(user, { preferred_username: prefuser });
      success("Preferred username updated successfully");
    } catch (error) {
      failure(`Unable to update ${error}`);
    }
  }

  const updatePersonalTab = async () => {
    try {
      await Auth.updateUserAttributes(user, { name:name, family_name:lastName, birthdate:dob });
      success("Updated Successfully");
    } catch (error) {
      failure(`Unable to update ${error}`);
    }
  };

  const updateOthersTab = async () => {
   await updateUserDetails({uname: owner, dr: isDrManual ? discountRate : 0 , rp: riskProfile, notify: notify, tax: tax})
  }
  
  useEffect(() => {
    if (!user) return;
    const mobile = user?.attributes?.phone_number ? user?.attributes?.phone_number.replace(countryCode?.value, "") : '';
    const whatsapp = user?.attributes?.nickname ? user?.attributes?.nickname.replace(countryCode?.value, "") : '';
    dispatch({ type: "userUpdate", data: { 
      email: user?.attributes?.email || '',
      mobile: mobile,
      name: user?.attributes?.name || '',
      lastName: user?.attributes?.family_name || '',
      prefuser: user?.attributes?.preferred_username || '',
      dob: user?.attributes?.birthdate || '',
      whatsapp: whatsapp }
    });
  }, [appContextLoaded, countryCode?.value, user]);

  useEffect(()=>{
    userInfo && dispatch({ type: "userUpdate", data: { 
      riskProfile: userInfo?.rp,
      notify: userInfo?.notify, 
      isDrManual: !userInfo?.dr ? 0 : 1,
      tax: userInfo?.tax 
    }});
  },[ userInfo ])

  useEffect(()=>{
    !isDrManual && setDiscountRate(getDiscountRate(riskProfile, defaultCountry));
  },[riskProfile, defaultCountry, userInfo, isDrManual ])  

  return (
    <>
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
              <TabPane tab="Personal" key="1">
                <Row className="tabPane">
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
                          changeHandler={(val: any)=>dispatch({ type: "single", data: { field: "name", val}})}
                          width={300}
                          minLength={2}
                          maxLength={20}
                          setError={(val: any)=>dispatch({ type: "single", data: { field: "error", val}})}
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
                          changeHandler={(val: any)=>dispatch({ type: "single", data: { field: "lastName",  val}})}
                          width={300}
                          minLength={2}
                          maxLength={20}
                          setError={(val: any)=>dispatch({ type: "single", data: { field: "error", val}})}
                          fieldName="lastname"
                          pattern="^[a-zA-Z'-.,]+$"
                        />
                      </Col>
                    </Row>
                    <span>&nbsp;</span>
                    <Row justify="center">
                      <Col>
                        <DatePickerInput title={"Date of birth"} className="dob" value={dob} changeHandler={(val: any)=>dispatch({ type: "single", data: { field: "dob", val}})}/>
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
                              updatePersonalTab();
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
              <TabPane tab="Account" key="2">
              <Row justify="start" className="tabPane">
                <Col>
                <Row justify="start">
                  <Col className="first-col-view">
                    <TextInput
                      pre="Login Name"
                      value={prefuser}
                      changeHandler={(val: any)=>dispatch({ type: "single", data: { field: "prefuser", val}})}
                      fieldName="prefusername"
                      setError={(val: any)=>dispatch({ type: "single", data: { field: "error", val}})}
                      post={
                        <Button
                          type="link"
                          style={{ color: COLORS.GREEN }}
                          icon={<SaveOutlined />}
                          disabled={error.length > 0 ? true : false}
                          onClick={()=>{
                            validateCaptcha("prefusername_change").then((success: boolean) => {
                              if (!success) return;
                              updatePrefUsername();
                            })
                          }
                        }
                    />}
                    />
                  </Col>
                </Row>
                <p>&nbsp;</p>
                <Row justify="start">
                  <Col>
                    <TextInput
                      pre="Mobile"
                      prefix={countryCode?.value}
                      value={mobile}
                      changeHandler={(val: any)=>dispatch({ type: "single", data: { field: "mobile", val}})}
                      fieldName="mobile"
                      pattern="^[0-9]"
                      setError={(val: any)=>dispatch({ type: "single", data: { field: "error", val}})}
                      minLength={10}
                      maxLength={10}
                      post={
                        <OtpDialogue
                          disableButton={disableButton(user?.attributes?.phone_number, countryCode?.value+mobile)}
                          action={"phone_number"}
                          mob={parseFloat(countryCodeWithoutPlusSign+mobile)}
                          onClickAction={()=>updateAccountTab(mobile, doesMobExist, "Mobile Number", { phone_number: countryCode?.value+mobile })}
                          resendOtp={sendOtp}             
                        />
                      }
                    />
                  </Col>
                </Row>
                <p>&nbsp;</p>
                <Row justify="start">
                  <Col>
                   <Checkbox checked={whatsapp===mobile} onChange={(e) => e.target.checked ? updateImIfSameAsMob() : null}>
                    <strong>Whatsapp number same as mobile number</strong>
                   </Checkbox>
                  </Col>
                </Row>
                <Row justify="start">
                  <Col>
                    <TextInput
                      pre="Whatsapp"
                      prefix={countryCode?.value}
                      value={whatsapp}
                      changeHandler={(val: any)=>dispatch({ type: "single", data: { field: "whatsapp", val}})}
                      fieldName="whatsapp"
                      pattern="^[0-9]"
                      setError={(val: any)=>dispatch({ type: "single", data: { field: "error", val}})}
                      minLength={10}
                      maxLength={10}
                      post={
                        <OtpDialogue
                          disableButton={disableButton(user?.attributes?.nickname, countryCode?.value+whatsapp)}
                          action={"whatsapp_number"}
                          im={parseFloat(countryCodeWithoutPlusSign+mobile)}
                          onClickAction={()=>updateAccountTab(whatsapp, doesImExist, "Whatsapp Number", { nickname: countryCode?.value+whatsapp })}              
                        />}
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
                      changeHandler={(val: any)=>dispatch({ type: "single", data: { field: "email", val}})}
                      pattern={"^(?!.*(?:.-|-.))[^@]+@[^W_](?:[w-]*[^W_])?(?:.[^W_](?:[w-]*[^W_])?)+$"}
                      setError={(val: any)=>dispatch({ type: "single", data: { field: "error", val}})}
                      fieldName="email"
                      post={
                        <OtpDialogue
                          disableButton={disableButton(email, user?.attributes?.email)}
                          action={"email"}
                          onClickAction={()=>updateAccountTab(email, doesEmailExist, "Email", { email: email })}
                          email={email}
                          mob={parseFloat(countryCodeWithoutPlusSign + mobile)}
                          im={parseFloat(countryCodeWithoutPlusSign + whatsapp)}
                          resendOtp={sendOtp}/>}
                      />
                  </Col>
                </Row>
                </Col>
                </Row>
              </TabPane>
              <TabPane tab="Password" key="3">
                <Row justify="start" className="tabPane">
                  <Col>
                    <PasswordInput user={user} />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Others" key="4">
                <Row justify='start' className="tabPane">
                  <Col>
                  <Row justify="start" align="middle">
                  <Col>Risk Profile:-</Col>
                  <Col className='nested-col'>
                    <SelectInput
                      info="How much Risk are You willing to take in order to achieve higher Investment Return?"
                      pre="Can Tolerate"
                      unit="Loss"
                      value={riskProfile}
                      changeHandler={(val: string)=>dispatch({ type: "single", data: { field: "riskProfile", val}})}
                      options={getRiskProfileOptions()}
                  />
                  </Col>
                  </Row>
                  <p>&nbsp;</p>
                  <Row justify="start" align="middle">
                  <Col>Tax Liability:-</Col>
                  <Col className='nested-col'>
                  <SelectInput
                    info="How much do you earn in a year?"
                    pre="Yearly Income"
                    value={tax}
                    changeHandler={(val: string)=>dispatch({ type: "single", data: { field: "tax", val}})}
                    options={getTaxLiabilityOptions()}
                  />
                  </Col>
                  </Row>
                  <p>&nbsp;</p>
                  <Row>
                  <Col>Notification:-</Col>
                  <Col className="nested-col">
                    <HSwitch value={notify} setter={(val: boolean)=>dispatch({ type: "single", data: { field: "notify", val}})} rightText="Offer and News Letters"/>
                  </Col>
                  </Row>
                  <p>&nbsp;</p>
                  <Row align="middle">
                  <Col>Discount Rate:-</Col>
                  <Col className="nested-col">
                    <HSwitch value={isDrManual} setter={(val: boolean)=>dispatch({ type: "single", data: { field: "isDrManual", val}})} rightText="Manual" leftText="Auto"/>
                  </Col>
                  <Col className="nested-col">
                    {isDrManual ? <NumberInput pre={''} value={discountRate} changeHandler={(val: number)=>setDiscountRate(val)} /> :
                    <label><strong>{discountRate}%</strong></label>}
                  </Col>
                  </Row>
                  <p>&nbsp;</p>
                    <Row justify="center">
                      <Col>
                        <Button
                          type="primary"
                          style={{ color: COLORS.WHITE }}
                          icon={<SaveOutlined />}
                          onClick={()=>{
                            validateCaptcha("othersTab_change").then((success: boolean) => {
                              if (!success) return;
                              updateOthersTab();
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
            </Tabs>
          </Col>
        </Row>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};
