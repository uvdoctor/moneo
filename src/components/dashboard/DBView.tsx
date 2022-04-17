import React, { Fragment, useContext } from "react";
import { Col, PageHeader, Row, Skeleton } from "antd";
import { AppContext } from "../AppContext";
import { DBContext } from "./DBContext";
import StockMarket from "./StockMarket";
import MarketOverview from "./MarketOverview";
import InvestmentAlerts from "./InvestmentAlerts";
import Watchlist from "./Watchlist";
import GetResult from "./GetResult";
import ResultCarousel from "../ResultCarousel";
import SetResult from "./SetResult";

require("./DBView.less");

export default function DBView() {
  const { gainers, losers, yhigh, ylow, volLosers, volGainers }: any =
    useContext(DBContext);
  const { appContextLoaded }: any = useContext(AppContext);

  return appContextLoaded ? (
    <Fragment>
      <div className="primary-header">
        <Row>
          <Col span={24}>
            <PageHeader title="Dashboard" />
          </Col>
          <Col span={24} className="secondary-header">
            <Row justify="space-between" align="middle">
              <Col>Gold: 55,000</Col>
              <Col>Silver: 24,000</Col>
              <Col>Petrol: 110</Col>
              <Col>Diesel: 90</Col>
              <Col>Sensex: 58,338</Col>
              <Col>Nifty 50: 17,289.3</Col>
              <Col>USD: 76.5</Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="db-container">
        <Fragment>
          <Row justify="center" gutter={[30, 16]}>
            <Col xs={24} sm={24} md={18}>
              <Row gutter={[50, 30]}>
                <Col xs={24}>
                  <ResultCarousel
                    results={[
                      <GetResult key="getr" />,
                      <SetResult key="setr" />,
                    ]}
                  />
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
              <Watchlist />
            </Col>
          </Row>
        </Fragment>
      </div>
    </Fragment>
  ) : (
    <Skeleton active />
  );
}
