import React, { Fragment, useContext } from "react";
import { NETWORTH_VIEW, NWContext, RISKCOVER_VIEW } from "./NWContext";
import { Col, PageHeader, Radio, Row, Spin } from "antd";
import { CheckOutlined } from "@ant-design/icons";

require("./nw.less");
import FamilyInput from "./FamilyInput";
import { AppContext } from "../AppContext";
import NWView from "./NWView";
import RiskView from "./RiskView";
import { COLORS } from "../../CONSTANTS";

require("./NWView.less");

export default function GetView() {
  const { loadingHoldings, view, setView }: any = useContext(NWContext);
  const { appContextLoaded }: any = useContext(AppContext);

  return (
    <Fragment>
      <div className="primary-header">
        <Row>
          <Col span={24}>
            <PageHeader
              title="Financial Health Analysis"
              extra={
                <Radio.Group
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  size="large"
                >
                  <Row align="middle" gutter={[10,10]}>
                    <Col span={12}>
                      <Radio.Button
                        value={NETWORTH_VIEW}
                        style={{
                          color: COLORS.GREEN,
                          background: COLORS.WHITE,
                        }}
                      >
                        {view === NETWORTH_VIEW ? <CheckOutlined /> : null}
                        Net Worth
                      </Radio.Button>
                    </Col>
                    <Col span={12}>
                      <Radio.Button
                        value={RISKCOVER_VIEW}
                        style={{
                          color: COLORS.GREEN,
                          background: COLORS.WHITE,
                        }}
                      >
                        {view === RISKCOVER_VIEW ? <CheckOutlined /> : null}
                        Risk Cover
                      </Radio.Button>
                    </Col>
                  </Row>
                </Radio.Group>
              }
            />
          </Col>
        </Row>
        <Row justify="center" align="middle" className="secondary-header">
          <Col>
            {appContextLoaded && !loadingHoldings ? <FamilyInput /> : <Spin />}
          </Col>
        </Row>
      </div>
      {view === NETWORTH_VIEW ? <NWView /> : <RiskView />}
    </Fragment>
  );
}
