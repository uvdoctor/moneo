import React, { useState } from "react";
import { Button, Card } from "antd";
import { ROUTES } from "../../CONSTANTS";
import { useContext } from "react";
import { List } from "antd";
import StatisticInput from "../form/StatisticInput";
import { useRouter } from "next/router";
import { MoreOutlined } from "@ant-design/icons";
import { toHumanFriendlyCurrency } from "../utils";
import { AppContext } from "../AppContext";
import RadioInput from "../form/RadioInput";
require("./InvestmentAlerts.less");
interface InvestmentAlertsProps {
  gainers: Array<any>;
  losers: Array<any>;
  yhigh: Array<any>;
  ylow: Array<any>;
  volGainers: Array<any>;
  volLosers: Array<any>;
}

export default function InvestmentAlerts({
  gainers,
  losers,
  yhigh,
  ylow,
  volGainers,
  volLosers,
}: InvestmentAlertsProps) {
  const router = useRouter();
  const { defaultCurrency }: any = useContext(AppContext);
  const [activeTabkey, setActiveTabkey] = useState<string>("gainers");
  const [isGainers, setIsGainers] = useState<boolean>(true);
  const [isWeekhigh, setIsWeekhigh] = useState<boolean>(true);

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
        header={
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadioInput
              options={["Week High", "Week Low"]}
              value={isWeekhigh ? "Week High" : "Week Low"}
              changeHandler={(value: string) =>
                value === "Week High"
                  ? setIsWeekhigh(true)
                  : setIsWeekhigh(false)
              }
            />
          </div>
        }
        itemLayout="horizontal"
        dataSource={isWeekhigh ? yhigh : ylow}
        renderItem={(item: any) => (
          <List.Item>
            <StatisticInput
              value={item.yhigh ? item.yhigh : item.ylow}
              title={item.name}
              price={item.price}
              isNotPercentage
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
              negative
            />
          </List.Item>
        )}
      />
    ),
    movers: (
      <List
        header={
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadioInput
              options={["Volume Gainers", "Volume Losers"]}
              value={isGainers ? "Volume Gainers" : "Volume Losers"}
              changeHandler={(value: string) =>
                value === "Volume Losers"
                  ? setIsGainers(false)
                  : setIsGainers(true)
              }
            />
          </div>
        }
        itemLayout="horizontal"
        dataSource={isGainers ? volGainers : volLosers}
        renderItem={(item: any) => (
          <List.Item>
            <StatisticInput
              value={item.volDiff}
              title={item.name}
              price={item.vol}
              negative={Math.sign(item.volDiff) > 0 ? false : true}
              isVolume
            />
            <div
              style={{
                color: Math.sign(item.volDiff) > 0 ? "#3f8600" : "#cf1322",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {toHumanFriendlyCurrency(item.price, defaultCurrency)}
            </div>
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
