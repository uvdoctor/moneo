import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { ROUTES } from "../../CONSTANTS";
import { useContext } from "react";
import { List } from "antd";
import StatisticInput from "../form/StatisticInput";
import { useRouter } from "next/router";
import { MoreOutlined } from "@ant-design/icons";
import { toHumanFriendlyCurrency } from "../utils";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
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
  const [activeTabkey, setActiveTabkey] = useState("gainers");
  const [volumeDesc, setVolumeDesc] = useState<boolean>(true);
  const [movers, setMovers] = useState<any>([...volGainers, ...volLosers]);
  const yhighlow = [...yhigh, ...ylow];

  useEffect(() => {
    !volumeDesc
      ? setMovers([...movers].reverse())
      : setMovers([...volGainers, ...volLosers]);
  }, [volumeDesc]);

  useEffect(() => {
    if(movers.length) return;
    setMovers([...volGainers, ...volLosers]);
  }, [movers]);

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
          <Button
            icon={volumeDesc ? <CaretUpOutlined /> : <CaretDownOutlined />}
            onClick={() =>
              volumeDesc ? setVolumeDesc(false) : setVolumeDesc(true)
            }
          >
            Volume
          </Button>
        }
        itemLayout="horizontal"
        dataSource={movers}
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
