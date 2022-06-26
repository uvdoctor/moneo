import { Col, Row } from "antd";
import React, { useContext } from "react";
import TextInput from "../form/textinput";
import DateInput from "../form/DateInput";
import ImageInput from "./ImageInput";
import { UserSettingsContext } from "./UserSettingsContext";
import SaveButton from "./SaveButton";

export default function PersonalTab() {
  const {
    name,
    lastName,
    setName,
    setError,
    setLastName,
    dobDate,
    setDobDate,
    dobMonth,
    setDobMonth,
    dobYear,
    setDobYear,
    loading,
    error,
    updatePersonalTab
  }: any = useContext(UserSettingsContext);

  return (
    <Row gutter={[10, 10]}>
      <Col span={24}>
        <Row gutter={[32, 20]} justify="space-around">
          <Col className="personal-tabpane-image-view">
            <ImageInput />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Row
              gutter={[
                { xs: 0, sm: 0, md: 32 },
                { xs: 15, sm: 15, md: 16 },
              ]}
            >
              <Col xs={24}>
                <TextInput
                  pre="First Name"
                  placeholder="Name"
                  value={name}
                  changeHandler={setName}
                  minLength={2}
                  maxLength={20}
                  setError={setError}
                  fieldName="firstname"
                  pattern="^[a-zA-Z'-.,]+$"
                  style={{ width: 250 }}
                />
              </Col>
              <Col xs={24}>
                <TextInput
                  pre="Last Name"
                  placeholder="Last Name"
                  value={lastName}
                  changeHandler={setLastName}
                  minLength={2}
                  maxLength={20}
                  setError={setError}
                  fieldName="lastname"
                  pattern="^[a-zA-Z'-.,]+$"
                  style={{ width: 250 }}
                />
              </Col>
              {dobDate ? (
                <Col xs={24} md={12}>
                  <DateInput
                    title="Date of birth"
                    className="dob"
                    startDateValue={dobDate}
                    startMonthValue={dobMonth}
                    startYearValue={dobYear}
                    startYearHandler={setDobYear}
                    startMonthHandler={setDobMonth}
                    startDateHandler={setDobDate}
                    size="large"
                  />
                </Col>
              ) : null}
            </Row>
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={16}>
        <SaveButton
          loading={loading}
          error={error}
          onClick={updatePersonalTab}
        />
      </Col>
    </Row>
  );
}
