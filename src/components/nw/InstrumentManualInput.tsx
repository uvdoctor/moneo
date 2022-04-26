import React, { useState, useEffect } from "react";
import { Row, Col, Button, Badge } from "antd";
import simpleStorage from "simplestorage.js";
import { COLORS, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import { AssetType, InstrumentInput } from "../../api/goals";
import { toCurrency, toHumanFriendlyCurrency } from "../utils";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { getColourForAssetType } from "./nwutils";
import NumberInput from "../form/numberinput";

interface InstrumentManualInput {
  instrument: InstrumentInput;
  index: number;
  deleteInstrument: Function;
}

export default function InstrumentManualInput({
  instrument,
  index,
  deleteInstrument,
}: InstrumentManualInput) {
  const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
  const price = insData[instrument.id] ? insData[instrument.id].price : 0;
  const [quantity, setQuantity] = useState<number>(instrument.qty);
  const [total, setTotal] = useState<number>(price * quantity);

  useEffect(() => {
    instrument.qty = quantity;
    setTotal(price * quantity);
  }, [quantity]);

  return (
    <>
      <Row justify="space-between">
        <Col>
          {!insData[instrument.id] ? (
            <h4 style={{ color: COLORS.RED }}>
              Sorry, unable to find price for this one!
            </h4>
          ) : (
            insData[instrument.id]?.name
          )}
        </Col>

        <Col className="quantity">
          <strong>
            {toHumanFriendlyCurrency(total, instrument.curr as string)}
          </strong>
          &nbsp;
          <Button type="link" danger onClick={() => deleteInstrument(index)}>
            <DeleteOutlined />
          </Button>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col>
          <Row align="middle" gutter={8}>
            <Col>
              <Badge
                count={instrument.sid}
                style={{
                  color: COLORS.WHITE,
                  backgroundColor: getColourForAssetType(
                    instrument.type as AssetType
                  ),
                }}
              />
            </Col>
          </Row>
        </Col>

        <Col className="quantity">
          {`${toCurrency(price, instrument.curr as string, true)} `}
          <ShoppingCartOutlined />
          &nbsp;
          <NumberInput
            value={quantity}
            changeHandler={setQuantity}
            pre={""}
            min={1}
          />
        </Col>
      </Row>
    </>
  );
}
