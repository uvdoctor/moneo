import React, { useContext, useState } from "react";
import { Row, Col, Button, Badge, InputNumber, Tooltip, Rate } from "antd";
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
import {
  toCurrency,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import { AssetType, InstrumentInput } from "../../api/goals";
import { useEffect } from "react";
import { getColourForAssetType } from "./nwutils";
import { COLORS, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import { NWContext } from "./NWContext";
import { faCoins, faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import simpleStorage from "simplestorage.js";

interface HoldingProp {
  holding: InstrumentInput;
  onDelete: Function;
  onChange?: Function;
}

export default function Holding({ holding, onDelete, onChange }: HoldingProp) {
  const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
  const price = insData && insData[holding.id] ? insData[holding.id].price : 0;
  const { allFamily }: any = useContext(NWContext);
  const [total, setTotal] = useState<number>(holding.qty * price);
  const [isEditMode, setEditMode] = useState(false);

  function onEdit() {
    setEditMode(true);
  }

  function onCancel() {
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
      <Col span={24}>
        <Row justify="space-between">
          {insData[holding.id] &&
            allFamily[holding.fId] &&
            insData[holding.id].type !== AssetType.H && (
              <Col>
                {insData[holding.id].rate && insData[holding.id].rate !== -1 && (
                  <Tooltip title="Interest rate">
                    &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faCoins} />
                    {` ${insData[holding.id].rate}%`}
                  </Tooltip>
                )}
                {insData[holding.id].my && (
                  <Tooltip title="Maturity Year">
                    &nbsp;&nbsp;
                    <HourglassOutlined />
                    {insData[holding.id].my}
                  </Tooltip>
                )}
                {insData[holding.id].ytm && (
                  <Tooltip title="Annual rate of return of this bond if it is bought today and held till maturity">
                    &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faHandHoldingUsd} />
                    {` ${insData[holding.id].ytm * 100}%`}
                  </Tooltip>
                )}
                {insData[holding.id].cr && (
                  <Tooltip title="Credit rating">
                    &nbsp;&nbsp;
                    <Rate value={4} />
                    {insData[holding.id].crstr}
                  </Tooltip>
                )}
              </Col>
            )}
          {allFamily[holding.fId] && (
            <Col>
              <UserOutlined />
              &nbsp;{allFamily[holding.fId].name}
            </Col>
          )}
        </Row>
      </Col>
      <Col span={24}>
        <Row justify="space-between">
          <Col>
            {insData[holding.id] ? (
              insData[holding.id].name
            ) : (
              <h4 style={{ color: COLORS.RED }}>Not listed</h4>
            )}
          </Col>
          <Col className="quantity">
            {total ? (
              <strong>
                {toHumanFriendlyCurrency(total, holding.curr as string)}
              </strong>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Col>
      <Col>
        <Badge
          count={holding.id}
          style={{
            color: COLORS.WHITE,
            backgroundColor: getColourForAssetType(
              insData[holding.id] ? insData[holding.id].type : ("" as AssetType)
            ),
          }}
        />
      </Col>
      <Col>
        <Row align="middle">
          <Col>
            <span className="quantity">
              {price ? toCurrency(price, holding.curr as string, true) : ""}
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
            {insData[holding.id] && (
              <Button
                type="link"
                icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
                onClick={isEditMode ? onCancel : onEdit}
              />
            )}
            <Button
              type="link"
              icon={isEditMode ? <CloseOutlined /> : <DeleteOutlined />}
              onClick={() => (isEditMode ? onCancel() : onDelete(holding.id))}
              danger
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
