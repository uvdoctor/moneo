import React, { useContext, useState } from "react";
import { Row, Col, Button, InputNumber, Tooltip, Rate, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ShoppingCartOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  HourglassOutlined,
} from "@ant-design/icons";

require("./Holding.less");
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import { AssetType, InstrumentInput } from "../../api/goals";
import { useEffect } from "react";
import { COLORS, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import { NWContext } from "./NWContext";
import { faCoins, faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import simpleStorage from "simplestorage.js";
import YearlyLowHigh from "./YearlyLowHigh";
import IdWithRisk from "./IdWithRisk";
import { getMarketCapLabel } from "./nwutils";
import InsPrice from "./InsPrice";

interface HoldingProp {
  holding: InstrumentInput;
  onDelete: Function;
  onChange?: Function;
}

export default function Holding({ holding, onDelete, onChange }: HoldingProp) {
  const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
  const price = insData && insData[holding.id] ? insData[holding.id].price : 0;
  const { allFamily, setInstruments, instruments }: any = useContext(NWContext);
  const [total, setTotal] = useState<number>(holding.qty * price);
  const [isEditMode, setEditMode] = useState(false);

  function onEdit() {
    setEditMode(true);
  }

  function onCancel() {
    setInstruments([...instruments]);
    setEditMode(false);
  }

  useEffect(() => {
    setTotal(holding.qty * price);
  }, [price, holding.qty]);

  return (
    <Row
      className="holding"
      align="middle"
      justify="space-between"
      gutter={[5, 5]}>
      {price ? (
        <Col span={24}>
          <Row justify="space-between">
            <Col>
              {insData &&
              insData[holding.id] &&
              insData[holding.id].type !== AssetType.H ? (
                <Space>
                  {insData[holding.id].rate &&
                  insData[holding.id].rate !== -1 ? (
                    <Tooltip title="Interest rate">
                      &nbsp;&nbsp;
                      <FontAwesomeIcon icon={faCoins} />
                      {` ${insData[holding.id].rate}%`}
                    </Tooltip>
                  ) : null}
                  {insData[holding.id].my ? (
                    <Tooltip title="Maturity Year">
                      &nbsp;&nbsp;
                      <HourglassOutlined />
                      {insData[holding.id].my}
                    </Tooltip>
                  ) : null}
                  {insData[holding.id].ytm ? (
                    <Tooltip title="Annual rate of return of this bond if it is bought today and held till maturity">
                      &nbsp;&nbsp;
                      <FontAwesomeIcon icon={faHandHoldingUsd} />
                      {` ${insData[holding.id].ytm * 100}%`}
                    </Tooltip>
                  ) : null}
                  {insData[holding.id].cr ? (
                    <Tooltip title="Credit rating">
                      &nbsp;&nbsp;
                      <Rate value={4} />
                      {insData[holding.id].crstr}
                    </Tooltip>
                  ) : null}
                  {insData[holding.id].mcapt ? (
                    <Tooltip title="Market capitalization">
                      {getMarketCapLabel(insData[holding.id].mcapt)}
                    </Tooltip>
                  ) : null}
                </Space>
              ) : null}
            </Col>
            <Col>
              <UserOutlined />
              &nbsp;{allFamily[holding.fId].name}
            </Col>
          </Row>
        </Col>
      ) : null}
      <Col span={24}>
        <Row justify="space-between">
          <Col>
            {price ? (
              insData[holding.id].name
            ) : (
              <h4 style={{ color: COLORS.RED }}>Not listed</h4>
            )}
          </Col>
          {price ? (
            <Col className="quantity">
              {total ? (
                <strong>
                  {toHumanFriendlyCurrency(total, holding.curr as string)}
                </strong>
              ) : (
                ""
              )}
            </Col>
          ) : (
            <Col>
              <UserOutlined />
              &nbsp;{allFamily[holding.fId].name}
            </Col>
          )}
        </Row>
      </Col>
      <Col span={24}>
        <Row justify="space-between">
          <Col span={8}>
            <IdWithRisk
              id={
                insData && insData[holding.id] && insData[holding.id].sid
                  ? insData[holding.id].sid
                  : holding.id
              }
              risk={
                insData && insData[holding.id] && insData[holding.id].risk
                  ? insData[holding.id].risk
                  : null
              }
            />
          </Col>

          <Col className="quantity" span={8}>
            {price ? (
              insData[holding.id].yhigh && insData[holding.id].ylow ? (
                <YearlyLowHigh
                  instrument={insData[holding.id]}
                  price={price}
                  currency={holding.curr}
                  previousPrice={
                    insData[holding.id].prev ? insData[holding.id].prev : null
                  }
                />
              ) : (
                <Row justify="center">
                  <InsPrice
                    price={price}
                    currency={holding.curr}
                    previousPrice={
                      insData[holding.id].prev ? insData[holding.id].prev : null
                    }
                  />
                </Row>
              )
            ) : (
              ""
            )}
          </Col>
          <Col span={8}>
            <Row align="middle" justify="end">
              <Col>
                <span className="quantity">
                  <ShoppingCartOutlined />{" "}
                  {price && isEditMode ? (
                    <InputNumber
                      value={holding.qty}
                      size="small"
                      onChange={(val) => {
                        holding.qty = val as number;
                        if (onChange) onChange(holding);
                      }}
                    />
                  ) : (
                    toReadableNumber(
                      holding.qty,
                      ("" + holding.qty).includes(".") ? 3 : 0
                    )
                  )}
                </span>
              </Col>
              <Col>
                {price ? (
                  <Button
                    type="link"
                    icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
                    onClick={isEditMode ? onCancel : onEdit}
                  />
                ) : null}
                <Button
                  type="link"
                  icon={isEditMode ? <CloseOutlined /> : <DeleteOutlined />}
                  onClick={() =>
                    isEditMode ? onCancel() : onDelete(holding.id)
                  }
                  danger
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
