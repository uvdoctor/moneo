import React, { useState, useEffect } from "react";
import { Input, Dropdown, List, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import simpleStorage from "simplestorage.js";
import { getInstrumentDataWithKey, optionTableMap } from "./nw/nwutils";
import { TAB } from "./nw/NWContext";

interface SearchProps {
  inline?: boolean;
  options: any;
  searchResults: any;
  setSearchResults: Function;
  header?: any;
  searchType: string;
  renderItem: any;
}

export default function Search({
  inline,
  options,
  searchResults,
  setSearchResults,
  header,
  searchType,
  renderItem,
}: SearchProps) {
  const { Option } = Select;
  const { BOND, MF, ETF } = TAB;
  const [exchange, setExchange] = useState("NSE");
  const [searchText, setSearchText] = useState("");
  
  const exchangeComp = (
    <Select value={exchange} onChange={setExchange}>
      {options &&
        options.map((item: { key: string; value: string }) => {
          return (
            <Option key={item.key} value={item.key}>
              {item.value}
            </Option>
          );
        })}
    </Select>
  );
  interface InlineListProps {
    style?: any;
    children?: any;
    overlay?: any;
  }
  const InlineList = ({ children, overlay }: InlineListProps) => (
    <div>
      {children} {overlay}
    </div>
  );
  const Comp = inline ? InlineList : Dropdown;
  let searchTimeout: any;
  const onSearch = ({ target: { value } }: any) => {
    setSearchText(value);
  };

  const updateOptions = async (opt: string) => {
    return await getInstrumentDataWithKey(optionTableMap[opt], opt);
  };

  const getSearchData = async () => {
    try {
      let data = [];
      if (exchange !== "US" && searchType !== "stock") {
        let opt =
          searchType === "bond"
            ? BOND
            : searchType === "etf"
            ? ETF
            : searchType === "fund"
            ? MF
            : searchType;
        let cachedData = simpleStorage.get(opt);
        if (!cachedData) cachedData = await updateOptions(opt);
        const response = cachedData.filter(
          (item: any) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.sid.toLowerCase().includes(searchText.toLowerCase())
        );
        data = response.map((item: any) => {
          return {
            Code: item.sid,
            Exchange: item.exchg ? item.exchg : "",
            Name: item.name,
            Type: searchType,
            Country: "India",
            Currency: "INR",
            ISIN: item.id,
            previousClose: item.price,
            ...item,
          };
        });
      } else {
        let response = await fetch(
          `/api/search?text=${searchText}&type=${searchType}&exchange=${exchange}`
        );
        data = await response.json();
        // if(!data.length && exchange !== "US")
      }
      setSearchResults(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (searchText?.length < 3) return;
    if (searchTimeout) clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      getSearchData();
    }, 200);
  }, [searchText]);

  useEffect(() => {
    if (searchText?.length < 3) return;
    getSearchData();
  }, [searchType, exchange]);

  return (
    <Comp
      style={{ width: "600px" }}
      overlay={
        <div
          id="scrollableDiv"
          style={{
            height: 450,
            overflow: "auto",
          }}
        >
          <List
            size="small"
            header={header && header}
            bordered
            dataSource={searchResults}
            renderItem={(item: any) => renderItem(item)}
          />
        </div>
      }
      arrow
    >
      <Input
        style={{ width: "auto" }}
        value={searchText}
        size="large"
        placeholder="Search stocks, bonds and MF's"
        addonAfter={exchangeComp}
        prefix={<SearchOutlined />}
        onChange={onSearch}
      />
    </Comp>
  );
}
