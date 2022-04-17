import React, { useContext, useEffect, useState } from "react";
import { Button, Col, List, notification, Row } from "antd";
import { Typography } from "antd";
import { TAB } from "../nw/NWContext";
import WatchlistRow from "./WatchlistView";
import { SaveOutlined } from "@ant-design/icons";
import { InsWatchInput } from "../../api/goals";
import simpleStorage from "simplestorage.js";
import { filterTabs } from "../nw/nwutils";
import { DBContext } from "./DBContext";
import { LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import Search from "../Search";
import CardView from "./CardView";
require("./InvestmentAlerts.less");

export default function Watchlist() {
  const { watchlist, setWatchlist, saveHoldings }: any = useContext(DBContext);
  const { STOCK, MF, BOND, ETF, GOLDB, REIT, OIT } = TAB;
  const [activeTag, setActiveTag] = useState<string>(STOCK);
  const [searchType, setSearchType] = useState("stock");
  const [filterByTab, setFilterByTab] = useState<Array<any>>([]);

  const getType = (searchType: string) => {
    if (searchType === "stock") return { type: "A", subt: "S", itype: null };
  };

  const typesList = {
    [STOCK]: "stock",
    [MF]: "fund",
    [BOND]: "bond",
    [GOLDB]: GOLDB,
    [ETF]: "etf",
    [REIT]: REIT,
    [OIT]: OIT,
  };

  const loadData = () => {
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
      notification.error({
        message: `${Name} already exists in the watchlist`,
      });
      return;
    }
    setWatchlist([...watchlist]);
    notification.success({ message: `${Name} - Added to Watchlist` });
  };

  useEffect(() => {
    loadData();
  }, [activeTag, watchlist]);

  useEffect(() => setSearchType(typesList[activeTag]), [activeTag]);

  return (
    <CardView
      title="Investment Watchlist"
      activeTag={activeTag}
      activeTagHandler={setActiveTag}
      tags={Object.keys(typesList)}>
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
          <Search
            searchType={searchType}
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

        <Col xs={24}>
          <div
            id="scrollableDiv"
            style={{
              height: 350,
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
    </CardView>
  );
}
