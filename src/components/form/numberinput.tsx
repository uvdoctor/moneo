import React, { useEffect, useRef, useState } from "react";
import {
  getRangeFactor,
  parseNumber,
  toCurrency,
  toHumanFriendlyCurrency,
  toReadableNumber,
} from "../utils";
import { InputNumber } from "antd";
import LabelWithTooltip from "./LabelWithTooltip";
interface NumberInputProps {
  info?: string;
  pre: any;
  post?: any;
  min?: number;
  max?: number;
  value: number;
  currency?: string;
  unit?: string;
  changeHandler: any;
  step?: number;
  noRangeFactor?: boolean;
  addBefore?: any;
  disabled?: boolean;
}

export default function NumberInput({
  info,
  pre,
  post,
  min = 0,
  max = 100000000,
  value,
  currency,
  unit,
  changeHandler,
  step = 1,
  noRangeFactor = currency ? false : true,
  addBefore,
  disabled,
}: NumberInputProps) {
  const inputRef = useRef(null);
  const [rangeFactor, setRangeFactor] = useState<number>(
    noRangeFactor || !currency ? 1 : getRangeFactor(currency)
  );
  const [minNum, setMinNum] = useState<number>(min * rangeFactor);
  const [maxNum, setMaxNum] = useState<number>(max * rangeFactor);
  const [stepNum, setStepNum] = useState<number>(step * rangeFactor);

  useEffect(() => {
    let minNum = min * rangeFactor;
    let maxNum = max * rangeFactor;
    let stepNum = step * rangeFactor;
    setMinNum(minNum);
    setMaxNum(maxNum);
    setStepNum(stepNum);
  }, [rangeFactor, min, max]);

  useEffect(() => {
    if (!currency || noRangeFactor) return;
    let rf = getRangeFactor(currency as string);
    if (rf !== rangeFactor) setRangeFactor(rf);
  }, [currency]);

  const inputConfig = {
    ref: inputRef,
    value,
    min: minNum,
    max: maxNum,
    step: stepNum,
    addonBefore: addBefore,
    addonAfter: unit,
    onChange: (val: number) => changeHandler(val as number),
    formatter: (val: number) =>
      currency
        ? toCurrency(val as number, currency)
        : toReadableNumber(val as number, 2),
    parser: (val: string) =>
      currency
        ? parseFloat(parseNumber(val as string, currency))
        : parseFloat(val as string),
    onPressEnter: (e: any) => {
      e.preventDefault();
      //@ts-ignore
      inputRef.current.blur();
    },
    onBlur: (e: any) => {
      let num = currency
        ? parseInt(parseNumber(e.currentTarget.value, currency))
        : parseFloat(e.currentTarget.value);
      if (!num || num < minNum) changeHandler(minNum);
    },
    style: {
      width: addBefore
        ? "220px"
        : maxNum < 1000 && (!unit || unit?.length < 2)
        ? "100px"
        : "150px",
    },
  };

  return (
    <>
      <LabelWithTooltip label={pre} info={info} />
      {/*@ts-ignore*/}
      <InputNumber
        {...inputConfig}
        key={currency ? `${currency}-${pre}` : pre}
        disabled={disabled}
      />
      {currency && value > 100000
        ? `${value % 1000 ? " ~ " : " "}${toHumanFriendlyCurrency(
            value,
            currency
          )}`
        : null}
      {post ? (
        <>
          <br />
          {post}
        </>
      ) : null}
    </>
  );
}
