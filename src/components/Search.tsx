import React, { useState, useEffect, useContext } from "react";
import { Select, AutoComplete, Input, Spin } from "antd";
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
import {
  BSE500,
  NIFTY100,
  NIFTY50,
  NIFTYNEXT,
  SENSEX,
} from "./nw/valuationutils";

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
  const { user, validateCaptcha }: any = useContext(AppContext);
  const { Option } = Select;
  const { CRYPTO, STOCK, MF, BOND, ETF } = TAB;
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [data, setData] = useState<Array<any>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState<boolean>(false);
  const [exchgDropdownOpen, setExchgDropdownOpen] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const hasExchg = (type: string) => [STOCK, MF, BOND, ETF].includes(type);
  const usSearchType = {
    [STOCK]: "stock",
    [MF]: "fund",
    [ETF]: "etf",
    [BOND]: "bond",
  };

  const getUSData = async () => {
    let response = await fetch(
      `/api/search?text=${searchText}&type=${usSearchType[searchType]}&exchange=${exchg}`
    );
    return await response.json();
  };

  const favourites = {
    US: {
      [STOCK]: [
        {
          id: "US5949181045",
          sid: "MSFT",
          name: "MSFT",
          type: "A",
          subt: "S",
          value: "Microsoft Corporation",
          key: "US5949181045",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US0231351067",
          sid: "AMZN",
          name: "AMZN",
          type: "A",
          subt: "S",
          value: "Amazon",
          key: "US0231351067",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US02079K3059",
          sid: "GOOGL",
          name: "GOOGL",
          type: "A",
          subt: "S",
          value: "Alphabet Inc",
          key: "US02079K3059",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US0378331005",
          sid: "AAPL",
          name: "AAPL",
          type: "A",
          subt: "S",
          value: "Apple Inc",
          key: "US0378331005",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US88160R1014",
          sid: "TSLA",
          name: "TSLA",
          type: "A",
          subt: "S",
          value: "Tesla Inc",
          key: "US88160R1014",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
      ],
      [MF]: [
        {
          id: "US9229083558",
          sid: "VSMPX",
          name: "VSMPX",
          type: null,
          subt: null,
          value:
            "Vanguard Total Stock Market Index Fund Institutional Plus Shares",
          key: "US9229083558",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US9229087104",
          sid: "VFIAX",
          name: "VFIAX",
          type: null,
          subt: null,
          value: "Vanguard 500 Index Fund Admiral Shares",
          key: "US9229087104",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US3159117502",
          sid: "FXAIX",
          name: "FXAIX",
          type: null,
          subt: null,
          value: "Fidelity 500 Index Fund",
          key: "US3159117502",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US9229087286",
          sid: "VTSAX",
          name: "VTSAX",
          type: null,
          subt: null,
          value: "Vanguard Total Stock Market Index Fund",
          key: "US9229087286",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US31617H1023",
          sid: "SPAXX",
          name: "SPAXX",
          type: null,
          subt: null,
          value: "Fidelity Government Money Market Fund",
          key: "US31617H1023",
          itype: null,
          curr: "USD",
          exchg: "US",
        },
      ],

      [ETF]: [
        {
          id: "US78462F1030",
          sid: "SPY",
          name: "SPY",
          type: null,
          subt: null,
          value: "SPDR S&P 500 ETF",
          key: "US78462F1030",
          itype: "ETF",
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US46090E1038",
          sid: "QQQ",
          name: "QQQ",
          type: null,
          subt: null,
          value: "Invesco QQQ ETF",
          key: "US46090E1038",
          itype: "ETF",
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US9219378356",
          sid: "BND",
          name: "BND",
          type: null,
          subt: null,
          value: "Vanguard Total Bond Market ETF",
          key: "US9219378356",
          itype: "ETF",
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US78463V1070",
          sid: "GLD",
          name: "GLD",
          type: null,
          subt: null,
          value: "SPDR Gold Shares ETF",
          key: "US78463V1070",
          itype: "ETF",
          curr: "USD",
          exchg: "US",
        },
        {
          id: "US46435G3341",
          sid: "EWU",
          name: "EWU",
          type: null,
          subt: null,
          value: "ISHARES MSCI UNITED KINGDOM ETF",
          key: "US46435G3341",
          itype: "ETF",
          curr: "USD",
          exchg: "US",
        },
      ],
      // [BOND]: [
      //   "Vanguard Tax-Exempt Bond ETF (ticker: VTEB",
      //   "Invesco National AMT-Free Municipal Bond ETF (PZA)",
      //   "iShares Core 1-5 Year USD Bond ETF (ISTB)",
      //   "Shenkman Capital Floating Rate High Income Fund (SFHIX)",
      //   "VanEck Vectors Fallen Angel High Yield Bond ETF (ANGL)",
      // ],
    },
    INDIA: {
      [STOCK]: [
        "INE040A01034",
        "INE467B01029",
        "INE154A01025",
        "INE002A01018",
        "INE030A01027",
      ],
      [MF]: [
        "INF109K01Z48",
        "INF846K01K35",
        "INF277K01Z77",
        "INF879O01027",
        "INF966L01689",
      ],
      [ETF]: [
        "INF247L01AP3",
        "INF209KB18D3",
        "INF204KB14I2",
        "INF204KC1030",
        "INF846K01Y96",
      ],
      [BOND]: [
        "INE033L08270",
        "INE031A07899",
        "INE053F07801",
        "INE787H07214",
        "INE134E07364",
      ],
      Index: [NIFTY50, BSE500, SENSEX, NIFTYNEXT, NIFTY100],
    },
    CRYPTO: ["BTC-USD", "XRP-USD", "ETH-USD"],
  };

  const arrangeUSData = (data: any) => {
    let result: any = [];
    if (Array.isArray(data))
      data.forEach((item: any) => {
        const { Code, ISIN, Name, previousClose, Currency, Exchange } = item;
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
          curr: Currency,
          exchg: Exchange,
        });
      });
    return result;
  };

  const onSearch = async (text: any) => {
    setOpen(true);
    const success = await validateCaptcha("search");
    if (!success) return;

    if (exchg === "US") {
      const data = await getUSData();
      const arrangedData = arrangeUSData(data);
      return setSuggestions(arrangedData);
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
    getSearchData();
  }, [searchType, exchg]);

  useEffect(() => {
    if (!searchText) {
      // setOpen(false);
      // setData([...[]]);
      // setSuggestions([...[]]);
    }
    if (exchg !== "US" && !data.length && !isDataLoading) {
      console.log(1);
      getSearchData();
    }
  }, [searchText]);

  const getSearchData = async () => {
    setData([...[]]);
    setSuggestions([...[]]);
    setIsDataLoading(true);
    let suggestions = [];
    let data = [];
    try {
      if (exchg === "US") {
        suggestions = favourites.US[searchType];
      } else if (searchType === CRYPTO) {
        data = await getCryptoList();
        suggestions = !searchText
          ? data.filter((item: any) =>
              favourites.CRYPTO.includes(item.code)
            )
          : data;
      } else {
        let opt = searchType;
        let cachedData = simpleStorage.get(opt);
        if (!cachedData) cachedData = await updateOptions(opt);
        const nameMap: any = {};
        cachedData?.forEach((item: any) => {
          let value = item.name;
          if (item.createdAt) delete item.createdAt;
          if (item.updatedAt) delete item.updatedAt;
          if (nameMap[value]) value = `${item.name} - ${item.sid}`;
          item.value = value;
          nameMap[value] = value;
        });
        suggestions =
          !searchText && searchType !== BOND
            ? cachedData.filter((item: any) =>
                favourites.INDIA[searchType].includes(item.id)
              )
            : cachedData;
      }
      if (!suggestions.length) suggestions = data;
      console.log(suggestions);
      setData([...data]);
      setSuggestions([...suggestions]);
      setIsDataLoading(false);
    } catch (err) {
      console.log(err);
      setIsDataLoading(false);
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

  const onSelect = async (obj: any) => {
    let resp = obj;
    if (searchType === CRYPTO)
      resp = { id: obj.code, name: obj.name, curr: "USD" };

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
  };

  return (
    <div className="main-search">
      <AutoComplete
        onMouseLeave={() => {
          setTypeDropdownOpen(false);
          setExchgDropdownOpen(false);
          setOpen(false);
        }}
        id="search"
        options={suggestions}
        onChange={(option) => setSearchText(option)}
        onSelect={async (_option: any, obj: any) => {
          await onSelect(obj);
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
          suffix={!isDataLoading ? <></> : <Spin size="small" />}
          prefix={<SearchOutlined />}
        />
      </AutoComplete>
    </div>
  );
}
