import React, { useState, useEffect } from "react";
import { Input, Dropdown, List, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import simpleStorage from "simplestorage.js";
import { getInstrumentDataWithKey, optionTableMap } from "./nw/nwutils";
import { TAB } from "./nw/NWContext";
import { getCryptoList } from "./utils";

interface SearchProps {
  inline?: boolean;
  header?: any;
  searchType: string;
  renderItem: any;
  hasOnlyIndiaOption?: boolean;
}

export default function Search({
  inline,
  header,
  searchType,
  renderItem,
  hasOnlyIndiaOption
}: SearchProps) {
  const { Option } = Select;
  const { BOND, MF, ETF, GOLDB, REIT, OIT, CRYPTO, STOCK } = TAB;
  const [exchange, setExchange] = useState("NSE");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<any>>([
    // {
    //   Code: "SBIN",
    //   Exchange: "NSE",
    //   Name: "State Bank of India",
    //   Type: "Common Stock",
    //   Country: "India",
    //   Currency: "INR",
    //   ISIN: "INE062A01020",
    //   previousClose: 529.6,
    //   previousCloseDate: "2022-02-11",
    // },
  ]);

  const hasOnlyIndiaIns = (tab: string) => [GOLDB, REIT, OIT, "index"].includes(tab) || hasOnlyIndiaOption;
  const hasNoDropdown = (type: string) => [CRYPTO].includes(type);
  const options = hasOnlyIndiaIns(searchType)
    ? [{ key: "NSE", value: "INDIA" }]
    : [
        { key: "NSE", value: "INDIA" },
        { key: "US", value: "US" },
      ];

  const exchangeComp = (
    <Select value={exchange} onChange={setExchange}>
      {options.map((item: { key: string; value: string }) => {
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
  // let searchTimeout: any;
  const onSearch = ({ target: { value } }: any) => {
    setSearchText(value);
  };

  const updateOptions = async (opt: string) => {
    return await getInstrumentDataWithKey(optionTableMap[opt], opt);
  };

  const getOption = (type: string) => {
    const opt: { [key:string]: string } = {
      bond: BOND,
      etf: ETF,
      fund: MF,
      index: "Index",
      stock: STOCK
    }
    return opt[type] ? opt[type] : type;
  }

  const getSearchData = async () => {
    try {
      setLoading(true);
      let data = [];
      if (searchType === CRYPTO) {
        const cryptolist = await getCryptoList();
        const response = cryptolist.filter((item: any) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        data = response.map((item: any) => {
          return {
            Code: item.name,
            Name: item.name,
            ISIN: item.code,
          };
        });
      } else if (exchange !== "US") {
        let opt = getOption(searchType);
        let cachedData = simpleStorage.get(opt);
        if (!cachedData) cachedData = await updateOptions(opt);
        const response = cachedData.filter(
          (item: any) =>
            item?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.sid?.toLowerCase().includes(searchText.toLowerCase())
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
      }
      Array.isArray(data) ? setSearchResults(data) : setSearchResults([]);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   if (searchText?.length < 3) return;
  //   if (searchTimeout) clearTimeout(searchTimeout);

  //   searchTimeout = setTimeout(() => {
  //     getSearchData();
  //   }, 200);
  // }, [searchText]);

  useEffect(()=>{
    setSearchText('')
    setSearchResults([...[]])
  },[searchType])

  useEffect(() => {
    if (searchText?.length < 3) return;
    getSearchData();
  }, [exchange, searchText]);

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
            loading={loading}
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
        addonAfter={hasNoDropdown(searchType) ? "" : exchangeComp}
        prefix={<SearchOutlined />}
        onChange={onSearch}
      />
    </Comp>
  );
}
