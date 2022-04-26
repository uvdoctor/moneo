import React, { useState, useEffect } from "react";
import { Row, Col, Button, Divider, Badge } from "antd";
import simpleStorage from "simplestorage.js";
import { COLORS, LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import { AssetType, InstrumentInput } from "../../api/goals";
import HoldingInput from "./AddHoldingFinancialInputForm";
import { toCurrency, toHumanFriendlyCurrency } from "../utils";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { getColourForAssetType } from "./nwutils";
import NumberInput from "../form/numberinput";

export default function AddHoldingFinancialInput(props: any) {
  const [holdings, setHoldings] = useState<InstrumentInput[]>([]);
  const { updateInstruments, disableOk } = props;

  useEffect(() => {
    disableOk(true);
  }, [disableOk]);

  const deleteFromHoldings = (id: string) => {
    const newHoldings = holdings.filter((item: InstrumentInput) => item.id !== id);
    setHoldings([...newHoldings]);
    updateInstruments([...newHoldings]);
    disableOk(newHoldings.length > 0 ? false : true);
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

  const HoldingsRow = (props: { holding: any }) => {
    let price = 0;
    let type = "";
    const { holding } = props;
    const { id, qty, curr } = holding;
    const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    if (insData[id]) {
      const value = insData[id];
      price = value.price;
      type = value.type;
    }
    return (
      <Row className="holding" gutter={[16, 50]} key={id}>
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
                <NumberInput
                  value={holding.qty}
                  changeHandler={(val: number) => {
                    holding.qty = val;
                    setHoldings([...holdings]);
                  }}
                  pre={""}
                  min={1}
                />
              </span>
              <Button type="link" danger onClick={() => deleteFromHoldings(id)}>
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
            {holdings.map((holding, index) => (
              <HoldingsRow holding={holding} key={index} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
