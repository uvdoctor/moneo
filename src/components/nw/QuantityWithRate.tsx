import { Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import NumberInput from "../form/numberinput";
import InsPrice from "./InsPrice";
import { TAB, NWContext } from "./NWContext";
import { getCommodityRate, getCryptoRate, initializeNPSData } from "./nwutils";

interface QuantityWithRateProps {
  quantity: number;
  subtype: string;
  name: string;
  onChange: Function;
  pre?: string;
  info?: string;
}
export default function QuantityWithRate({
  quantity,
  subtype,
  name,
  onChange,
  pre,
  info,
}: QuantityWithRateProps) {
  const { selectedCurrency, childTab, fxRates }: any = useContext(NWContext);
  const [rate, setRate] = useState<number>(0);
  const [prevRate, setPrevRate] = useState<number>(0);

  const getRate = async (subtype: string, name: string) => {
    if (childTab === TAB.NPS) {
      const npsData = await initializeNPSData();
      if (npsData) {
        const record = npsData.find((item: any) => item.id === name);
        if (record) return { price: record.price, prev: record.prev };
      } else return { price: 0, prev: 0 };
    }
    if (childTab === TAB.CRYPTO) {
      return {
        price: await getCryptoRate(name, selectedCurrency, fxRates),
        prev: 0,
      };
    }
    return {
      price: await getCommodityRate(subtype, name, selectedCurrency, fxRates),
      prev: 0,
    };
  };

  useEffect(() => {
    if (!name || !subtype) {
      setRate(0);
      return;
    }
    getRate(subtype, name)
      .then((prices: any) => {
        setRate(prices.price);
        setPrevRate(prices.prev);
      })
      .catch(() => 0);
  }, [name, subtype]);

  return (
    <Row align="middle">
      <Col>
        <NumberInput
          pre={pre}
          value={quantity}
          changeHandler={onChange}
          step={0.1}
          info={info}
          unit={childTab === TAB.PM ? "grams" : ""}
        />
      </Col>
      <Col>&nbsp;x&nbsp;</Col>
      <Col>
        <InsPrice
          price={rate}
          previousPrice={prevRate}
          currency={selectedCurrency}
        />
      </Col>
    </Row>
  );
}
