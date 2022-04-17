import React, { useState } from "react";
import { Radio, List, Tag } from "antd";
import Link from "next/link";
import { ROUTES } from "../CONSTANTS";
import Search from "./Search";

interface SearchInputProps {
  inline?: boolean;
}

export default function SearchInput({ inline }: SearchInputProps) {
  const [searchType, setSearchType] = useState("stock");
  const onSearchTypeChange = ({ target: { value } }: any) => {
    setSearchType(value);
  };

  return (
    <Search
      inline={inline}
      searchType={searchType}
      renderItem={(item: any) => {
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
