import { InputNumber } from "antd";
import React, { Fragment, useContext } from "react";
import simpleStorage from "simplestorage.js";
import { LOCAL_RATES_DATA_KEY } from "../../CONSTANTS";
import LabelWithTooltip from "../form/LabelWithTooltip";
import { toCurrency } from "../utils";
import { TAB, NWContext } from "./NWContext";
import { getCommodityRate, getCryptoRate } from "./nwutils";

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
  const { selectedCurrency, childTab, npsData }: any = useContext(NWContext);

  const getRate = (subtype: string, name: string) => {
    if (childTab === TAB.NPS) {
      const price = npsData.find((item: any) => item.id === name);
      if (price) return price.price;
    }
    const ratesData = simpleStorage.get(LOCAL_RATES_DATA_KEY);
    if (childTab === TAB.CRYPTO)
      return getCryptoRate(ratesData, subtype, selectedCurrency);
    return getCommodityRate(ratesData, subtype, name, selectedCurrency);
  };

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
      {` ${childTab === TAB.PM ? ` grams` : ""} x ${toCurrency(
        getRate(subtype, name),
        selectedCurrency
      )} `}
    </Fragment>
  );
}
