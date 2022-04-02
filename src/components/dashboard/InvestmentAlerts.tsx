import React, { useState } from "react";
import { Button, Card, Divider, Row } from "antd";
import { ROUTES } from "../../CONSTANTS";
import { List } from "antd";
import StatisticInput from "../form/StatisticInput";
import { useRouter } from "next/router";
import RadioInput from "../form/RadioInput";
import { Typography } from "antd";
import ItemDisplay from "../calc/ItemDisplay";
import { toReadableNumber } from "../utils";
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
  const { Title } = Typography;
  const router = useRouter();
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
      tab: "52 Week",
    },
  ];

  const contentList: { [key: string]: any } = {
    yhighlow: (
      <List
        header={
          <div style={{ display: "flex", justifyContent: "center" }}>
            <RadioInput
              options={["High", "Low"]}
              value={isWeekhigh ? "High" : "Low"}
              changeHandler={(value: string) => setIsWeekhigh(value === "High")}
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
              options={["High", "Low"]}
              value={isGainers ? "High" : "Low"}
              changeHandler={(value: string) => setIsGainers(value === "High")}
            />
          </div>
        }
        itemLayout="horizontal"
        dataSource={isGainers ? volGainers : volLosers}
        renderItem={(item: any) => (
          <>
            <ItemDisplay
              label={item.name}
              result={item.volDiff}
              labelHighlight
              pl
              unit="%"
              footer={`Volume is ${toReadableNumber(item.vol)}`}
            />
            <Divider />
          </>
        )}
      />
    ),
  };

  const onTabChange = (key: string) => {
    setActiveTabkey(key);
  };

  return (
    <>
      <Title level={5}>Investment Updates</Title>
      <Card
        id="alerts"
        style={{ width: "100%", height: 600 }}
        tabList={tabList}
        activeTabKey={activeTabkey}
        onTabChange={(key) => {
          onTabChange(key);
        }}>
        {contentList[activeTabkey]}
        <Row justify="center">
          <Button
            key="more"
            type="primary"
            href={ROUTES.GET}
            onClick={(e: any) => {
              e.preventDefault();
              router.push(ROUTES.GET);
            }}>
            More Details
          </Button>
        </Row>
      </Card>
    </>
  );
}
