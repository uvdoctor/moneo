import React, {  useState } from "react";
import { Button, Card } from "antd";
import { ROUTES } from "../../CONSTANTS";
import { useContext } from "react";
import { DBContext } from "./DBContext";
import { List } from "antd";
import StatisticInput from "../form/StatisticInput";
import { useRouter } from "next/router";
import { MoreOutlined } from "@ant-design/icons";
require("./InvestmentAlerts.less");

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
    key: "yhigh",
    tab: "Recent 52 Week High",
  },
  {
    key: "ylow",
    tab: "Recent 52 Week Low",
  }
];

export default function InvestmentAlerts() {
  const { gainers, losers, yhigh, ylow }: any = useContext(DBContext);
  const [activeTabkey, setActiveTabkey] = useState("yhigh");
  const router = useRouter();

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
          Recent Investment Updates
        </strong>
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
