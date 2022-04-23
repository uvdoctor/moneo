import React, { useContext, useEffect, useState } from "react";
import { Button, Col, List, notification, Row } from "antd";
import { Typography } from "antd";
import { TAB } from "../nw/NWContext";
import WatchlistRow from "./WatchlistView";
import { SaveOutlined, PlusOutlined } from "@ant-design/icons";
import { AssetSubType, AssetType, InsWatchInput } from "../../api/goals";
import simpleStorage from "simplestorage.js";
import { filterTabs, getCryptoRate } from "../nw/nwutils";
import { DBContext, NIFTY50, SENSEX } from "./DBContext";
import { LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import Search from "../Search";
import CardView from "./CardView";
import { AppContext } from "../AppContext";
import { isISIN } from "../nw/valuationutils";
require("./InvestmentAlerts.less");

export default function Watchlist() {
  const { defaultCurrency }: any = useContext(AppContext);
  const { watchlist, setWatchlist, saveHoldings, fxRates }: any =
    useContext(DBContext);
  const { STOCK, MF, BOND, ETF, GOLDB, REIT, OIT, CRYPTO } = TAB;
  const [activeTag, setActiveTag] = useState<string>(STOCK);
  const [searchType, setSearchType] = useState("index");
  const [filterByTab, setFilterByTab] = useState<Array<any>>([]);

  const typesList = {
    Index: "index",
    [STOCK]: "stock",
    [MF]: "fund",
    [BOND]: "bond",
    [GOLDB]: GOLDB,
    [ETF]: "etf",
    [REIT]: REIT,
    [OIT]: OIT,
    [CRYPTO]: CRYPTO,
  };

  const loadData = () => {
    if (!watchlist.length) return;
    let filteredData: Array<any> = watchlist.filter(
      (instrument: InsWatchInput) => {
        const { id, subt } = instrument;
        if (activeTag === CRYPTO && subt === AssetSubType.C) return true;
        if (activeTag === "Index" && !isISIN(id) && subt !== AssetSubType.C)
          return true;
        const cachedData = simpleStorage.get(LOCAL_INS_DATA_KEY);
        if (!cachedData || !cachedData[id] || !isISIN(id)) return;
        return filterTabs(cachedData[id], activeTag);
      }
    );
    setFilterByTab([...filteredData]);
  };

  const onSelectInstruments = async (resp: any) => {
    const { ISIN, Code, type, subt, itype, previousClose, Name } = resp;
    let data: any = {};
    if (searchType === CRYPTO) {
      const price = await getCryptoRate(ISIN, defaultCurrency, fxRates);
      const prev = await getCryptoRate(ISIN, defaultCurrency, fxRates, true);
      data = {
        id: ISIN,
        sid: Code,
        type: AssetType.A,
        subt: AssetSubType.C,
        prev,
        price,
        name: Name,
      };
    } else {
      data = {
        id: ISIN ? ISIN : Code,
        sid: Code,
        type: type,
        subt: subt,
        itype: itype,
        price: previousClose,
        name: Name,
        ...resp,
      };
      const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
      const mergedInsData = Object.assign({}, insData, { [data.id]: data });
      simpleStorage.set(LOCAL_INS_DATA_KEY, mergedInsData, LOCAL_DATA_TTL);
    }
    if (!watchlist.some((item: InsWatchInput) => item.id === data.id)) {
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

  const addDefaultWatchlist = () => {
    const cachedData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    if (!cachedData) return;
    const defaultList = [SENSEX, NIFTY50];
    for (let item of defaultList) {
      if (!cachedData[item]) return;
      const data = cachedData[item];
      const { id, subt, type } = data;
      watchlist.push({ id, type, subt });
    }
    setWatchlist([...watchlist]);
    setActiveTag("Index");
  };

  useEffect(() => {
    loadData();
  }, [activeTag, watchlist]);

  useEffect(() => setSearchType(typesList[activeTag]), [activeTag]);

  return (
    <CardView
      title="Investment Watchlist"
      activeTag={watchlist.length ? activeTag : ""}
      activeTagHandler={watchlist.length ? setActiveTag : () => {}}
      tags={watchlist.length ? Object.keys(typesList) : []}
    >
      {watchlist.length ? (
        <Row justify="center" gutter={[0, 10]} align="middle">
          <Col xs={24}>
            <Button
              key="save"
              style={{ float: "right" }}
              type="primary"
              icon={<SaveOutlined />}
              onClick={async () => await saveHoldings()}
              className="steps-start-btn"
            >
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
                      onClick={async () => await onSelectInstruments(resp)}
                      style={{ marginRight: 8 }}
                    >
                      {resp.Name}{" "}
                      <Button
                        icon={<PlusOutlined />}
                        type="link"
                        shape="circle"
                      />
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
              }}
            >
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
      ) : (
        <div style={{ textAlign: "center" }}>
          <p>&nbsp;</p>
          <h3>Please input data for your watchlist.</h3>
          {/* <h3>More data you provide, better the analysis!</h3> */}
          <p>&nbsp;</p>
          <Button type="primary" onClick={() => addDefaultWatchlist()}>
            Get Started
          </Button>
          <p>&nbsp;</p>
        </div>
      )}
    </CardView>
  );
}
