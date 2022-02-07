import React, { Fragment, useContext } from "react";
import HoldingTabView from "./HoldingTabView";
import { ASSETS_VIEW, LIABILITIES_VIEW, NWContext } from "./NWContext";
import { Button, Col, PageHeader, Radio, Row, Skeleton, Spin } from "antd";
import { CheckOutlined } from "@ant-design/icons";

require("./nw.less");
import FamilyInput from "./FamilyInput";
import TotalNetWorth from "./TotalNetWorth";
import ItemDisplay from "../calc/ItemDisplay";
import { AppContext } from "../AppContext";

require("./NWView.less");

export default function NWView() {
  const {
    selectedCurrency,
    loadingHoldings,
    totalAssets,
    totalLiabilities,
    view,
    setView,
    addSelfMember,
    familyMemberKeys,
    loadingInstruments,
  }: any = useContext(NWContext);
  const { appContextLoaded }: any = useContext(AppContext);

  return (
    <Fragment>
      <div className="primary-header">
        <Row>
          <Col span={24}>
            <PageHeader title="Financial Health Analysis" />
          </Col>
        </Row>
        <Row justify="center" align="middle" className="secondary-header">
          <Col>
            {appContextLoaded && !loadingHoldings ? <FamilyInput /> : <Spin />}
          </Col>
        </Row>
      </div>
      {appContextLoaded && !loadingHoldings ? (
        familyMemberKeys.length ? (
          <div className="nw-container">
            <Fragment>
              <Row justify="center" gutter={16}>
                <Col xs={24} sm={24} md={16} lg={8}>
                  <TotalNetWorth />
                </Col>
                <Col
                  className="dd-stat you-own-owe"
                  xs={24}
                  sm={24}
                  md={16}
                  lg={8}>
                  <Radio.Group
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    size="large">
                    <Row align="middle">
                      <Col span={12}>
                        <Radio.Button value={ASSETS_VIEW}>
                          <Row align="middle" justify="center" gutter={15}>
                            <Col>
                              <CheckOutlined />
                            </Col>
                            <Col>
                              <ItemDisplay
                                label="You Own"
                                result={totalAssets}
                                currency={selectedCurrency}
                                info="This is the total valuation of the assets you own."
                                loading={loadingHoldings || loadingInstruments}
                              />
                            </Col>
                          </Row>
                        </Radio.Button>
                      </Col>
                      <Col span={12}>
                        <Radio.Button value={LIABILITIES_VIEW}>
                          <Row align="middle" justify="center" gutter={15}>
                            <Col>
                              <CheckOutlined />
                            </Col>
                            <Col>
                              <ItemDisplay
                                label="You Owe"
                                result={-totalLiabilities}
                                currency={selectedCurrency}
                                info="This is the total valuation of all the money you owe."
                                loading={loadingHoldings}
                                pl
                              />
                            </Col>
                          </Row>
                        </Radio.Button>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Col>
              </Row>
              <HoldingTabView liabilities={view !== ASSETS_VIEW} />
            </Fragment>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p>&nbsp;</p>
            <h3>
              Please input data to get a comprehensive financial health
              analysis.
            </h3>
            <h3>More data you provide, better the analysis!</h3>
            <p>&nbsp;</p>
            <Button type="primary" onClick={() => addSelfMember()}>
              Get Started
            </Button>
            <p>&nbsp;</p>
          </div>
        )
      ) : (
        <Skeleton active />
      )}
    </Fragment>
  );
}
