import { Col, PageHeader, Row } from "antd";
import React, { createContext, useEffect } from "react";
import CoachingRequest from "../CoachingRequest";
import useFetch from "../useFetch";

const StockDetailContext = createContext({});

function StockDetailContextProvider({ name, children }: any) {
  //@ts-ignore
  const [state, dispatch, loadData] = useFetch(`/api/details?name=${name}`);

  useEffect(() => {
    if (!name) return;
    loadData();
  }, [name]);

  return (
    <StockDetailContext.Provider
      value={{
        name,
        state,
      }}>
      <>
        <Row className="primary-header">
          <Col span={24}>
            <PageHeader
              title={name.split(".")?.length ? name.split(".")[0] : name}
              extra={[<CoachingRequest key="cr" />]}
            />
          </Col>
          <Col span={24} className="secondary-header">
            <Row justify="space-between">
              <Col>Price</Col>
              <Col>Quantity owned</Col>
            </Row>
          </Col>
        </Row>

        {children}
      </>
    </StockDetailContext.Provider>
  );
}

export { StockDetailContext as default, StockDetailContextProvider };
