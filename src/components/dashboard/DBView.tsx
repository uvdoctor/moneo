import React, { Fragment, useContext } from "react";
import { Col, PageHeader, Row, Skeleton } from "antd";
import { AppContext } from "../AppContext";
import { DBContext } from "./DBContext";
import StockMarket from "./StockMarket";
import InvestmentAlerts from "./InvestmentAlerts";
import Watchlist from "./Watchlist";
import GetResult from "./GetResult";
import ResultCarousel from "../ResultCarousel";
import SetResult from "./SetResult";
import EconomicCalendar from "./EconomicCalendar";

require("./DBView.less");

export default function DBView() {
  const { gainers, losers, yhigh, ylow, volLosers, volGainers, headerData }: any =
    useContext(DBContext);
  const { appContextLoaded }: any = useContext(AppContext);
  const { gold, silver, nifty, sensex, usd, petrol, diesel } = headerData;

  return appContextLoaded ? (
    <Fragment>
      <div className="primary-header">
        <Row>
          <Col span={24}>
            <PageHeader title="Dashboard" />
          </Col>
          <Col span={24} className="secondary-header">
            <Row justify="space-between" align="middle">
              <Col>Gold: {gold}</Col>
              <Col>Silver: {silver}</Col>
              <Col>Sensex: {sensex}</Col>
              <Col>Nifty 50: {nifty}</Col>
              <Col>Petrol: {petrol}</Col>
              <Col>Diesel: {diesel}</Col>
              <Col>USD: {usd}</Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="db-container">
        <Fragment>
          <Row justify="space-around" gutter={[30, 50]}>
            <ResultCarousel
              results={[<GetResult key="getr" />, <SetResult key="setr" />]}
            />
          </Row>
          <Row justify="space-around">
            <Col xs={24} sm={24} md={10} style={{ marginBottom: "10px" }}>
              <InvestmentAlerts
                gainers={gainers}
                losers={losers}
                yhigh={yhigh}
                ylow={ylow}
                volGainers={volGainers}
                volLosers={volLosers}
              />
            </Col>
            <Col xs={24} sm={24} md={10} style={{ marginBottom: "10px" }}>
              <Watchlist />
            </Col>
            <Col xs={24} sm={24} md={10} style={{ marginBottom: "10px" }}>
              <StockMarket />
            </Col>
            <Col xs={24} sm={24} md={10} style={{ marginBottom: "10px" }}>
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
