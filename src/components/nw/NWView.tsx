import React, { Fragment, useContext } from "react";
import HoldingTabView from "./HoldingTabView";
import { ASSETS_VIEW, LIABILITIES_VIEW, NWContext } from "./NWContext";
import { Button, Col, PageHeader, Radio, Row, Skeleton } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import SelectInput from "../form/selectinput";

require("./nw.less");
import FamilyInput from "./FamilyInput";
import TotalNetWorth from "./TotalNetWorth";
import ItemDisplay from "../calc/ItemDisplay";
import { AppContext } from "../AppContext";

require("./NWView.less");

export default function NWView() {
  const {
    selectedCurrency,
    setSelectedCurrency,
    loadingHoldings,
    loadingFamily,
    currencyList,
    totalAssets,
    totalLiabilities,
    view,
    setView,
    addSelfMember,
    allFamily,
  }: any = useContext(NWContext);
  const { appContextLoaded }: any = useContext(AppContext);

  return appContextLoaded && !loadingFamily ? (
    allFamily && Object.keys(allFamily).length ? (
      <Fragment>
        <div className="primary-header">
          <Row>
            <Col span={24}>
              <PageHeader
                title="Real-time Analysis"
                extra={[
                  <SelectInput
                    key="currency"
                    pre=""
                    value={selectedCurrency}
                    changeHandler={setSelectedCurrency}
                    options={currencyList}
                    loading={loadingHoldings}
                  />,
                ]}
              />
            </Col>
          </Row>
          <Row justify="center" align="middle" className="secondary-header">
            <Col>
              <FamilyInput />
            </Col>
          </Row>
        </div>
        <div className="nw-container">
          {!loadingHoldings && !loadingFamily ? (
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
          ) : (
            <Skeleton active />
          )}
        </div>
      </Fragment>
    ) : (
      <div style={{ textAlign: "center" }}>
        <h3>Please input your data.</h3>
        <h3>Get a comprehensive financial health analysis.</h3>
        <Button type="primary" onClick={() => addSelfMember()}>
          Get Started
        </Button>
      </div>
    )
  ) : (
    <Skeleton active />
  );
}
