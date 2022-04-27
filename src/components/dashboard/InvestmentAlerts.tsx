import React, { useContext, useState } from "react";
import { Button, Row } from "antd";
import { ROUTES } from "../../CONSTANTS";
import { useRouter } from "next/router";
import InvestmentAlertList from "./InvestmentAlertList";
import CardView from "./CardView";
import { DBContext } from "./DBContext";
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
  const PRICE_TAG = "Price";
  const VOLUME_TAG = "Volume";
  const HIGH_LOW_TAG = "52-weeks";
  const [activeTag, setActiveTag] = useState<string>(PRICE_TAG);
  const { instruments }: any = useContext(DBContext);

  const contentList: any = {
    [PRICE_TAG]: (
      <InvestmentAlertList
        positiveViewLabel="Gainers"
        negativeViewLabel="Losers"
        footerLabel="price"
        positives={gainers}
        negatives={losers}
        isFooterPrice
      />
    ),
    [VOLUME_TAG]: (
      <InvestmentAlertList
        positiveViewLabel="Gainers"
        negativeViewLabel="Losers"
        footerLabel="volume"
        positives={volGainers}
        negatives={volLosers}
      />
    ),
    [HIGH_LOW_TAG]: (
      <InvestmentAlertList
        positiveViewLabel="High"
        negativeViewLabel="Low"
        footerLabel="price"
        isPrice
        isFooterPrice
        positives={yhigh}
        negatives={ylow}
      />
    ),
  };

  return (
    <CardView
      title="Investment Updates"
      tags={Object.keys(contentList)}
      activeTag={activeTag}
      activeTagHandler={setActiveTag}>
      <>
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
            {instruments?.length
              ? "More Details"
              : "Input investments for daily updates"}
          </Button>
        </Row>
      </>
    </CardView>
  );
}
