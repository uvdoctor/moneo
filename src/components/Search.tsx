import React, { useState, useEffect, useContext } from "react";
import { Select, AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import simpleStorage from "simplestorage.js";
import {
  getExchgRate,
  getInstrumentDataWithKey,
  optionTableMap,
} from "./nw/nwutils";
import { TAB } from "./nw/NWContext";
import { getCryptoList } from "./utils";
import { AppContext } from "./AppContext";

require("./Search.less");

interface SearchProps {
  searchType: string;
  setSearchType?: Function;
  width?: string;
  isNav?: boolean;
  onClick: Function;
  exchg?: string;
  setExchg?: any;
}

export default function Search({
  searchType,
  width,
  setSearchType,
  isNav,
  onClick,
  exchg,
  setExchg,
}: SearchProps) {
  const { user }: any = useContext(AppContext);
  const { Option } = Select;
  const { CRYPTO, STOCK, MF, BOND, ETF } = TAB;
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState<boolean>(false);
  const [exchgDropdownOpen, setExchgDropdownOpen] = useState<boolean>(false);

  const hasExchg = (type: string) => [STOCK, MF, BOND, ETF].includes(type);
  const usSearchType = {
    [STOCK]: 'stock',
    [MF]: 'fund',
    [ETF]: 'etf',
    [BOND]: 'bond'
  }

  const onSearch = async (text: any) => {
    setOpen(true);
    if (exchg === "US") {
      let response = await fetch(
        `/api/search?text=${searchText}&type=${usSearchType[searchType]}&exchange=${exchg}`
      );
      const data = await response.json();
      let result: any = [];
      if (Array.isArray(data))
        data.map((item: any) => {
          const { Code, ISIN, Name, previousClose, Currency } = item;
          result.push({
            id: ISIN ? ISIN : Code,
            sid: Code,
            name: Code,
            type: searchType === STOCK ? "A" : null,
            subt: searchType === STOCK ? "S" : null,
            price: previousClose,
            value: Name,
            key: ISIN,
            itype: searchType === ETF ? "ETF" : null,
            curr: Currency
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
    if (!hasExchg(searchType)) setExchg && setExchg("INDIA");
    if (exchg !== "US") getSearchData();
  }, [searchType, exchg]);

  useEffect(() => {
    if (!searchText) setOpen(false);
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
        const nameMap: any = {};
        cachedData?.map((item: any) => {
          let value = item.name;
          if (item.createdAt) delete item.createdAt;
          if (item.updatedAt) delete item.updatedAt;
          if (nameMap[value]) value = `${item.name} - ${item.sid}`;
          item.value = value;
          nameMap[value] = value;
        });
        setData([...cachedData]);
        setSuggestions([...cachedData]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const TypeComp = (
    <Select
      open={typeDropdownOpen}
      onMouseEnter={() => setTypeDropdownOpen(true)}
      onSelect={() => setTypeDropdownOpen(false)}
      onPopupScroll={() => setTypeDropdownOpen(true)}
      value={searchType}
      onChange={(val) => setSearchType && setSearchType(val)}
    >
      <Option key={STOCK} value={STOCK}>
        STOCK
      </Option>
      <Option key={MF} value={MF}>
        MF
      </Option>
      <Option key={ETF} value={ETF}>
        ETF
      </Option>
    </Select>
  );

  const ExchgComp = (
    <Select
      open={exchgDropdownOpen}
      onMouseEnter={() => setExchgDropdownOpen(true)}
      onSelect={() => setExchgDropdownOpen(false)}
      onPopupScroll={() => setExchgDropdownOpen(true)}
      value={exchg}
      onChange={(val) => setExchg && setExchg(val)}
    >
      <Option key={"INDIA"} value={"NSE"}>
        INDIA
      </Option>
      <Option key={"US"} value={"US"}>
        US
      </Option>
    </Select>
  );

  const updateOptions = async (opt: string) => {
    return await getInstrumentDataWithKey(optionTableMap[opt], opt, user);
  };

  return (
    <div className="main-search">
      <AutoComplete
        onMouseLeave={() => {
          setTypeDropdownOpen(false)
          setExchgDropdownOpen(false)
        }}
        id="search"
        options={suggestions}
        onChange={(option) => setSearchText(option)}
        onSelect={async (_option: any, obj: any) => {
          let resp = obj;
          if (searchType === CRYPTO) {
            resp = { id: obj.code, name: obj.name, curr: "USD" };
          }
          if (hasExchg(searchType) && exchg === "US") {
            const data = await getExchgRate(obj.sid, exchg);
            resp.price = data.price;
            resp.prev = data.prev;
            resp.exchg = exchg;
          }
          onClick(resp);
          setSearchText("");
          setSuggestions([...[]]);
          setOpen(false);
        }}
        size="large"
        value={searchText}
        onSearch={onSearch}
        open={isNav ? open : undefined}
      >
        <Input
          style={{ width: width ? width : "auto" }}
          size="large"
          placeholder={`Search ${searchType}`}
          addonAfter={isNav ? TypeComp : ""}
          addonBefore={exchg && hasExchg(searchType) ? ExchgComp : ""}
          prefix={<SearchOutlined />}
        />
      </AutoComplete>
    </div>
  );
}
