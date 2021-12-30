import { Alert, Col, Row, notification, Skeleton, Tabs, PageHeader, Button, Checkbox } from "antd";
import React, { useContext, useEffect, useReducer } from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { Auth } from "aws-amplify";
import { countrylist, getDiscountRate, getRiskProfileOptions, isMobileDevice } from "../utils";
import { AppContext } from "../AppContext";
import TextInput from "../form/textinput";
import PasswordInput from "./PasswordInput";
import ImageInput from "./ImageInput";
import { COLORS } from "../../CONSTANTS";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import OtpDialogue from "./OtpDialogue";
import { doesEmailExist, doesImExist, doesMobExist, getUserDetails, updateIm, updateUserDetails } from "../userinfoutils";
import DatePickerInput from "../form/DatePickerInput";
import SelectInput from "../form/selectinput";
import HSwitch from "../HSwitch";
import NumberInput from "../form/numberinput";
require("./Settings.less");

const initialState = {
  email: "",
  mobile: "",
  error: "",
  name: "",
  lastName: "",
  prefuser: "",
  dob: "",
  whatsapp: "",
  riskProfile: "",
  dr: 0,
  isDrManual: 0,
  notify: 0
}

const userReducer = ( userState: any, { type, data }: { type: string; data: any }) => {
  switch (type) {
    case "updateSingly":
      return {
        ...userState,
        [data.field]: data.value,
      };
    default:
      return {
        ...userState,
        ...data,
      };
  }  
};

export default function UserSettings(): JSX.Element {
  const { user, appContextLoaded, defaultCountry, validateCaptcha, owner }: any = useContext(AppContext);
  const [userState, dispatch] = useReducer(userReducer, initialState);
  const { email, mobile, error, name, lastName, prefuser, dob, whatsapp, riskProfile, dr, notify, isDrManual } = userState;
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
        await updateIm(owner, data as number);
      }
      return true;
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  }

  const updateImIfSameAsMob = async () => {
    if(user?.attributes?.phone_number) {
      dispatch({ type: "updateSingly", data: { field: "whatsapp", mobile }});
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
   await updateUserDetails({uname: owner, dr: isDrManual ? dr : 0, rp: riskProfile, notify: notify})
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
    owner && (async () => (await getUserDetails(owner).then(response=>{
      dispatch({ type: "userUpdate", data: { 
        dr: getDiscountRate(response?.rp as string),
        riskProfile: response?.rp,
        notify: response?.notify, 
        isDrManual: response?.dr === 0 ? 0 : 1 
      }
      });
    }).catch(err=>console.log(err))))();
  },[user])

  useEffect(()=>{
    dispatch({type: "updateSingly", data: { field: "dr", value: getDiscountRate(riskProfile)}})
  },[riskProfile])

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
                          changeHandler={(value: any)=>dispatch({ type: "updateSingly", data: { field: "name", value}})}
                          width={300}
                          minLength={2}
                          maxLength={20}
                          setError={(value: any)=>dispatch({ type: "updateSingly", data: { field: "error", value}})}
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
                          changeHandler={(value: any)=>dispatch({ type: "updateSingly", data: { field: "lastName",  value}})}
                          width={300}
                          minLength={2}
                          maxLength={20}
                          setError={(value: any)=>dispatch({ type: "updateSingly", data: { field: "error", value}})}
                          fieldName="lastname"
                          pattern="^[a-zA-Z'-.,]+$"
                        />
                      </Col>
                    </Row>
                    <span>&nbsp;</span>
                    <Row justify="center">
                      <Col>
                        <DatePickerInput title={"Date of birth"} className="dob" value={dob} changeHandler={(value: any)=>dispatch({ type: "updateSingly", data: { field: "dob", value}})}/>
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
                      changeHandler={(value: any)=>dispatch({ type: "updateSingly", data: { field: "prefuser", value}})}
                      fieldName="prefusername"
                      setError={(value: any)=>dispatch({ type: "updateSingly", data: { field: "error", value}})}
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
                      changeHandler={(value: any)=>dispatch({ type: "updateSingly", data: { field: "mobile", value}})}
                      fieldName="mobile"
                      pattern="^[0-9]"
                      setError={(value: any)=>dispatch({ type: "updateSingly", data: { field: "error", value}})}
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
                      changeHandler={(value: any)=>dispatch({ type: "updateSingly", data: { field: "whatsapp", value}})}
                      fieldName="whatsapp"
                      pattern="^[0-9]"
                      setError={(value: any)=>dispatch({ type: "updateSingly", data: { field: "error", value}})}
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
                      changeHandler={(value: any)=>dispatch({ type: "updateSingly", data: { field: "email", value}})}
                      pattern={"^(?!.*(?:.-|-.))[^@]+@[^W_](?:[w-]*[^W_])?(?:.[^W_](?:[w-]*[^W_])?)+$"}
                      setError={(value: any)=>dispatch({ type: "updateSingly", data: { field: "error", value}})}
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
                      changeHandler={(value: string)=>dispatch({ type: "updateSingly", data: { field: "riskProfile", value}})}
                      options={getRiskProfileOptions()}
                  />
                  </Col>
                  </Row>
                  <p>&nbsp;</p>
                  <Row>
                  <Col>Notification:-</Col>
                  <Col className="nested-col">
                    <HSwitch value={notify} setter={(value: boolean)=>dispatch({ type: "updateSingly", data: { field: "notify", value}})} rightText="Offer and News Letters"/>
                  </Col>
                  </Row>
                  <p>&nbsp;</p>
                  <Row align="middle">
                  <Col>Discount Rate:-</Col>
                  <Col className="nested-col">
                    <HSwitch value={isDrManual} setter={(value: boolean)=>dispatch({ type: "updateSingly", data: { field: "isDrManual", value}})} rightText="Manual" leftText="Auto"/>
                  </Col>
                  <Col className="nested-col">
                    {isDrManual ? <NumberInput pre={''} value={dr} changeHandler={(value: number)=>dispatch({ type: "updateSingly", data: { field: "dr", value}})} /> :
                    <label><strong>{dr}%</strong></label>}
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
