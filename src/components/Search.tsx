import React, { useState, useEffect } from "react";
import { Input, Dropdown, List, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchProps {
  inline?: boolean;
  options: any;
  searchText: string;
  searchResults: any;
  setSearchResults: Function;
  setSearchText: Function;
  header?: any;
  searchType: string;
  renderItem: any;
}

export default function Search({
  inline,
  options,
  searchText,
  searchResults,
  setSearchResults,
  setSearchText,
  header,
  searchType,
  renderItem,
}: SearchProps) {
  const { Option } = Select;
  const [exchange, setExchange] = useState("NSE");
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
  const getSearchData = async () => {
    try {
      const response = await fetch(
        `/api/search?text=${searchText}&type=${searchType}&exchange=${exchange}`
      );
      const data = await response.json();
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
        <>
          <List
            size="small"
            header={header && header}
            bordered
            dataSource={searchResults}
            renderItem={(item: any) => renderItem(item)}
          />
        </>
      }
      arrow
    >
      <Input
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
