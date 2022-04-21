import React, { useState, useEffect } from "react";
import { Row, Col, Button, Divider, Badge, InputNumber } from "antd";
import simpleStorage from "simplestorage.js";
import { COLORS, LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import { AssetType, InstrumentInput } from "../../api/goals";
import HoldingInput from "./AddHoldingFinancialInputForm";
import {
  toCurrency,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import {
  DeleteOutlined,
  EditOutlined,
  ShoppingCartOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { getColourForAssetType } from "./nwutils";

export default function AddHoldingFinancialInput(props: any) {
  const [holdings, setHoldings] = useState<InstrumentInput[]>([]);
  const { updateInstruments, disableOk } = props;

  useEffect(() => {
    disableOk(true);
  }, [disableOk]);

  const deleteFromHoldings = (key: number) => {
    holdings.splice(key, 1);
    setHoldings([...holdings]);
    updateInstruments([...holdings]);
    disableOk(holdings.length > 0 ? false : true);
  };

  const addToHoldings = (newHolding: any, newRawDetails: any) => {
    const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    const mergedInsData = Object.assign({}, insData, newRawDetails);
    const mergedHoldings = [...[newHolding], ...holdings];
    setHoldings(mergedHoldings);
    updateInstruments(mergedHoldings);
    simpleStorage.set(LOCAL_INS_DATA_KEY, mergedInsData, LOCAL_DATA_TTL);
    disableOk(mergedHoldings.length > 0 ? false : true);
  };

  const HoldingsRow = (props: { holding: any; key: number }) => {
    const [isEditMode, setEditMode] = useState<boolean>(false);
    let price = 0;
    let type = "";
    const { holding, key } = props;
    const { id, qty, curr } = holding;
    const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    if (insData[id]) {
      const value = insData[id];
      price = value.price;
      type = value.type;
    }
    return (
      <Row className="holding" gutter={[16, 50]} key={key}>
        <Col span={24}>
          <Row justify="space-between">
            <Col>
              {!insData[id] && (
                <h4 style={{ color: COLORS.RED }}>
                  Sorry, unable to find price for this one!
                </h4>
              )}
            </Col>
          </Row>

          <Row justify="space-between">
            <Col>{insData[id]?.name}</Col>

            <Col className="quantity">
              <strong>
                {toHumanFriendlyCurrency(qty * price, curr as string)}
              </strong>
            </Col>
          </Row>

          <Row justify="space-between">
            <Col>
              <Row align="middle" gutter={8}>
                <Col>
                  <Badge
                    count={id}
                    style={{
                      color: COLORS.WHITE,
                      backgroundColor: getColourForAssetType(type as AssetType),
                    }}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <span className="quantity">
                {`${toCurrency(price, curr as string, true)} `}
                <ShoppingCartOutlined />{" "}
                {isEditMode ? (
                  <InputNumber
                    value={holding.qty}
                    size="small"
                    onChange={(val) => {
                      holding.qty = val as number;
                    }}
                  />
                ) : (
                  toReadableNumber(
                    holding.qty,
                    ("" + holding.qty).includes(".") ? 3 : 0
                  )
                )}
              </span>
              {price ? (
                <Button
                  type="link"
                  icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
                  onClick={() => isEditMode ? setEditMode(false) : setEditMode(true)}
                />
              ) : null}
              <Button
                type="link"
                danger
                onClick={() => deleteFromHoldings(props.key)}
              >
                <DeleteOutlined />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };
  return (
    <>
      <HoldingInput
        addToHoldings={addToHoldings}
        deleteFromHoldings={deleteFromHoldings}
      />
      {holdings.length > 0 && (
        <>
          <Divider></Divider>
          <div className="holdings-entry-container">
            {holdings.map((holding, key) => (
              <HoldingsRow holding={holding} key={key} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
