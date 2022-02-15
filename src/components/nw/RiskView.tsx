import { Button, Col, Row, Skeleton } from "antd";
import React, { Fragment, useContext } from "react";
import { AppContext } from "../AppContext";
import ItemDisplay from "../calc/ItemDisplay";
import HoldingTabView from "./HoldingTabView";
import { NWContext } from "./NWContext";
require("./nw.less");
require("./NWView.less");

export default function RiskView() {
  const { loadingHoldings, addSelfMember, familyMemberKeys }: any =
    useContext(NWContext);
  const { appContextLoaded }: any = useContext(AppContext);

  return (
    <Fragment>
      {appContextLoaded && !loadingHoldings ? (
        familyMemberKeys.length ? (
          <div className="nw-container">
            <Fragment>
              <Row justify="center" gutter={16}>
                <Col xs={24} sm={24} md={16} lg={8}>
                  <div className="dd-stat">
                    <ItemDisplay
                      label="Result"
                      result={0}
                      pl
                      info={"Risk Cover"}
                    />
                  </div>
                </Col>
              </Row>
              <HoldingTabView risk />
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
