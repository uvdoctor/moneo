import { Col, Row } from "antd";
import React, { useState } from "react";
import { HoldingInput, InstrumentInput } from "../../api/goals";
import RadioInput from "../form/RadioInput";
import PurchaseView from "./PurchaseView";

interface InstrumentDetailedViewProps {
  record: any;
  data: Array<InstrumentInput | HoldingInput>;
  dataHandler: Function;
  otherView?: any;
  hasAnalysis?: boolean;
  isHolding?: boolean;
}

export default function InstrumentDetailedView({
  record,
  data,
  dataHandler,
  otherView,
  hasAnalysis,
  isHolding,
}: InstrumentDetailedViewProps) {
  const PURCHASE = "Buy Transactions";
  const ANALYSIS = "Analysis";
  const OTHER = "Other";
  const [view, setView] = useState<string>(PURCHASE);
  const radioOptions = hasAnalysis
    ? [PURCHASE, ANALYSIS, OTHER]
    : [PURCHASE, OTHER];

  return (
    <Row justify="center" gutter={[0, 8]}>
      <RadioInput options={radioOptions} value={view} changeHandler={setView} />
      <Col xs={24}>
        {view === PURCHASE ? (
          <PurchaseView
            record={record}
            instruments={data}
            setInstruments={dataHandler}
            isHolding={isHolding}
          />
        ) : view === OTHER && otherView ? (
          <>{otherView}</>
        ) : hasAnalysis ? (
          <></>
        ) : null}
      </Col>
    </Row>
  );
}
