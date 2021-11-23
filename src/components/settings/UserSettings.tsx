import { Alert, Col, Row, notification, Skeleton, Tabs, PageHeader, Button, Checkbox } from "antd";
import React, { useContext, useState, useEffect } from "react";
import { useFullScreenBrowser } from "react-browser-hooks";
import { Auth } from "aws-amplify";
import { isMobileDevice } from "../utils";
import { AppContext } from "../AppContext";
import { countrylist } from "./CountryCode";
import TextInput from "../form/textinput";
import PasswordInput from "./PasswordInput";
require("./Settings.less");
import ImageInput from "./ImageInput";
import { COLORS } from "../../CONSTANTS";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import OtpDialogue from "./OtpDialogue";
import { deleteContact, doesEmailExist, doesImExist, doesMobExist, updateImInContact } from "../contactutils";
import DatePickerInput from "../form/DatePickerInput";
// import { CognitoIdentityServiceProvider } from "aws-sdk";
// import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
// import AWS from "aws-sdk";
// import awsconfig from '../../aws-exports';

// AWS.config.region = awsconfig.aws_project_region;
// const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

export default function UserSettings(): JSX.Element {
  const { user, appContextLoaded, defaultCountry, validateCaptcha }: any = useContext(AppContext);
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<any>('');
  const [error, setError] = useState<any>("");
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [prefuser, setPrefuser] = useState<string>('');
  const [dob, setDob] = useState<string>();
  const [whatsapp, setWhatsapp] = useState<string>('');
  const { TabPane } = Tabs;
  const fsb = useFullScreenBrowser();

  const success = (message: any) => notification.success({ message });
  const failure = (message: any) => notification.error({ message });

  const counCode = countrylist.find((item) => item.countryCode === defaultCountry);
  const notify = !user || !user?.attributes.website || user?.attributes.website ==='N' ? false : true;
  const disableButton = (prevValue: any, currValue: any) => prevValue === currValue ? true : error.length > 0 ? true : false;

  const counCodeWithOutPlusSign = counCode?.value.slice(1);

  const sendOtp = async () => {
    const data = await Auth.resendSignUp(user?.attributes.phone_number);
    console.log(data);
  }

  const updatePhoneNumber = async () => {
    try {
      const mob = parseFloat(counCodeWithOutPlusSign+mobile);
      const exist = await doesMobExist(mob);
      if(exist) { 
        failure('Please use another mobile as this one is already used by another account.');
        return false;
      }
      await Auth.updateUserAttributes(user, { phone_number: counCode?.value+mobile });
      success("Mobile number updated successfully. Enter Otp to verify");
      return true;
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateWhatsapp = async () => {
    try {
      const im = parseFloat(counCodeWithOutPlusSign+whatsapp);
      const exist = await doesImExist(im);
      if(exist) { 
        failure('Please use another whatsapp number as this one is already used by another account.');
        return false;
      };
      await Auth.updateUserAttributes(user, { nickname: counCode?.value+whatsapp });
      success("Whatsapp number updated successfully. Enter Otp to verify");
      await updateImInContact(user?.attributes.email, im);
      return true;
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateEmail = async () => {
    try {
      const exist = await doesEmailExist(email);
      if(exist) { 
        failure('Please use another email address as this one is already used by another account.');
        return false;
      }
      await deleteContact(user?.attributes.email);
      await Auth.updateUserAttributes(user, { email: email });
      success("Email updated successfully. Enter Otp to verify");
      return true;
    } catch (error) {
      failure(`Unable to update, ${error}`);
    }
  };

  const updateImIfSameAsMob = async () => {
    if(user?.attributes.phone_number) {
      setWhatsapp(mobile);
      await updateWhatsapp();
    }else{
      failure('Update your mobile, your mobile number is empty.');
    }
  }

  const updatePrefUsername = async () => {
    try {
      await Auth.updateUserAttributes(user, { preferred_username:prefuser });
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
  

  useEffect(() => {
    if (!user) return;
    setEmail(user?.attributes.email || '');
    setName(user?.attributes.name || '');
    setLastName(user?.attributes.family_name || '');
    setDob(user?.attributes.birthdate || '');
    setPrefuser(user?.attributes.preferred_username || '');
    user?.attributes.nickname && setWhatsapp(user?.attributes.nickname.replace(counCode?.value, ""));
    user?.attributes.phone_number && setMobile(user?.attributes.phone_number.replace(counCode?.value, ""));
  }, [appContextLoaded, counCode?.value, user]);

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
                        <DatePickerInput title={"Date of birth"} className="dob" defaultVal={user?.attributes.birthdate} changeHandler={setDob}/>
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
                      changeHandler={setPrefuser}
                      fieldName="prefusername"
                      setError={setError}
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
                      prefix={counCode?.value}
                      value={mobile}
                      changeHandler={setMobile}
                      fieldName="mobile"
                      pattern="^[0-9]"
                      setError={setError}
                      minLength={10}
                      maxLength={10}
                      post={
                        <OtpDialogue
                          disableButton={disableButton(user?.attributes.phone_number, counCode?.value+mobile)}
                          action={"phone_number"} user={user}
                          email={email}
                          mob={parseFloat(counCodeWithOutPlusSign+mobile)}
                          onClickAction={updatePhoneNumber}
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
                      prefix={counCode?.value}
                      value={whatsapp}
                      changeHandler={setWhatsapp}
                      fieldName="whatsapp"
                      pattern="^[0-9]"
                      setError={setError}
                      minLength={10}
                      maxLength={10}
                      post={
                        <OtpDialogue
                          disableButton={disableButton(user?.attributes.nickname, counCode?.value+mobile)}
                          action={"whatsapp_number"}
                          email={email}
                          im={parseFloat(counCodeWithOutPlusSign+mobile)}
                          onClickAction={updateWhatsapp}              
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
                      changeHandler={setEmail}
                      pattern={"^(?!.*(?:.-|-.))[^@]+@[^W_](?:[w-]*[^W_])?(?:.[^W_](?:[w-]*[^W_])?)+$"}
                      setError={setError}
                      fieldName="email"
                      post={
                        <OtpDialogue
                          disableButton={disableButton(email, user?.attributes.email)}
                          action={"email"}
                          onClickAction={updateEmail}
                          email={email}
                          mob={parseFloat(counCodeWithOutPlusSign + mobile)}
                          im={parseFloat(counCodeWithOutPlusSign + whatsapp)}
                          notify={notify}    
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
            </Tabs>
          </Col>
        </Row>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};
