import React, { Fragment, useContext } from "react";
import HoldingTabView from "./HoldingTabView";
import {
  ASSETS_VIEW,
  FINANCIAL_LABEL,
  LIABILITIES_VIEW,
  NWContext,
} from "./NWContext";
import { Button, Col, Dropdown, Menu, Radio, Row, Skeleton } from "antd";
import { CheckOutlined } from "@ant-design/icons";

require("./nw.less");
import TotalNetWorth from "./TotalNetWorth";
import ItemDisplay from "../calc/ItemDisplay";
import { AppContext } from "../AppContext";
import MenuItem from "antd/lib/menu/MenuItem";

require("./NWView.less");

export default function NWView() {
  const {
    selectedCurrency,
    loadingHoldings,
    totalAssets,
    totalLiabilities,
    nwview,
    setNwview,
    addSelfMember,
    familyMemberKeys,
    loadingInstruments,
    setActiveTab,
    setShowInsUpload,
  }: any = useContext(NWContext);
  const { appContextLoaded }: any = useContext(AppContext);
  const UPLOAD_OPTION = "Upload";
  const MANUAL_OPTION = "Manual";
  const startOptions: any = {
    [UPLOAD_OPTION]: "Upload NSDL / CSDL monthly statement",
    [MANUAL_OPTION]: "Start manual entry of my investments",
  };
  return (
    <Fragment>
      {appContextLoaded && !loadingHoldings && !loadingInstruments ? (
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
                    value={nwview}
                    onChange={(e) => setNwview(e.target.value)}
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
                                loading={loadingInstruments}
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
              <HoldingTabView liabilities={nwview !== ASSETS_VIEW} />
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
            <Dropdown
              overlay={
                <Menu>
                  {Object.keys(startOptions).map((key: string) => (
                    <MenuItem
                      key={key}
                      onClick={() => {
                        addSelfMember();
                        if (key === UPLOAD_OPTION) {
                          setActiveTab(FINANCIAL_LABEL);
                          setShowInsUpload(true);
                        }
                      }}>
                      {startOptions[key]}
                    </MenuItem>
                  ))}
                </Menu>
              }>
              <Button type="primary">Get Started</Button>
            </Dropdown>

            <p>&nbsp;</p>
          </div>
        )
      ) : (
        <Skeleton active />
      )}
    </Fragment>
  );
}
