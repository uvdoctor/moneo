import React, { useState, useEffect } from "react";
import { Select, AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import simpleStorage from "simplestorage.js";
import { getInstrumentDataWithKey, optionTableMap } from "./nw/nwutils";
import { TAB } from "./nw/NWContext";
import { getCryptoList } from "./utils";

interface SearchProps {
  searchType: string;
  width?: string;
  setSearchType?: Function;
  isNav?: boolean;
  onClick: Function;
}

export default function Search({
  searchType,
  width,
  setSearchType,
  isNav,
  onClick,
}: SearchProps) {
  const { Option } = Select;
  const { BOND, MF, ETF, CRYPTO, STOCK } = TAB;
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);

  const onSearch = (text: any) => {
    if (!data) return;
    const result = data
      ? data.filter((item: { name: string }) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        )
      : [];
    setSuggestions([...result]);
  };

  useEffect(() => {
    getSearchData();
  }, [searchType]);

  const getSearchData = async () => {
    try {
      if (searchType === CRYPTO) {
        const cryptolist = await getCryptoList();
        setData([...cryptolist]);
        setSuggestions([...cryptolist]);
      } else {
        let opt = searchType;
        let cachedData = simpleStorage.get(opt);
        if (!cachedData) cachedData = await updateOptions(opt);
        cachedData?.forEach(
          (item: { value: string; name: string }) => (item.value = item.name)
        );
        setData([...cachedData]);
        setSuggestions([...cachedData]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const typeComp = (
    <Select
      value={searchType}
      onChange={(val) => setSearchType && setSearchType(val)}
    >
      <Option value={STOCK}>{STOCK}</Option>
      <Option value={MF}>{MF}</Option>
      <Option value={BOND}>{BOND}</Option>
      <Option value={ETF}>{ETF}</Option>
    </Select>
  );

  const updateOptions = async (opt: string) => {
    return await getInstrumentDataWithKey(optionTableMap[opt], opt);
  };

  useEffect(() => {
    setSearchText('')
    setSuggestions([...[]]);
  }, [searchType]);

  return (
    <AutoComplete
      id="search"
      options={suggestions}
      onChange={(option) => setSearchText(option)}
      onSelect={(_option, obj) => {
        let resp = obj;
        if (searchType === CRYPTO) {
          resp = { id: obj.code, name: obj.name };
        }
        onClick(resp);
      }}
      size="large"
      value={searchText}
      onSearch={onSearch}
    >
      <Input
        style={{ width: width ? width : "auto" }}
        size="large"
        placeholder="Search stocks, bonds and MF's"
        addonAfter={isNav ? typeComp : ""}
        prefix={<SearchOutlined />}
      />
    </AutoComplete>
  );
}
