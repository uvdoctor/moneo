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
import { toCurrency, toReadableNumber } from "../utils";
import { AssetSubType, AssetType, InstrumentInput } from "../../api/goals";
import { useEffect } from "react";
import {
  COLORS,
  LOCAL_INS_DATA_KEY,
  LOCAL_INS_PERF_KEY,
} from "../../CONSTANTS";
import { NWContext } from "./NWContext";
import { faCoins, faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import simpleStorage from "simplestorage.js";
import YearlyLowHigh from "./YearlyLowHigh";
import IdWithRisk from "./IdWithRisk";
import { isFund } from "./nwutils";
import InsPrice from "./InsPrice";
import ValuationWithReturnPer from "./ValuationWithReturnPer";
import PerfHistFeedback from "./PerfHistFeedback";

interface HoldingProp {
  holding: InstrumentInput;
  onDelete: Function;
  onChange?: Function;
  isUploading?: boolean;
}

export default function Holding({
  holding,
  onDelete,
  onChange,
  isUploading,
}: HoldingProp) {
  const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
  const insPerfData = simpleStorage.get(LOCAL_INS_PERF_KEY);
  const instrumentPerf = insPerfData
    ? insPerfData[holding.id]
      ? insPerfData[holding.id]
      : insPerfData[holding.sid as string]
      ? insPerfData[holding.sid as string]
      : null
    : null;
  const instrument =
    insData && insData[holding.id] ? insData[holding.id] : null;
  const price = instrument ? instrument.price : 0;
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
      gutter={[5, 5]}
    >
      {price ? (
        <Col span={24}>
          <Row justify="space-between">
            <Col>
              {instrument && instrument.type !== AssetType.H ? (
                <Space>
                  {instrument.rate && instrument.rate !== -1 ? (
                    <Tooltip title="Interest rate">
                      &nbsp;&nbsp;
                      <FontAwesomeIcon icon={faCoins} />
                      {` ${instrument.rate}%`}
                    </Tooltip>
                  ) : null}
                  {instrument.my ? (
                    <Tooltip title="Maturity Year">
                      &nbsp;&nbsp;
                      <HourglassOutlined />
                      {instrument.my}
                    </Tooltip>
                  ) : null}
                  {instrument.ytm ? (
                    <Tooltip title="Annual rate of return of this bond if it is bought today and held till maturity">
                      &nbsp;&nbsp;
                      <FontAwesomeIcon icon={faHandHoldingUsd} />
                      {` ${instrument.ytm * 100}%`}
                    </Tooltip>
                  ) : null}
                  {instrument.cr ? (
                    <Tooltip title="Credit rating">
                      &nbsp;&nbsp;
                      <Rate value={4} />
                      {instrument.crstr}
                    </Tooltip>
                  ) : null}
                  {!isUploading &&
                  instrument.mcapt &&
                  instrument.subt === AssetSubType.S &&
                  instrumentPerf ? (
                    <PerfHistFeedback
                      performance={instrumentPerf}
                      instrument={instrument}
                    />
                  ) : null}
                  {instrument.div ? (
                    <Tooltip title="Recent dividend amount">
                      &nbsp;&nbsp;
                      <FontAwesomeIcon icon={faCoins} />
                      {` ${toCurrency(instrument.div, holding.curr, true)}`}
                    </Tooltip>
                  ) : null}
                  {instrument.split ? (
                    <Tooltip title="Recent stock split">
                      &nbsp;&nbsp;
                      <FontAwesomeIcon icon={faCoins} />
                      {` ${instrument.split}`}
                    </Tooltip>
                  ) : null}
                </Space>
              ) : null}
            </Col>
            {holding.fId ? (
              <Col>
                <UserOutlined />
                &nbsp;{allFamily[holding.fId].name}
              </Col>
            ) : null}
          </Row>
        </Col>
      ) : null}
      <Col span={24}>
        <Row justify="space-between">
          <Col>
            {instrument ? (
              instrument.name
            ) : (
              <h4 style={{ color: COLORS.RED }}>Not listed</h4>
            )}
          </Col>
          {price ? (
            <Col className="quantity">
              {total ? (
                <ValuationWithReturnPer valuation={total} holding={holding} />
              ) : (
                ""
              )}
            </Col>
          ) : holding.fId ? (
            <Col>
              <UserOutlined />
              &nbsp;{allFamily[holding.fId].name}
            </Col>
          ) : null}
        </Row>
      </Col>
      <Col span={24}>
        <Row justify="space-between">
          <Col span={8}>
            <IdWithRisk
              id={
                instrument &&
                instrument.sid &&
                instrument.subt === AssetSubType.S &&
                !isFund(holding.id)
                  ? instrument.sid
                  : holding.id
              }
              risk={instrument && instrument.risk ? instrument.risk : null}
            />
          </Col>

          <Col className="quantity" span={8}>
            {instrument && price ? (
              instrument.yhigh && instrument.ylow ? (
                <YearlyLowHigh
                  instrument={instrument}
                  price={price}
                  currency={holding.curr}
                  previousPrice={instrument.prev ? instrument.prev : null}
                />
              ) : (
                <Row justify="center">
                  <InsPrice
                    price={price}
                    currency={holding.curr}
                    previousPrice={instrument.prev ? instrument.prev : null}
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
