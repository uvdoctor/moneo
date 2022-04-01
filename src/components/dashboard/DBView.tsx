import React, { Fragment, useContext } from "react";
import { Col, PageHeader, Row, Skeleton } from "antd";
import ItemDisplay from "../calc/ItemDisplay";
import { AppContext } from "../AppContext";
import { DBContext } from "./DBContext";
import { ROUTES } from "../../CONSTANTS";
import EconomicCalendar from "./EconomicCalendar";
import StockMarket from "./StockMarket";
import MarketOverview from "./MarketOverview";
import InvestmentAlerts from "./InvestmentAlerts";
import Link from "next/link";

require("./DBView.less");

export default function DBView() {
  const {
    totalAssets,
    totalLiabilities,
    gainers,
    losers,
    yhigh,
    ylow,
    volLosers,
    volGainers,
  }: any = useContext(DBContext);
  const { appContextLoaded, defaultCurrency }: any = useContext(AppContext);

  return appContextLoaded ? (
    <Fragment>
      <div className="primary-header">
        <Row>
          <Col span={24}>
            <PageHeader title="Dashboard" />
          </Col>
        </Row>
      </div>
      <div className="db-container">
        <Fragment>
          <Row justify="center" gutter={[30, 16]}>
            <Col xs={24} sm={24} md={18}>
              <Row gutter={[50, 30]}>
                <Col xs={24}>
                  <div className="dd-stat">
                    <Row gutter={[10, 10]}>
                      <Col span={24}>
                        <ItemDisplay
                          label="Net Worth"
                          result={totalAssets - totalLiabilities}
                          currency={defaultCurrency}
                          pl
                          info={
                            "Net Worth equals what you own minus what you owe."
                          }
                        />
                        {!(totalAssets - totalLiabilities) ? (
                          <a href={ROUTES.GET}>Discover your networth</a>
                        ) : null}
                      </Col>
                      {totalAssets || totalLiabilities ? (
                        <Col xs={12}>
                          <ItemDisplay
                            label="You Own"
                            result={totalAssets}
                            currency={defaultCurrency}
                            info="This is the total valuation of the assets you own."
                          />
                        </Col>
                      ) : null}
                      {totalAssets || totalLiabilities ? (
                        <Col xs={12}>
                          <ItemDisplay
                            label="You Owe"
                            result={-totalLiabilities}
                            currency={defaultCurrency}
                            info="This is the total valuation of all the money you owe."
                            pl
                          />
                        </Col>
                      ) : null}
                    </Row>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <InvestmentAlerts
                    gainers={gainers}
                    losers={losers}
                    yhigh={yhigh}
                    ylow={ylow}
                    volGainers={volGainers}
                    volLosers={volLosers}
                  />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <StockMarket />
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <MarketOverview />
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={6}>
              <EconomicCalendar />
            </Col>
          </Row>
        </Fragment>
      </div>
    </Fragment>
  ) : (
    <Skeleton active />
  );
}
