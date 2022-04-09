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
import xirr from "xirr";

require("./Holding.less");
import {
  toCurrency,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import {
  AssetSubType,
  AssetType,
  InstrumentInput,
  PurchaseInput,
} from "../../api/goals";
import { useEffect } from "react";
import { COLORS, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import { NWContext } from "./NWContext";
import { faCoins, faHandHoldingUsd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import simpleStorage from "simplestorage.js";
import YearlyLowHigh from "./YearlyLowHigh";
import IdWithRisk from "./IdWithRisk";
import { getMarketCapLabel, isFund } from "./nwutils";
import InsPrice from "./InsPrice";

interface HoldingProp {
  holding: InstrumentInput;
  onDelete: Function;
  onChange?: Function;
}

export default function Holding({ holding, onDelete, onChange }: HoldingProp) {
  const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
  const instrument =
    insData && insData[holding.id] ? insData[holding.id] : null;
  const price = instrument ? instrument.price : 0;
  const { allFamily, setInstruments, instruments }: any = useContext(NWContext);
  const [total, setTotal] = useState<number>(holding.qty * price);
  const [isEditMode, setEditMode] = useState(false);
  const [returnPer, setReturnPer] = useState<number>(0);
  const [buyTotal, setBuyTotal] = useState<number>(0);
  const [annualReturnPer, setAnnualReturnPer] = useState<number>(0);

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

  const calculateAnnualReturn = (cfs: Array<any>) => {
    if (!cfs.length) return 0;
    let result = 0;
    try {
      result = xirr(cfs) * 100;
    } catch (e) {
      console.log("Error while calculating xirr for a holding: ", e);
    } finally {
      return result;
    }
  };

  useEffect(() => {
    if (!total || (!holding.pur && !holding.avgp)) {
      setReturnPer(0);
      setBuyTotal(0);
      setAnnualReturnPer(0);
      return;
    }
    let buyTotal = 0;
    let returnPer = 0;
    let annualReturnPer = 0;
    if (holding.pur && holding.pur.length) {
      let cfs: Array<any> = [];
      holding.pur.forEach((pur: PurchaseInput) => {
        if (!pur.qty || !pur.amt) return;
        buyTotal += pur.qty * pur.amt;
        cfs.push({
          amount: -(pur.qty * pur.amt),
          when: new Date(pur.year, pur.month, pur.day as number),
        });
      });
      if (cfs.length) {
        cfs.push({
          amount: total,
          when: new Date(),
        });
        annualReturnPer = calculateAnnualReturn(cfs);
      }
    } else if (holding.avgp) {
      buyTotal = holding.qty * holding.avgp;
    }
    if (buyTotal) returnPer = (total / buyTotal - 1) * 100;
    setBuyTotal(buyTotal);
    setReturnPer(returnPer);
    setAnnualReturnPer(annualReturnPer);
  }, [total, holding.pur, holding.avgp]);

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
                  {instrument.mcapt ? (
                    <Tooltip title="Market capitalization">
                      {getMarketCapLabel(instrument.mcapt)}
                    </Tooltip>
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
                <InsPrice
                  price={total}
                  currency={holding.curr}
                  previousPrice={returnPer}
                  noPerCalc
                  noDecimal
                  info={
                    returnPer
                      ? `Based on the purchase input, your investment of ${toHumanFriendlyCurrency(
                          buyTotal,
                          holding.curr
                        )} has ${
                          returnPer > 0 ? "gained" : "lost"
                        } by about ${toReadableNumber(
                          Math.abs(returnPer),
                          2
                        )}%.${
                          annualReturnPer
                            ? ` In terms of annual performance, this is about ${toReadableNumber(
                                Math.abs(annualReturnPer),
                                2
                              )}% ${
                                annualReturnPer > 0 ? "gain" : "loss"
                              } per year.`
                            : ""
                        }`
                      : ""
                  }
                />
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
