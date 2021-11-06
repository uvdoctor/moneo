import React, { useState, useContext } from "react";
import { Row, Col, Button, Divider, Badge } from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { COLORS } from "../../CONSTANTS";
import { AssetType } from "../../api/goals";
import HoldingInput from "./AddHoldingFinancialInputForm";
import {
  toCurrency,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import { getAssetSubTypes, getColourForAssetType } from "./nwutils";
import { NWContext } from "./NWContext";
require("./Holding.less");

export default function AddHoldingFinancialInput(props: any) {
  const [holdings, setHoldings] = useState<{}[]>([]);
  const [rawDetails, setRawDetails] = useState<any>({});
  const { allFamily }: any = useContext(NWContext);
  const { updateInstruments } = props;
  const deleteFromHoldings = (key: number) => {
    holdings.splice(key, 1);
    setHoldings([...holdings]);
    updateInstruments([...holdings]);
  };

  const addToHoldings = (newHolding: any, newRawDetails: any) => {
    setHoldings([...[newHolding], ...holdings]);
    updateInstruments([...[newHolding], ...holdings]);
    setRawDetails(Object.assign({}, rawDetails, newRawDetails));
  };

  const HoldingsRow = (props: { holding: any; key: number }) => {
    const {
      holding: { curr, name, qty, id, subt, fIds },
      key,
    } = props;
    const { itype, price, type } = rawDetails[id];
    const assetSubTypes: any = getAssetSubTypes();
    const getInsTypeStr = (id: string) =>
      itype ? `${itype} - ` : id.startsWith("INF") ? "Mutual Fund - " : "";

    return (
      <Row
        className="holding"
        style={{ marginBottom: "10px" }}
        gutter={[16, 50]}
        key={key}
      >
        <Col span={24}>
          <Row justify="space-between">
            <Col>
              {rawDetails[id] ? (
                `${getInsTypeStr(id)}${assetSubTypes[subt]}`
              ) : (
                <h4 style={{ color: COLORS.RED }}>
                  Sorry, unable to find price for this one!
                </h4>
              )}
            </Col>

            <Col>
              <UserOutlined />
              &nbsp;{allFamily[fIds[0]].name}
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>{name}</Col>
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
      <Divider orientation="left"></Divider>
      {holdings.map((holding, key) => (
        <HoldingsRow holding={holding} key={key} />
      ))}
    </>
  );
}
