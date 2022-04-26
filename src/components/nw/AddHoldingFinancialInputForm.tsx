import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Divider } from "antd";
import { NWContext } from "./NWContext";
import Search from "../Search";
import { InstrumentInput } from "../../api/goals";
import simpleStorage from "simplestorage.js";
import { LOCAL_DATA_TTL, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import InstrumentManualInput from "./InstrumentManualInput";

export default function AddHoldingFinancialInputForm(props: any) {
  const { childTab }: any = useContext(NWContext);
  const [searchType, setSearchType] = useState<string>("");
  const [instruments, setInstruments] = useState<InstrumentInput[]>([]);
  const { updateInstruments, disableOk } = props;

  useEffect(() => {
    disableOk(true);
  }, [disableOk]);

  const addToHoldings = (newHolding: any, newRawDetails: any) => {
    const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    const mergedInsData = Object.assign({}, insData, newRawDetails);
    instruments.push(newHolding);
    setInstruments([...instruments]);
    updateInstruments(instruments);
    simpleStorage.set(LOCAL_INS_DATA_KEY, mergedInsData, LOCAL_DATA_TTL);
    disableOk(!instruments.length);
  };

  const deleteInstrument = (index: number) => {
    instruments.splice(index, 1);
    setInstruments([...instruments]);
    updateInstruments(instruments);
    disableOk(!instruments.length);
  };

  const addInstrument = (resp: any) => {
    const { id, sid, type, subt, exchg } = resp;
    addToHoldings(
      {
        qty: 0,
        fId: "",
        id,
        sid,
        curr: "INR",
        exchg,
        subt,
        type,
      },
      { [id]: resp }
    );
  };

  useEffect(() => {
    setSearchType(childTab);
  }, [childTab]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Search
            searchType={searchType}
            onClick={(resp: any) => {
              addInstrument(resp);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {instruments.length ? (
            <div className="holdings-entry-container">
              {instruments.map((ins, index) => (
                <Row className="instrument" key={ins.id}>
                  <Divider />
                  <Col span={24}>
                    <InstrumentManualInput
                      instrument={ins}
                      index={index}
                      deleteInstrument={deleteInstrument}
                    />
                  </Col>
                </Row>
              ))}
            </div>
          ) : null}
        </Col>
      </Row>
    </>
  );
}
