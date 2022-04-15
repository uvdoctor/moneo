import React, { useState } from "react";
import { Radio, List, Tag } from "antd";
import Link from "next/link";
import { ROUTES } from "../CONSTANTS";
import Search from "./Search";

interface SearchInputProps {
  inline?: boolean;
}

export default function SearchInput({ inline }: SearchInputProps) {
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("stock");
  const [searchResults, setSearchResults] = useState([
    {
      Code: "SBIN",
      Exchange: "NSE",
      Name: "State Bank of India",
      Type: "Common Stock",
      Country: "India",
      Currency: "INR",
      ISIN: "INE062A01020",
      previousClose: 529.6,
      previousCloseDate: "2022-02-11",
    },
  ]);

  const onSearchTypeChange = ({ target: { value } }: any) => {
    setSearchType(value);
  };

  return (
    <Search
      inline={inline}
      options={[
        { key: "NSE", value: "NSE" },
        { key: "BSE", value: "BSE" },
        { key: "US", value: "US" },
      ]}
      searchText={searchText}
      searchResults={searchResults}
      setSearchResults={setSearchResults}
      setSearchText={setSearchText}
      searchType={searchType}
      renderItem={(item: any) => {
        console.log(item);
        const { Code, Exchange, Name, Type } = item;
        return (
          <List.Item>
            <Link href={`${ROUTES.LOOKUP}/${Code}.${Exchange}`}>
              <a>
                {Name} <Tag color="green">{Type}</Tag>
              </a>
            </Link>
          </List.Item>
        );
      }}
      header={
        <Radio.Group value={searchType} onChange={onSearchTypeChange}>
          <Radio.Button value="stock">Stocks</Radio.Button>
          <Radio.Button value="etf">ETFs</Radio.Button>
          <Radio.Button value="bond">Bonds</Radio.Button>
          <Radio.Button value="fund">Mutual Funds</Radio.Button>
        </Radio.Group>
      }
    />
  );
}
