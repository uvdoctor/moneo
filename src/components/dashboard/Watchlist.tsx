import React, { useContext, useEffect, useState } from "react";
import { Button, Col, List, notification, Row } from "antd";
import { TAB } from "../nw/NWContext";
import WatchlistRow from "./WatchlistView";
import { SaveOutlined } from "@ant-design/icons";
import { AssetSubType, AssetType, InsWatchInput } from "../../api/goals";
import simpleStorage from "simplestorage.js";
import { filterTabs, getCryptoRate } from "../nw/nwutils";
import { DBContext } from "./DBContext";
import { LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import Search from "../Search";
import CardView from "./CardView";
import { AppContext } from "../AppContext";
import { isISIN } from "../nw/valuationutils";

export default function Watchlist() {
  const { defaultCurrency }: any = useContext(AppContext);
  const { watchlist, setWatchlist, saveHoldings, fxRates }: any = useContext(DBContext);
  const { STOCK, MF, ETF, REIT, OIT, CRYPTO } = TAB;
  const [activeTag, setActiveTag] = useState<string>("Index");
  const [filterByTab, setFilterByTab] = useState<Array<any>>([]);

  const typesList = ["Index", STOCK, MF, ETF, REIT, OIT, CRYPTO];

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
    const { id, name } = resp;
    let data: any = {};
    if (activeTag === CRYPTO) {
      const price = await getCryptoRate(id, defaultCurrency, fxRates);
      const prev = await getCryptoRate(id, defaultCurrency, fxRates, true);
      data = {
        id,
        sid: id,
        type: AssetType.A,
        subt: AssetSubType.C,
        prev,
        price,
        name,
      };
    } else {
      data = resp;
      const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
      const mergedInsData = Object.assign({}, insData, { [id]: data });
      simpleStorage.set(LOCAL_INS_DATA_KEY, mergedInsData, LOCAL_DATA_TTL);
    }
    if (!watchlist.some((item: InsWatchInput) => item.id === data.id)) {
      const { id, sid, type, subt, itype } = data;
      watchlist.push({ id, sid, type, subt, itype });
    } else {
      notification.error({
        message: `${name} already exists in the watchlist`,
      });
      return;
    }
    setWatchlist([...watchlist]);
    notification.success({ message: `${name} - Added to Watchlist` });
  };

  useEffect(() => {
    loadData();
  }, [activeTag, watchlist]);

  return (
    <CardView
      title="Investment Watchlist"
      activeTag={activeTag}
      activeTagHandler={setActiveTag}
      tags={typesList}
    >
      <Row justify="center" gutter={[0, 10]} align="middle">
        <Col span={24}>
          <Row align="middle" justify="space-between">
            <Col>
              <Search searchType={activeTag} onClick={(resp: any) => onSelectInstruments(resp)} />
            </Col>
            <Col>
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
          </Row>
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
    </CardView>
  );
}
