import React, { useState } from "react";
import { Button, Card, Row } from "antd";
import { ROUTES } from "../../CONSTANTS";
import { useRouter } from "next/router";
import { Typography } from "antd";
import InvestmentAlertList from "./InvestmentAlertList";
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
  const [activeTabkey, setActiveTabkey] = useState<string>("Price");

  const tabList = [
    {
      key: "Price",
      tab: "Price",
    },
    {
      key: "Volume",
      tab: "Volume",
    },
    {
      key: "52-weeks",
      tab: "52-weeks",
    },
  ];

  const contentList: any = {
    ["52-weeks"]: (
      <InvestmentAlertList
        positiveViewLabel="High"
        negativeViewLabel="Low"
        footerLabel="Price"
        isPrice
        positives={yhigh}
        negatives={ylow}
      />
    ),
    Price: (
      <InvestmentAlertList
        positiveViewLabel="Gainers"
        negativeViewLabel="Losers"
        footerLabel="Price"
        positives={gainers}
        negatives={losers}
      />
    ),
    Volume: (
      <InvestmentAlertList
        positiveViewLabel="Gainers"
        negativeViewLabel="Losers"
        footerLabel="Volume"
        positives={volGainers}
        negatives={volLosers}
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
        style={{ width: "100%", height: 600 }}
        tabList={tabList}
        activeTabKey={activeTabkey}
        onTabChange={(key) => onTabChange(key)}>
        {contentList[activeTabkey]}
        <Row justify="center">
          <Button
            key="more"
            type="primary"
            href={`${ROUTES.GET}?show=fin`}
            onClick={(e: any) => {
              e.preventDefault();
              router.push(`${ROUTES.GET}?show=fin`);
            }}>
            More Details
          </Button>
        </Row>
      </Card>
    </>
  );
}
