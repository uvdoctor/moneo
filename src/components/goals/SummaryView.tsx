import React, { useContext, useEffect, useState } from "react";
import {
  getImpLevels,
  getDefaultIconForGoalType,
  goalImgStorage,
} from "./goalutils";
import { CreateGoalInput, LMH } from "../../api/goals";
import { COLORS } from "../../CONSTANTS";
import { Card, Row, Col, Badge, Button, Modal, Tooltip, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { PlanContext } from "./PlanContext";
import {
  ExclamationCircleOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
require("./SummaryView.less");
import DefaultOppCostResult from "../calc/DefaultOppCostResult";
import FIImpact from "./FIImpact";
import BasicLineChart from "./BasicLineChart";
import { CalcContext } from "../calc/CalcContext";
import { GoalContext } from "./GoalContext";
import { getDaysDiff, toHumanFriendlyCurrency } from "../utils";

export default function SummaryView() {
  const { removeGoal, editGoal, allGoals }: any = useContext(PlanContext);
  const { goal }: any = useContext(CalcContext);
  const { impLevel, name, totalCost, goalImgUrl }: any =
    useContext(GoalContext);
  const [goalImp, setGoalImp] = useState<LMH>(impLevel);
  const [goalName, setGoalName] = useState<string>(name);
  const [goalImg, setGoalImg] = useState<string | null>(goalImgUrl);
  const [goalSY, setGoalSY] = useState<number>(goal.sy);
  const getImpColor = (imp: LMH) =>
    imp === LMH.H ? COLORS.BLUE : imp === LMH.M ? COLORS.ORANGE : COLORS.GREEN;
  const [impColor, setImpColor] = useState<string>(
    getImpColor(impLevel as LMH)
  );
  const impLevels: any = getImpLevels();
  const { confirm } = Modal;
  const [lastUpdated, setLastUpdated] = useState<string>(
    getDaysDiff(goal.updatedAt)
  );

  useEffect(() => {
    let g: CreateGoalInput = allGoals.filter(
      (g: CreateGoalInput) => g.id === goal.id
    )[0];
    setGoalImp(g.imp);
    setImpColor(getImpColor(g.imp as LMH));
    setGoalName(g.name);
    setGoalSY(g.sy);
    g.img
      ? goalImgStorage.getUrlFromKey(g.img).then((url: any) => {
          setGoalImg(url);
        })
      : setGoalImg(null);

    //@ts-ignore
    setLastUpdated(getDaysDiff(g.updatedAt));
  }, [allGoals]);

  return (
    <Card
      className="goals-card"
      size="small"
      title={
        <Row justify="space-between">
          <Col>
            <Row align="middle">
              <Col>
                <Avatar
                  size={60}
                  src={goalImg}
                  icon={
                    <FontAwesomeIcon
                      icon={getDefaultIconForGoalType(goal.type)}
                    />
                  }
                  style={{
                    backgroundColor: COLORS.WHITE,
                    color: COLORS.DEFAULT,
                  }}
                />
              </Col>
              <Col>
                <hgroup>
                  <h3>
                    {goalName}
                    &nbsp;
                    <Tooltip title="Edit">
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => editGoal(goal.id)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => {
                          confirm({
                            icon: <ExclamationCircleOutlined />,
                            content: "Are You Sure about Deleting this Goal?",
                            onOk() {
                              removeGoal(goal.id);
                            },
                          });
                        }}
                      />
                    </Tooltip>
                  </h3>
                  <h4>
                    Costs ~ &nbsp;
                    {toHumanFriendlyCurrency(Math.abs(totalCost), goal.ccy)}
                  </h4>
                </hgroup>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>
                <Badge
                  count={impLevels[goalImp]}
                  style={{ backgroundColor: impColor, color: COLORS.WHITE }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Tooltip title={`You updated this Goal ${lastUpdated}`}>
                  <FieldTimeOutlined />
                  {lastUpdated}
                </Tooltip>
              </Col>
            </Row>
          </Col>
        </Row>
      }>
      <Card.Grid style={{ width: "50%" }}>
        <FIImpact />
      </Card.Grid>
      <Card.Grid style={{ width: "50%" }}>
        <DefaultOppCostResult />
      </Card.Grid>
      <Card.Grid style={{ width: "100%" }}>
        <BasicLineChart showFromYear={goalSY} />
      </Card.Grid>
    </Card>
  );
}
