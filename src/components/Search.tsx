import React, { useState } from "react";
import { Input, Dropdown, Radio, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { ROUTES } from "../CONSTANTS";

interface SearchProps {
  inline?: boolean;
}

export default function Search({ inline }: SearchProps) {
  const [searchResults, setSearchResults] = useState([
    {
      Code: "SBIN",
      Name: "State Bank of India",
      Type: "Common Stock",
      Country: "India",
      Currency: "INR",
      ISIN: "INE062A01020",
      previousClose: 529.6,
      previousCloseDate: "2022-02-11",
    },
  ]);
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
    if (value.length < 3) return;
    if (searchTimeout) clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      getSearchData(value);
    }, 200);
  };
  const getSearchData = async (text: string) => {
    try {
      const response = await fetch(`/api/search?text=${text}`);
      const data = await response.json();

      setSearchResults(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Comp
      style={{ width: "600px" }}
      overlay={
        <>
          <List
            size="small"
            header={
              <Radio.Group value="stocks" onChange={() => {}}>
                <Radio.Button value="stocks">Stocks</Radio.Button>
                <Radio.Button value="etfs">ETFs</Radio.Button>
                <Radio.Button value="bonds">Bonds</Radio.Button>
                <Radio.Button value="mfs">Mutual Funds</Radio.Button>
              </Radio.Group>
            }
            bordered
            dataSource={searchResults}
            renderItem={({ Code, Name }) => (
              <List.Item>
                <Link href={`${ROUTES.LOOKUP}/${Code}`}>
                  <a>{Name}</a>
                </Link>
              </List.Item>
            )}
          />
        </>
      }
      arrow>
      <Input
        size="large"
        placeholder="Search stocks, bonds and MF's"
        prefix={<SearchOutlined />}
        onChange={onSearch}
      />
    </Comp>
  );
}
