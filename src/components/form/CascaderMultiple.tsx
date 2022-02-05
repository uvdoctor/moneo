import React, { ReactNode, Fragment } from "react";
import LabelWithTooltip from "./LabelWithTooltip";
import { isMobileDevice } from "../utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import { Cascader } from "antd";

interface CascaderMultipleProps {
  info?: string;
  pre: string | ReactNode;
  options: any;
  parentValue: Array<string>;
  parentChangeHandler: any;
  childChangeHandler?: any;
  childValue?: Array<string>;
  width?: number;
}

export default function CascaderMultiple({
  parentValue,
  childValue,
  pre,
  info,
  options,
  childChangeHandler,
  parentChangeHandler,
  width,
}: CascaderMultipleProps) {
  const fsb = useFullScreenBrowser();
  const defaultValue: any = childChangeHandler
    ? [parentValue, childValue]
    : [parentValue];
  const onChange = (value: any) => {
    let parent = [];
    let child = [];
    for (let val of value) {
      parent.push(val[0]);
      val[1] && child.push(val[1]);
    }
    if (childChangeHandler) {
      parentChangeHandler(parent);
      childChangeHandler(child);
    } else {
      parentChangeHandler(parent);
    }
  };

  const filter = (inputValue: string, path: any[]) => {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  };

  return (
    <Fragment>
      <LabelWithTooltip label={pre} info={info} />
      <Cascader
        allowClear={false}
        bordered={false}
        style={{ width: isMobileDevice(fsb) ? 250 : width ? width : 500 }}
        defaultValue={defaultValue}
        options={options}
        onChange={onChange}
        showSearch={{ filter }}
        multiple
        maxTagCount="responsive"
      />
    </Fragment>
  );
}
