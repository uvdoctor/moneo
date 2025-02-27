import { Col, PageHeader, Row, Spin, Tooltip } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import CoachingRequest from "../CoachingRequest";
import useFetch from "../useFetch";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { getExchgRate, loadInsHoldings } from "../nw/nwutils";
import { InstrumentInput } from "../../api/goals";
import { loadInstruments } from "../nw/valuationutils";
import PerfHistFeedback from "../nw/PerfHistFeedback";
import { LOCAL_INS_PERF_KEY } from "../../CONSTANTS";
import simpleStorage from "simplestorage.js";
import InsPrice from "../nw/InsPrice";

const StockDetailContext = createContext({});

function StockDetailContextProvider({ name, children }: any) {
  //@ts-ignore
  const [state, dispatch, loadData] = useFetch(`/api/details?name=${name}`);
  const { owner }: any = useContext(AppContext);
  const [quantity, setQuantity] = useState<number>(0);
  const [instrument, setInstrument] = useState<any | null>(null);
  const [instrumentPerf, setInstrumentPerf] = useState<any | null>(null);
  const [currency, setCurrency] = useState<string>("");
  const ticker = name && name.split(".")?.length ? name.split(".")[0] : name;

  useEffect(() => {
    if (!name) return;
    loadData();
  }, [name]);

  useEffect(() => {
    if (state.isLoading) {
      setInstrument(null);
      setCurrency("");
      setInstrumentPerf(null);
      return;
    }
    const isin = state.data?.General?.ISIN;
    const currency = state.data?.General?.CurrencyCode;
    const country = state.data?.General?.CountryISO;
    if (country === "US") {
      getExchgRate(ticker, "US").then((data: any) => {
        setInstrument({ id: ticker, price: data.price, prev: data.prev });
        setCurrency("USD");
      });
      return;
    }
    if (!isin && !currency) return;
    setCurrency(currency);
    loadInstruments([isin], owner).then((allInsData: any) => {
      const data = allInsData[isin];
      const insPerfData = simpleStorage.get(LOCAL_INS_PERF_KEY);
      if (data) {
        setInstrument(data);
        const instrumentPerf = insPerfData
          ? insPerfData[isin]
            ? insPerfData[isin]
            : insPerfData[data.sid as string]
            ? insPerfData[data.sid as string]
            : null
          : null;
        if (instrumentPerf) setInstrumentPerf(instrumentPerf);
      }
    });
  }, [state.isLoading]);

  useEffect(() => {
    if (!owner || !name) {
      setQuantity(0);
      return;
    }
    loadInsHoldings(owner).then((result: any) => {
      let quantity = 0;
      if (result?.ins) {
        const instruments = result.ins;
        instruments.forEach((instrument: InstrumentInput) => {
          if (instrument.sid === ticker) quantity += instrument.qty;
        });
      }
      setQuantity(quantity);
    });
  }, [name, owner]);

  return (
    <StockDetailContext.Provider
      value={{
        name,
        state,
      }}
    >
      <>
        {name ? (
          <Row className="primary-header">
            <Col span={24}>
              <PageHeader
                title={
                  <>
                    {ticker}&nbsp;
                    {instrument && currency ? (
                      <InsPrice
                        currency={currency}
                        price={instrument.price}
                        previousPrice={instrument.prev}
                        noColor
                        smallSize
                      />
                    ) : (
                      <Spin />
                    )}
                  </>
                }
                extra={[<CoachingRequest key="cr" />]}
              />
            </Col>
            <Col span={24} className="secondary-header">
              <Row justify="space-between" align="middle">
                <Col xs={20} sm={12}>
                  {currency === "USD" ? (
                    <></>
                  ) : (
                    <PerfHistFeedback
                      instrument={instrument}
                      performance={instrumentPerf}
                    />
                  )}
                </Col>
                <Col>
                  <Tooltip title={`Total quantity held is ${quantity}`}>
                    <ShoppingCartOutlined />
                    &nbsp;{quantity}
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : null}

        {children}
      </>
    </StockDetailContext.Provider>
  );
}

export { StockDetailContext as default, StockDetailContextProvider };
