import React, { useContext, useState } from "react";
import { Button, Card, Divider, Row } from "antd";
import { ROUTES } from "../../CONSTANTS";
import { List } from "antd";
import { useRouter } from "next/router";
import RadioInput from "../form/RadioInput";
import { Typography } from "antd";
import ItemDisplay from "../calc/ItemDisplay";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
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
  const { defaultCurrency }: any = useContext(AppContext);
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
          <>
          <ItemDisplay
            label={item.name}
            result={item.yhigh ? item.yhigh : item.ylow}
            pl
            footer={`Price - ${toHumanFriendlyCurrency(item.price, defaultCurrency)}`}
          />
          <Divider />
        </>
        )}
      />
    ),
    gainers: (
      <List
        itemLayout="horizontal"
        dataSource={gainers}
        renderItem={(item: any) => (
          <>
            <ItemDisplay
              label={item.name}
              result={item.diff}
              pl
              unit="%"
              footer={`Price - ${toHumanFriendlyCurrency(item.price, defaultCurrency)}`}
            />
            <Divider />
          </>
        )}
      />
    ),
    losers: (
      <List
        itemLayout="horizontal"
        dataSource={losers}
        renderItem={(item: any) => (
          <>
            <ItemDisplay
              label={item.name}
              result={item.diff}
              pl
              unit="%"
              footer={`Price - ${toHumanFriendlyCurrency(item.price, defaultCurrency)}`}
            />
            <Divider />
          </>
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
              pl
              unit="%"
              footer={`Volume - ${toReadableNumber(item.vol)}`}
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
