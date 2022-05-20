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
import InsPrice from "../nw/InsPrice";
import AAList from "./AAList";
import CoachingRequest from "../CoachingRequest";

require("./DBView.less");

export default function DBView() {
  const {
    gainers,
    losers,
    yhigh,
    ylow,
    volLosers,
    volGainers,
    headerlist,
  }: any = useContext(DBContext);
  const { appContextLoaded, defaultCurrency }: any = useContext(AppContext);

  return appContextLoaded ? (
    <Fragment>
      <div className="primary-header">
        <Row>
          <Col span={24}>
            <PageHeader
              title="Overview"
              extra={[<CoachingRequest key="coach" />]}
            />
          </Col>
          <Col span={24} className="secondary-header">
            <Row>
              <Col xs={24} md={4}>{`Today's Prices`}</Col>
              <Col xs={24} md={20}>
                <Row justify="space-between">
                  {headerlist.map((item: any) => {
                    const { label, price } = item;
                    return (
                      <Col key={label}>
                        <InsPrice
                          pre={label}
                          price={price}
                          currency={defaultCurrency}
                          previousPrice={0}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Col>
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
              <AAList />
            </Col>
            <Col xs={24} sm={24} md={10} style={{ marginBottom: "10px" }}>
              <Watchlist />
            </Col>
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
              <StockMarket />
            </Col>
          </Row>
        </Fragment>
      </div>
    </Fragment>
  ) : (
    <Skeleton active />
  );
}
