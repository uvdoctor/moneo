import React, { useState } from "react";
import { Button, Card } from "antd";
import { ROUTES } from "../../CONSTANTS";
import { useContext } from "react";
import { DBContext } from "./DBContext";
import { List } from "antd";
import StatisticInput from "../form/StatisticInput";
import { useRouter } from "next/router";
import { MoreOutlined } from "@ant-design/icons";
require("./InvestmentAlerts.less");

export default function InvestmentAlerts() {
  const { gainers, losers, yhigh, ylow, volGainers, volLosers }: any =
    useContext(DBContext);
  const [activeTabkey, setActiveTabkey] = useState("yhigh");
  const router = useRouter();
  const yhighlow = [...yhigh, ...ylow];
  const movers = [...volGainers, ...volLosers];

  const tabList = [
    {
      key: "gainers",
      tab: "Gainers",
    },
    {
      key: "losers",
      tab: "Losers",
    },
    {
      key: "movers",
      tab: "Movers",
    },
    {
      key: "yhighlow",
      tab: "Recent 52 Week High/Low",
    },
  ];

  const contentList: { [key: string]: any } = {
    yhighlow: (
      <List
        itemLayout="horizontal"
        dataSource={yhighlow}
        renderItem={(item: any) => (
          <List.Item>
            <StatisticInput
              value={item.yhigh ? item.yhigh : item.ylow}
              title={item.name}
              price={item.price}
              isValPercent={false}
              negative={item.yhigh ? false : item.ylow ? true : false}
            />
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
            <StatisticInput
              value={item.diff}
              title={item.name}
              price={item.price}
              negative={false}
              isValPercent
            />
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
            <StatisticInput
              value={item.diff}
              title={item.name}
              price={item.price}
              isValPercent
              negative
            />
          </List.Item>
        )}
      />
    ),
    movers: (
      <List
        itemLayout="horizontal"
        dataSource={movers}
        renderItem={(item: any) => (
          <List.Item>
            <StatisticInput
              value={item.vol}
              title={item.name}
              price={item.price}
              negative={Math.sign(item.volDiff) > 0 ? false : true}
              isValPercent={false}
            />
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
        <strong style={{ fontSize: "20px" }}>Recent Investment Updates</strong>
      }
      tabList={tabList}
      activeTabKey={activeTabkey}
      onTabChange={(key) => {
        onTabChange(key);
      }}
      tabProps={{ type: "card" }}
    >
      {contentList[activeTabkey]}
      <Button
        style={{ float: "right" }}
        key="more"
        type="primary"
        href={ROUTES.GET}
        icon={<MoreOutlined />}
        onClick={(e: any) => {
          e.preventDefault();
          router.push(ROUTES.GET);
        }}
        className="steps-start-btn"
      >
        More Details
      </Button>
    </Card>
  );
}
