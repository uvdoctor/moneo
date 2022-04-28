import React, { useState, useEffect } from "react";
import { Select, AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import simpleStorage from "simplestorage.js";
import { getExchgRate, getInstrumentDataWithKey, optionTableMap } from "./nw/nwutils";
import { TAB } from "./nw/NWContext";
import { getCryptoList } from "./utils";

interface SearchProps {
  searchType: string;
  setSearchType?: Function;
  width?: string;
  isNav?: boolean;
  onClick: Function;
  options?: any;
  exchg?: string;
  setExchg?: any;
}

export default function Search({
  searchType,
  width,
  setSearchType,
  isNav,
  onClick,
  options,
  exchg,
  setExchg,
}: SearchProps) {
  const { Option } = Select;
  const { CRYPTO, STOCK } = TAB;
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [open, setOpen] = useState<boolean>(false);

  const onSearch = async (text: any) => {
    setOpen(true)
    if (exchg === "US" && searchType === STOCK) {
      let response = await fetch(
        `/api/search?text=${searchText}&type=stock&exchange=${exchg}`
      );
      const data = await response.json();
      let result: any = [];
      if (Array.isArray(data))
        data.map((item: any) => {
          const { Code, ISIN, Name, previousClose } = item;
          result.push({
            id: ISIN,
            sid: Code,
            name: Code,
            type: "A",
            subt: "S",
            price: previousClose,
            value: Name,
            key: ISIN
          });
        });
      return setSuggestions(result);
    }
    if (!data) return;
    const result = data
      ? data.filter((item: { name: string }) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        )
      : [];
    setSuggestions([...result]);
  };

  useEffect(() => {
    setSearchText("");
    setData([...[]]);
    setSuggestions([...[]]);
    if(searchType !== STOCK) setExchg('INDIA');
    if (exchg !== "US") getSearchData();
  }, [searchType, exchg]);

  useEffect(() => {
    if(!searchText) setOpen(false);
  }, [searchText]);

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
      value={isNav ? searchType : exchg}
      onChange={(val) =>
        isNav ? setSearchType && setSearchType(val) : setExchg && setExchg(val)
      }
    >
      {options &&
        options?.map((item: any) => {
          return (
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        })}
    </Select>
  );

  const updateOptions = async (opt: string) => {
    return await getInstrumentDataWithKey(optionTableMap[opt], opt);
  };

  return (
    <AutoComplete
      id="search"
      options={suggestions}
      onChange={(option) => setSearchText(option)}
      onSelect={async (_option: any, obj: any) => {
        let resp = obj;
        if (searchType === CRYPTO) {
          resp = { id: obj.code, name: obj.name };
        }
        if(searchType === STOCK && exchg === "US") {
          const data = await getExchgRate(obj.sid, exchg);
          resp.price = data.price;
          resp.prev = data.prev;
        }
        onClick(resp);
        setSearchText("");
        setSuggestions([...[]]);
        setOpen(false)
      }}
      size="large"
      value={searchText}
      onSearch={onSearch}
      open={options ? open : undefined}
    >
      <Input
        style={{ width: width ? width : "auto" }}
        size="large"
        placeholder={`Search ${isNav ? exchg : searchType}`}
        addonAfter={options ? typeComp : ""}
        prefix={<SearchOutlined />}
      />
    </AutoComplete>
  );
}
