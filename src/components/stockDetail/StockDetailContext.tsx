import { Col, PageHeader, Row, Spin, Tooltip } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import CoachingRequest from "../CoachingRequest";
import useFetch from "../useFetch";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { loadInsHoldings } from "../nw/nwutils";
import { InstrumentInput } from "../../api/goals";
import { loadInstruments } from "../nw/valuationutils";
import YearlyLowHigh from "../nw/YearlyLowHigh";

const StockDetailContext = createContext({});

function StockDetailContextProvider({ name, children }: any) {
  //@ts-ignore
  const [state, dispatch, loadData] = useFetch(`/api/details?name=${name}`);
  const { owner }: any = useContext(AppContext);
  const [quantity, setQuantity] = useState<number>(0);
  const [instrument, setInstrument] = useState<any | null>(null);
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
      return;
    }
    const isin = state.data?.General?.ISIN;
    const currency = state.data?.General?.CurrencyCode;
    if (!isin && !currency) return;
    setCurrency(currency);
    loadInstruments([isin]).then((allInsData: any) => {
      if (allInsData[isin]) setInstrument(allInsData[isin]);
      console.log(allInsData[isin]);
    });
  }, [state.isLoading]);

  useEffect(() => {
    if (!owner) {
      setQuantity(0);
      return;
    }
    loadInsHoldings(owner).then((result: any) => {
      let quantity = 0;
      if (result.ins) {
        const instruments = result.ins;
        instruments.forEach((instrument: InstrumentInput) => {
          if (instrument.sid === ticker) quantity += instrument.qty;
        });
      }
      setQuantity(quantity);
    });
  }, [owner]);

  return (
    <StockDetailContext.Provider
      value={{
        name,
        state,
      }}>
      <>
        {name ? (
          <Row className="primary-header">
            <Col span={24}>
              <PageHeader
                title={ticker}
                extra={[<CoachingRequest key="cr" />]}
              />
            </Col>
            <Col span={24} className="secondary-header">
              <Row justify="space-between">
                <Col xs={20} sm={12} md={6}>
                  {instrument && currency ? (
                    <YearlyLowHigh
                      instrument={instrument}
                      currency={currency}
                      price={instrument.price}
                      previousPrice={instrument.prev}
                    />
                  ) : (
                    <Spin />
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
