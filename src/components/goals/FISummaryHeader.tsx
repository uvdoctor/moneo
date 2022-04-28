import { Alert, Button, Col, PageHeader, Row, Tooltip } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { PlanContext } from "./PlanContext";
import CoachingRequest from "../CoachingRequest";
import { COLORS } from "../../CONSTANTS";

export default function FISummaryHeader() {
  const { ffGoal, planError, ffYear, editGoal }: any = useContext(PlanContext);

  const getSummary = () => {
    let result = "Financial Independence ";
    result += ffYear ? `at ${ffYear - ffGoal.sy}` : "Not Achievable";
    return result;
  };

  const [summary, setSummary] = useState(getSummary());

  useEffect(() => setSummary(getSummary()), [ffYear]);

  return (
    <Fragment>
      {planError && <Alert type="error" message={planError} />}
      {summary ? (
        <Row>
          <Col span={24} className="primary-header">
            <PageHeader
              title={
                <Row align="middle">
                  {summary}
                  <Tooltip title="Edit">
                    <Button
                      key="Edit"
                      type="link"
                      style={{ color: COLORS.WHITE }}
                      onClick={() => editGoal(ffGoal.id)}>
                      <EditOutlined />
                    </Button>
                  </Tooltip>
                </Row>
              }
              extra={[<CoachingRequest key="cr" />]}
            />
          </Col>
        </Row>
      ) : null}
    </Fragment>
  );
}
