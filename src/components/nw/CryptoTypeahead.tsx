import { AutoComplete } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import LabelWithTooltip from "../form/LabelWithTooltip";
import { getCryptoList } from "../utils";

interface CryptoTypeaheadProps {
  label: string;
  changehandler: Function;
  codeValue: string;
  info: string;
}

export default function CryptoTypeahead({
  label,
  changehandler,
  codeValue,
  info,
}: CryptoTypeaheadProps) {
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [value, setValue] = useState<string>("");

  const getList = async () => {
    return await getCryptoList();
  };

  useEffect(() => {
    if (codeValue && data) {
      const val = data.find((item) => item.code === codeValue);
      if (!val) return;
      setValue(val.name);
    }
  }, [codeValue, data, value]);

  useEffect(() => {
    getList().then((response) => {
      setData([...response]);
      setSuggestions([...response]);
    });
  }, []);

  const onSearch = (searchText: any) => {
    if (!data) return;
    const result = data
      ? data.filter((item: { name: string }) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];
    setSuggestions([...result]);
  };

  return (
    <Fragment>
      <LabelWithTooltip label={label} info={info} />
      <AutoComplete
        id="name"
        options={suggestions}
        style={{ width: 230 }}
        onChange={(option) => setValue(option)}
        onSelect={(_option, obj) => {
          const { code } = obj;
          changehandler(code);
        }}
        value={value}
        onSearch={onSearch}
      />
    </Fragment>
  );
}
