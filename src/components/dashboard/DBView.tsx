import React, { Fragment, useContext } from "react";
import { Col, PageHeader, Row, Skeleton } from "antd";
import ItemDisplay from "../calc/ItemDisplay";
import { AppContext } from "../AppContext";
import { DBContext } from "./DBContext";
import { ROUTES } from "../../CONSTANTS";
require("./DBView.less");

export default function DBView() {
  const { totalAssets, totalLiabilities }: any = useContext(DBContext);
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
          <Row justify="center" gutter={[16, 16]}>
            <Col xs={24} sm={24} md={16} lg={12}>
              <div className="dd-stat">
                <Row gutter={[10, 10]}>
                  <Col span={24}>
                    <ItemDisplay
                      label="Net Worth"
                      result={totalAssets - totalLiabilities}
                      currency={defaultCurrency}
                      pl
                      info={"Net Worth equals what you own minus what you owe."}
                    />
                    {!(totalAssets-totalLiabilities) ? <a href={ROUTES.GET}>
                       Discover your networth
                    </a> : null}
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
          </Row>
        </Fragment>
      </div>
    </Fragment>
  ) : (
    <Skeleton active />
  );
}
