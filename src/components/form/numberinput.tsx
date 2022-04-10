import React, { useEffect, useState } from "react";
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
  autoFocus?: boolean;
  inline?: boolean;
}

export default function NumberInput({
  info,
  pre,
  post,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  value,
  currency,
  unit,
  changeHandler,
  step = 1,
  noRangeFactor = currency ? false : true,
  addBefore,
  disabled,
  autoFocus,
  inline,
}: NumberInputProps) {
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
    setMaxNum(
      maxNum > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : maxNum
    );
    setStepNum(stepNum);
  }, [rangeFactor, min, max]);

  useEffect(() => {
    if (!currency || noRangeFactor) return;
    let rf = getRangeFactor(currency as string);
    if (rf !== rangeFactor) setRangeFactor(rf);
  }, [currency]);

  const inputConfig = {
    autoFocus,
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
        : parseFloat(parseNumber(val as string, null)),
    onPressEnter: (e: any) => {
      e.preventDefault();
      //@ts-ignore
      inputRef.current.blur();
    },
    onBlur: (e: any) => {
      let num = currency
        ? parseInt(parseNumber(e.currentTarget.value, currency))
        : parseFloat(e.currentTarget.value);
      if (!num) num = 0;
      if (num < minNum) changeHandler(minNum);
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
      <LabelWithTooltip
        label={inline ? `${pre} ` : pre}
        info={info}
        inline={inline}
      />
      {/*@ts-ignore*/}
      <InputNumber {...inputConfig} disabled={disabled} />
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
