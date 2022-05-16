import React, { ReactNode, Fragment } from "react";
import { getCurrencyList } from "../utils";
import { Select } from "antd";
import LabelWithTooltip from "./LabelWithTooltip";

interface SelectInputProps {
  disabled?: boolean;
  info?: string;
  style?: object;
  pre: string | ReactNode;
  post?: ReactNode;
  options?: any;
  value: string | number;
  unit?: string;
  changeHandler: any;
  currency?: boolean;
  loading?: boolean;
  inline?: boolean;
}

export default function SelectInput(props: SelectInputProps) {
  const { Option } = Select;
  const selectOptions = props.currency ? getCurrencyList() : props.options;

  return (
    <Fragment>
      <LabelWithTooltip
        label={props.pre}
        info={props.info}
        inline={props.inline}
      />
      <Select
        showSearch
        style={props.style}
        optionFilterProp="children"
        value={props.currency ? props.value : selectOptions[props.value]}
        onChange={(value: string) => props.changeHandler(value)}
        filterOption={(input, option) =>
          //@ts-ignore
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        disabled={props.disabled ? props.disabled : false}
        defaultValue={selectOptions[props.value]}
        loading={props.loading ? props.loading : false}>
        {Object.keys(selectOptions).map((key) => (
          <Option key={key} value={key}>
            {props.currency ? key : selectOptions[key]}
          </Option>
        ))}
      </Select>
      {props.unit ? (
        <>
          &nbsp;
          {props.unit}
        </>
      ) : null}
      {props.post ? (
        <>
          <br />
          {props.post}
        </>
      ) : null}
    </Fragment>
  );
}
