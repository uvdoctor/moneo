import React, { Fragment } from "react";
import NextStep from "./nextstep";
import { getCurrencyList } from "../utils";
import SVGInfo from "../svginfo";
import { toast } from "react-toastify";
import { INPUT_HIGHLIGHT } from "../../CONSTANTS";
interface SelectInputProps {
  inputOrder: number;
  currentOrder: number;
  nextStepDisabled: boolean;
  nextStepHandler: Function;
  allInputDone: boolean;
  actionCount?: number;
  disabled?: boolean;
  info?: string;
  pre: string;
  post?: string;
  options?: any;
  value: string | number;
  name: string;
  unit?: string;
  changeHandler: any;
  currency?: boolean;
}

export default function SelectInput(props: SelectInputProps) {
  return (
    <div className="w-full flex items-center justify-center">
      {((!props.allInputDone && props.inputOrder <= props.currentOrder) ||
        props.allInputDone) && (
        <div
          className={`flex flex-col
                ${
                  !props.allInputDone &&
                  props.inputOrder === props.currentOrder &&
                  INPUT_HIGHLIGHT
                }`}
        >
          {props.info && (
            <div
              className="w-full flex justify-end cursor-pointer"
              onClick={() => toast.info(props.info)}
            >
              <SVGInfo />
            </div>
          )}
          {props.pre && <label className="whitespace-no-wrap">{props.pre}</label>}
          {!props.disabled ? (
            <Fragment>
              <div className="flex items-center">
                <select
                  name={props.name}
                  className="input"
                  style={{ minWidth: "40px" }}
                  value={props.value}
                  onChange={(e) => props.changeHandler(e.currentTarget.value)}
                >
                  {Object.keys(
                    props.currency ? getCurrencyList() : props.options
                  ).map((key) => (
                    <option key={key} value={key}>
                      {props.currency ? key : props.options[key]}
                    </option>
                  ))}
                </select>
                {props.unit && <label className="ml-1">{props.unit}</label>}
              </div>
              {props.post && <label>{props.post}</label>}
            </Fragment>
          ) : (
            <label>{props.value}</label>
          )}
        </div>
      )}
      {!props.allInputDone && props.inputOrder === props.currentOrder && (
            <NextStep
              nextStepHandler={() =>
                props.nextStepHandler(props.actionCount ? props.actionCount : 1)
              }
              disabled={props.nextStepDisabled}
            />
          )}
    </div>
  );
}
