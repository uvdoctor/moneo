import { Col, Row } from "antd";
import React, { useContext, useState } from "react";
import { InstrumentInput } from "../../api/goals";
import RadioInput from "../form/RadioInput";
import CommonStock from "../stockDetail/CommonStock";
import { NWContext } from "./NWContext";
import PurchaseView from "./PurchaseView";

interface InstrumentDetailedViewProps {
  record: InstrumentInput;
}

export default function InstrumentDetailedView({
  record,
}: InstrumentDetailedViewProps) {
  const { instruments, setInstruments }: any = useContext(NWContext);
  CommonStock;
  const PURCHASE = "Purchase";
  const ANALYSIS = "Analysis";
  const [view, setView] = useState<string>(PURCHASE);

  return (
    <Row justify="center" gutter={[0, 8]}>
      <RadioInput
        options={[PURCHASE, ANALYSIS]}
        value={view}
        changeHandler={setView}
      />
      {view === PURCHASE ? (
        <Col xs={24}>
          <PurchaseView
            record={record}
            instruments={instruments}
            setInstruments={setInstruments}
          />
        </Col>
      ) : (
        <></>
      )}
    </Row>
  );
}
