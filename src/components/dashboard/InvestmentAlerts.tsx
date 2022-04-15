import React, { useState } from "react";
import { Button, Card, Row, Tag } from "antd";
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
  const { CheckableTag } = Tag;
  const PRICE_TAG = "Price";
  const VOLUME_TAG = "Volume";
  const HIGH_LOW_TAG = "52-weeks";
  const [activeTag, setActiveTag] = useState<string>(PRICE_TAG);

  const contentList: any = {
    [PRICE_TAG]: (
      <InvestmentAlertList
        positiveViewLabel="Gainers"
        negativeViewLabel="Losers"
        footerLabel="Price"
        positives={gainers}
        negatives={losers}
        isFooterPrice
      />
    ),
    [VOLUME_TAG]: (
      <InvestmentAlertList
        positiveViewLabel="Gainers"
        negativeViewLabel="Losers"
        footerLabel="Volume"
        positives={volGainers}
        negatives={volLosers}
      />
    ),
    [HIGH_LOW_TAG]: (
      <InvestmentAlertList
        positiveViewLabel="High"
        negativeViewLabel="Low"
        footerLabel="Price"
        isPrice
        isFooterPrice
        positives={yhigh}
        negatives={ylow}
      />
    ),
  };

  return (
    <>
      <Title level={5}>Investment Updates</Title>
      <Card style={{ width: "100%", height: 600 }}>
        <>
          <p>
            {Object.keys(contentList).map((key: string) => (
              <CheckableTag
                key={key}
                checked={activeTag === key}
                style={{ fontSize: "15px" }}
                onChange={(checked: boolean) =>
                  checked ? setActiveTag(key) : null
                }>
                {key}
              </CheckableTag>
            ))}
          </p>
          {contentList[activeTag]}
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
        </>
      </Card>
    </>
  );
}
