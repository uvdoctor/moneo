import { Col, Row, Button, Checkbox } from "antd";
import React, { useContext } from "react";
import { emailRegex } from "../utils";
import TextInput from "../form/textinput";
import { COLORS } from "../../CONSTANTS";
import SaveOutlined from "@ant-design/icons/lib/icons/SaveOutlined";
import OtpDialogue from "./OtpDialogue";
import { doesEmailExist, doesImExist, doesMobExist } from "../userinfoutils";
import { AppContext } from "../AppContext";
import { UserSettingsContext } from "./UserSettingsContext";

export default function AccountTab() {
  const {
    error,
    setError,
    prefuser,
    setPrefuser,
    email,
    setEmail,
    mobile,
    setMobile,
    whatsapp,
    setWhatsapp,
    updatePrefUsername,
    updateAccountTab,
    countryCodeWithoutPlusSign,
    countryCode,
    updateImIfSameAsMob,
  }: any = useContext(UserSettingsContext);
  const { user }: any = useContext(AppContext);

  const disableButton = (prevValue: any, currValue: any) => 
    prevValue === currValue ? true : error?.length > 0 ? true : false;

  return (
    <Row gutter={[0, 24]}>
      <Col xs={24} sm={24} md={12}>
        <TextInput
          pre="Preferred login name"
          value={prefuser}
          placeholder="Login Name"
          changeHandler={setPrefuser}
          style={{ width: 300 }}
          fieldName="prefusername"
          setError={setError}
          post={
            <Button
              type="link"
              style={{ color: COLORS.GREEN }}
              id='login_save'
              icon={<SaveOutlined />}
              disabled={error?.length > 0 ? true : false}
              onClick={async () => {
                await updatePrefUsername();
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
          changeHandler={setEmail}
          pattern={emailRegex}
          setError={setError}
          style={{ width: 300 }}
          fieldName="email"
          post={
            <OtpDialogue
              disableButton={disableButton(email, user?.attributes?.email)}
              action={"email"}
              onClickAction={() =>
                updateAccountTab(email, doesEmailExist, "Email", {
                  email: email,
                })
              }
              email={email}
              mob={parseFloat(countryCodeWithoutPlusSign + mobile)}
              im={parseFloat(countryCodeWithoutPlusSign + whatsapp)}
            />
          }
        />
      </Col>
      <Col xs={24} sm={24} md={12}>
        <TextInput
          pre="Mobile"
          prefix={countryCode?.value}
          value={mobile}
          changeHandler={setMobile}
          style={{ width: 300 }}
          fieldName="mobile"
          pattern="^[0-9]"
          setError={setError}
          minLength={10}
          maxLength={10}
          placeholder='Mobile'
          post={
            <OtpDialogue
              disableButton={disableButton(
                user?.attributes?.phone_number,
                countryCode?.value + mobile
              )}
              action={"phone_number"}
              mob={parseFloat(countryCodeWithoutPlusSign + mobile)}
              onClickAction={() =>
                updateAccountTab(mobile, doesMobExist, "Mobile Number", {
                  phone_number: countryCode?.value + mobile,
                })
              }
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
              changeHandler={setWhatsapp}
              fieldName="whatsapp"
              pattern="^[0-9]"
              setError={setError}
              minLength={10}
              placeholder='Whatsapp'
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
                    updateAccountTab(whatsapp, doesImExist, "Whatsapp Number", {
                      nickname: countryCode?.value + whatsapp,
                    })
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
    </Row>
  );
}
