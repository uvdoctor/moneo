import React from "react";
import { toCurrency, toReadableNumber } from "../utils";
import SVGInfo from "../svginfo";
import SVGImp from "../svgimp";
import { toast } from "react-toastify";
interface ResultItemProps {
  label: string;
  svg?: any;
  result: number | string;
  noResultFormat?: boolean;
  currency?: string;
  unit?: string;
  footer?: string;
  decimal?: number;
  titleFormat?: boolean;
  info?: string;
  imp?: string;
  pl?: boolean;
}

export default function ResultItem(props: ResultItemProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <label
        className={props.titleFormat ? "text-xl md:text-2xl font-semibold" : ""}
      >
        {props.label}
      </label>
      <div className="flex justify-between items-start font-semibold">
        <div className="flex justify-center items-center">
          {props.svg}
          <div
            className={`ml-1 ${
              props.pl
                ? props.result > 0
                  ? "text-green-600"
                  : "text-red-600"
                : ""
            }`}
          >
            {typeof props.result === "string"
              ? `${props.result} ${props.unit ? props.unit : ""}`
              : props.currency
              ? toCurrency(Math.abs(props.result), props.currency)
              : props.noResultFormat
              ? props.result
              : toReadableNumber(
                  Math.abs(props.result),
                  props.decimal ? props.decimal : 0
                ) + props.unit}
          </div>
        </div>
        <div className="ml-1 flex justify-end items-start cursor-pointer">
          {props.imp && (
            <div onClick={() => toast.error(props.imp)}>
              <SVGImp />
            </div>
          )}
          {props.info && (
            <div onClick={() => toast.info(props.info)}>
              <SVGInfo />
            </div>
          )}
        </div>
      </div>
      <label>{props.footer}</label>
    </div>
  );
}
