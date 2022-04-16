import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, List, notification, Row } from "antd";
import { Typography } from "antd";
import { TAB } from "../nw/NWContext";
import WatchlistRow from "./WatchlistView";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { InsWatchInput } from "../../api/goals";
import simpleStorage from "simplestorage.js";
import { filterTabs } from "../nw/nwutils";
import { DBContext } from "./DBContext";
import { LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import CheckableTag from "antd/lib/tag/CheckableTag";
import Search from "../Search";
require("./InvestmentAlerts.less");

export default function Watchlist() {
  const { watchlist, setWatchlist, saveHoldings }: any = useContext(DBContext);
  const { Title } = Typography;
  const { STOCK, MF, BOND, ETF, GOLDB, REIT, OIT } = TAB;
  const [activeTag, setActiveTag] = useState<string>(STOCK);
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("stock");
  const [filterByTab, setFilterByTab] = useState<Array<any>>([]);
  const [searchResults, setSearchResults] = useState([]);

  const hasOnlyIndiaIns = (tab: string) => [GOLDB, REIT, OIT].includes(tab);

  const getType = (searchType: string) => {
    if (searchType === "stock") return { type: "A", subt: "S", itype: null };
  };

  const tabList = [
    { key: STOCK, tab: STOCK, type: "stock" },
    { key: MF, tab: MF, type: "fund" },
    { key: BOND, tab: BOND, type: "bond" },
    { key: GOLDB, tab: GOLDB, type: GOLDB },
    { key: ETF, tab: ETF, type: "etf" },
    { key: REIT, tab: REIT, type: REIT },
    { key: OIT, tab: OIT, type: OIT },
  ];

  const getTabData = () => {
    if (!watchlist.length) return;
    let filteredData: Array<any> = watchlist.filter(
      (instrument: InsWatchInput) => {
        const id = instrument.id;
        const cachedData = simpleStorage.get(LOCAL_INS_DATA_KEY);
        if (!cachedData || !cachedData[id]) return;
        return filterTabs(cachedData[id], activeTag);
      }
    );
    console.log(filteredData);
    setFilterByTab([...filteredData]);
  };

  const onSelectInstruments = (resp: any) => {
    const { ISIN, Code, type, subt, itype, previousClose, Name } = resp;
    const data = {
      id: ISIN,
      sid: Code,
      type: type ? type : getType(searchType)?.type,
      subt: subt ? subt : getType(searchType)?.subt,
      itype: itype ? itype : null,
      price: previousClose,
      name: Name,
      ...resp,
    };
    const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    const mergedInsData = Object.assign({}, insData, { [data.id]: data });
    simpleStorage.set(LOCAL_INS_DATA_KEY, mergedInsData, LOCAL_DATA_TTL);
    if (!watchlist.some((item: InsWatchInput) => item.id === ISIN)) {
      const { id, sid, type, subt, itype } = data;
      watchlist.push({ id, sid, type, subt, itype });
    } else {
      notification.error({ message: `${Name} already exists` });
      return;
    }
    setSearchText(Name);
  };

  useEffect(() => {
    getTabData();
  }, [activeTag, watchlist]);

  useEffect(() => {
    const data = tabList.find((item: any) => item.key === activeTag);
    if (data) setSearchType(data.type);
  }, [activeTag]);

  return (
    <>
      <Title level={5}>Investment Watchlist</Title>
      <Card style={{ width: "100%", height: 600 }}>
        <>
          <p>
            {tabList.map((item: any) => (
              <CheckableTag
                key={item.key}
                checked={activeTag === item.key}
                style={{ fontSize: "15px" }}
                onChange={(checked: boolean) =>
                  checked ? setActiveTag(item.key) : null
                }>
                {item.key}
              </CheckableTag>
            ))}
          </p>

          <Row justify="center" gutter={[0, 10]} align="middle">
            <Col xs={24}>
              <Button
                key="save"
                style={{ float: "right" }}
                type="primary"
                icon={<SaveOutlined />}
                onClick={async () => await saveHoldings()}
                className="steps-start-btn">
                Save
              </Button>
            </Col>
            <Col span={24}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Search
                    options={
                      hasOnlyIndiaIns(searchType)
                        ? [{ key: "NSE", value: "INDIA" }]
                        : [
                            { key: "NSE", value: "INDIA" },
                            { key: "US", value: "US" },
                          ]
                    }
                    searchType={searchType}
                    searchResults={searchResults}
                    setSearchText={setSearchText}
                    searchText={searchText}
                    setSearchResults={setSearchResults}
                    renderItem={(resp: any) => {
                      return (
                        <List.Item>
                          <Typography.Link
                            onClick={() => onSelectInstruments(resp)}
                            style={{ marginRight: 8 }}>
                            {resp.Name}
                          </Typography.Link>
                        </List.Item>
                      );
                    }}
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setSearchText("");
                      setWatchlist([...watchlist]);
                    }}
                  />
                </Col>
              </Row>
            </Col>

            <Col xs={24}>
              <div
                id="scrollableDiv"
                style={{
                  height: 400,
                  overflow: "auto",
                }}>
                <List
                  itemLayout="horizontal"
                  dataSource={filterByTab}
                  renderItem={(item) => {
                    return <WatchlistRow record={item} />;
                  }}
                />
              </div>
            </Col>
          </Row>
        </>
      </Card>
    </>
  );
}
