import { InputNumber } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import LabelWithTooltip from "../form/LabelWithTooltip";
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
      return { price: await getCryptoRate(name, selectedCurrency, fxRates), prev: 0 };
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
    <Fragment>
      {pre && <LabelWithTooltip label={pre} info={info} />}
      <InputNumber
        value={quantity}
        onChange={(quantity: number) => onChange(quantity)}
        min={0}
        max={100000}
        step={0.1}
        size="middle"
      />
      {` ${childTab === TAB.PM ? ` grams` : ""} x `}
      <InsPrice
        price={rate}
        previousPrice={prevRate}
        currency={selectedCurrency}
      />
    </Fragment>
  );
}
