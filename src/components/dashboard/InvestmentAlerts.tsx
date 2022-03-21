import React, { useState } from "react";
import { Card } from "antd";
import { ROUTES } from "../../CONSTANTS";
import { useContext } from "react";
import { DBContext } from "./DBContext";
import { List } from "antd";
import StatisticInput from "../form/StatisticInput";
require("./InvestmentAlerts.less");

const tabList = [
  {
    key: "yhigh",
    tab: "Week High",
  },
  {
    key: "ylow",
    tab: "Week Low",
  },
  {
    key: "gainers",
    tab: "Gainers",
  },
  {
    key: "losers",
    tab: "Losers",
  },
];

export default function InvestmentAlerts() {
  const { gainers, losers, yhigh, ylow }: any = useContext(DBContext);
  const [activeTabkey, setActiveTabkey] = useState("yhigh");

  const contentList: { [key: string]: any } = {
    yhigh: (
      <List
        itemLayout="horizontal"
        dataSource={yhigh}
        renderItem={(item: any) => (
          <List.Item>
            <StatisticInput value={item.yhigh} title={item.name} />
          </List.Item>
        )}
      />
    ),
    ylow: (
      <List
        itemLayout="horizontal"
        dataSource={ylow}
        renderItem={(item: any) => (
          <List.Item>
            <StatisticInput value={item.yhigh} title={item.name} negative />
          </List.Item>
        )}
      />
    ),
    gainers: (
      <List
        itemLayout="horizontal"
        dataSource={gainers}
        renderItem={(item: any) => (
          <List.Item>
            <StatisticInput value={item.diff} title={item.name} />
          </List.Item>
        )}
      />
    ),
    losers: (
      <List
        itemLayout="horizontal"
        dataSource={losers}
        renderItem={(item: any) => (
          <List.Item>
            <StatisticInput value={item.diff} title={item.name} negative />
          </List.Item>
        )}
      />
    ),
  };

  const onTabChange = (key: string) => {
    setActiveTabkey(key);
  };

  return (
    <Card
      id="alerts"
      style={{ width: "100%" }}
      title={
        <strong style={{ fontSize: "20px" }}>
          End of the day Investment Details
        </strong>
      }
      extra={<a href={ROUTES.GET}>More Details</a>}
      tabList={tabList}
      activeTabKey={activeTabkey}
      onTabChange={(key) => {
        onTabChange(key);
      }}
    >
      {contentList[activeTabkey]}
    </Card>
  );
}
