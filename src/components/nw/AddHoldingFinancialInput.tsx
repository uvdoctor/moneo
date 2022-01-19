import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Button, Divider, Badge } from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import simpleStorage from "simplestorage.js";
import { COLORS } from "../../CONSTANTS";
import { AssetType } from "../../api/goals";
import HoldingInput from "./AddHoldingFinancialInputForm";
import {
  toCurrency,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import { getColourForAssetType } from "./nwutils";
import { AppContext, LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from "../AppContext";

export default function AddHoldingFinancialInput(props: any) {
  const { insData, setInsData }: any = useContext(AppContext);
  const [holdings, setHoldings] = useState<{}[]>([]);
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
    const mergedInsData = Object.assign({}, insData, newRawDetails);
    const mergedHoldings = [...[newHolding], ...holdings];
    setHoldings(mergedHoldings);
    updateInstruments(mergedHoldings);
    setInsData(mergedInsData);
    simpleStorage.set(LOCAL_INS_DATA_KEY, mergedInsData, LOCAL_DATA_TTL);
    disableOk(mergedHoldings.length > 0 ? false : true);
  };

  const HoldingsRow = (props: { holding: any; key: number }) => {
    const {
      holding: { curr, qty, id },
      key,
    } = props;
    const { price, type } = insData[id];
    return (
      <Row className="holding" gutter={[16, 50]} key={key}>
        <Col span={24}>
          <Row justify="space-between">
            <Col>
              {!insData[id] &&
                <h4 style={{ color: COLORS.RED }}>
                  Sorry, unable to find price for this one!
                </h4>
              }
            </Col>
          </Row>

          <Row justify="space-between">
            <Col>{insData[id].name}</Col>

            <Col className="quantity">
              <strong>
                {toHumanFriendlyCurrency(qty * price, curr as string)}
              </strong>
            </Col>
          </Row>

          <Row justify="space-between">
            <Col>
              <Badge
                count={id}
                style={{
                  color: COLORS.WHITE,
                  backgroundColor: getColourForAssetType(type as AssetType),
                }}
              />
            </Col>

            <Col>
              <span className="quantity">
                {`${toCurrency(price, curr as string, true)} `}
                <ShoppingCartOutlined />{" "}
                {toReadableNumber(qty, ("" + qty).includes(".") ? 3 : 0)}
              </span>
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