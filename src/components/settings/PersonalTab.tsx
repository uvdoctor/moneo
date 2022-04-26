import { Col, Row } from "antd";
import React from "react";
import TextInput from "../form/textinput";
import DateInput from "../form/DateInput";
import ImageInput from "./ImageInput";

interface PersonalTabProps {
  name: string;
  lastName: string;
  dispatch: Function;
  dobDate: number;
  dobMonth: number;
  dobYear: number;
  user: any;
}

export default function PersonalTab({
  name,
  lastName,
  dobDate,
  dobMonth,
  dobYear,
  dispatch,
  user,
}: PersonalTabProps) {
  return (
    <Row gutter={[32, 20]}>
      <Col className="personal-tabpane-image-view">
        <ImageInput user={user} />
      </Col>
      <Col xs={24} sm={24} md={12}>
        <Row
          gutter={[
            { xs: 0, sm: 0, md: 35 },
            { xs: 15, sm: 15, md: 15 },
          ]}>
          <Col xs={24} md={12}>
            <TextInput
              pre="First Name"
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
              style={{ width: 250 }}
            />
          </Col>
          <Col xs={24} md={12}>
            <TextInput
              pre="Last Name"
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
          ) : null}
        </Row>
      </Col>
    </Row>
  );
}
