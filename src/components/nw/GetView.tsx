import React, { Fragment, useContext } from "react";
import { NETWORTH_VIEW, NWContext, RISKCOVER_VIEW } from "./NWContext";
import { Col, PageHeader, Row, Spin } from "antd";

require("./nw.less");
import FamilyInput from "./FamilyInput";
import { AppContext } from "../AppContext";
import NWView from "./NWView";
import RiskView from "./RiskView";
import RadioInput from "../form/RadioInput";
import CoachingRequest from "../CoachingRequest";

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
              title={
                <RadioInput
                  options={[NETWORTH_VIEW, RISKCOVER_VIEW]}
                  value={view}
                  changeHandler={(val: string) => setView(val)}
                  style={{ color: "black", backgroundColor: "white" }}
                  onchangeStyle={{
                    color: "white",
                    backgroundColor: "#3d4a53",
                  }}
                  size="large"
                />
              }
              extra={[<CoachingRequest key="cr" />]}
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
