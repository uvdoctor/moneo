import React, { useRef, useEffect, useState } from "react";
import { toCurrency, toReadableNumber } from "../utils";
import { Slider } from "antd";
import { COLORS } from "../../CONSTANTS";
import { Tooltip } from "antd";
interface NumberInputProps {
  info?: string;
  pre: string;
  post?: string;
  min: number;
  max: number;
  value: number;
  width?: string;
  name: string;
  currency?: string;
  rangeFactor?: number;
  unit?: string;
  changeHandler: any;
  note?: any;
  step?: number;
  feedback?: any;
}

export default function NumberInput(props: NumberInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const readOnlyRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [sliderBorderColor, setSliderBorderColor] = useState<string>(COLORS.GREEN);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const width: string = props.width
    ? props.width
    : props.currency
    ? "140px"
    : props.unit
    ? "40px"
    : "70px";
  const [rangeFactor, setRangeFactor] = useState<number>(
    props.rangeFactor ? props.rangeFactor : 1
  );

  useEffect(() => {
    formRef.current?.reportValidity();
  }, [formRef]);

  useEffect(() => {
    if (props.rangeFactor) setRangeFactor(props.rangeFactor);
    else setRangeFactor(1);
  }, [props.rangeFactor]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
        inputRef.current?.blur()
    }
  };

  const getClosestKey = (value: number, keys: Array<number>) => {
    let result: number = keys[0];
    keys.forEach((k) => {
      if (value >= k) result = k;
      else return result;
    });
    return result;
  };

  const provideFeedback = (val: number) => {
    if (props.feedback) {
      let allKeys = Object.keys(props.feedback);
      let allSortedKeys = allKeys
        .map((k) => parseFloat(k))
        .sort((a, b) => a - b);
      let feedback: any = props.feedback[getClosestKey(val, allSortedKeys)];
      if (!feedback || !feedback.label) {
        setSliderBorderColor("white");
        setFeedbackText("");
      } else {
        setSliderBorderColor(feedback.color);
        setFeedbackText(feedback.label);
      }
    }
  };

  return (
          <form ref={formRef}>
            {props.info && <Tooltip title={props.info} />}
            <div
              className={`w-full flex justify-between ${
                props.max ? "items-center" : "flex-col"
              }`}
            >
              <div
                className={`w-full flex flex-col mr-1 ${
                  props.max ? "text-left" : "text-right"
                }`}
              >
                {props.pre && <label>{props.pre}</label>}
                {props.post && <label>{props.post}</label>}
              </div>
              <div className="flex justify-end">
                {!props.currency || (props.currency && editing) ? (
                  <input
                    ref={inputRef}
                    className="input"
                    type="number"
                    name={props.name}
                    value={props.value || props.currency ? props.value : 0}
                    min={props.min * rangeFactor}
                    max={props.max * rangeFactor}
                    step={props.step ? props.step * rangeFactor : 1}
                    onChange={(e) => {
                      let val = e.currentTarget.valueAsNumber;
                      provideFeedback(val);
                      props.changeHandler(val);
                    }}
                    onFocus={(e) => {
                      if (!props.value && e.currentTarget.value === "0")
                        e.currentTarget.value = "";
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={(e) => {
                      setEditing(false);
                      if (!props.currency && !props.value)
                        e.currentTarget.valueAsNumber = 0;
                    }}
                    required
                    style={{ textAlign: "right", width: width }}
                  />
                ) : (
                  <input
                    ref={readOnlyRef}
                    className="input"
                    type="text"
                    name={props.name}
                    value={toCurrency(
                      !props.value ? 0 : props.value,
                      props.currency
                    )}
                    onFocus={() => {
                      setEditing(true)}
                    }
                    style={{ textAlign: "right", width: width }}
                    readOnly
                  />
                )}
              </div>
              {props.unit && <label className="ml-1">{props.unit}</label>}
            </div>
            {props.max && (
              <div className="flex flex-col mt-1">
                {/*@ts-ignore: JSX element class does not support attributes because it does not have a 'props' property.*/}
                <Slider
                  min={props.min * rangeFactor}
                  max={props.max * rangeFactor}
                  step={(props.step as number) * rangeFactor}
                  value={props.value}
                  onChange={(val: number) => {
                    provideFeedback(val);
                    props.changeHandler(val);
                  }}
                  handleStyle={{
                    cursor: "grab",
                    borderColor: sliderBorderColor,
                  }}
                />
                {props.max && (
                  <div className="flex justify-between w-full text-gray-400">
                    <label className="mr-2">
                      {toReadableNumber(
                        props.min ? props.min * rangeFactor : 0
                      )}
                    </label>
                    {feedbackText}
                    <label>{toReadableNumber(props.max * rangeFactor)}</label>
                  </div>
                )}
              </div>
            )}
            <label className="flex justify-center">{props.note}</label>
          </form>
  );
}
