import { Col, PageHeader, Row, Tooltip } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";
import CoachingRequest from "../CoachingRequest";
import useFetch from "../useFetch";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import { loadInsHoldings } from "../nw/nwutils";
const StockDetailContext = createContext({});

function StockDetailContextProvider({ name, children }: any) {
  //@ts-ignore
  const [state, dispatch, loadData] = useFetch(`/api/details?name=${name}`);
  const { appContextLoaded, user }: any = useContext(AppContext);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    if (!name) return;
    loadData();
  }, [name]);

  useEffect(() => {
    if (!appContextLoaded) return;
    if (!user) return;
    loadInsHoldings(user).then((instruments: any) => {
      console.log("Instruments: ", instruments);
      setQuantity(100);
    });
  }, [appContextLoaded]);

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
                title={name.split(".")?.length ? name.split(".")[0] : name}
                extra={[<CoachingRequest key="cr" />]}
              />
            </Col>
            <Col span={24} className="secondary-header">
              <Row justify="space-between">
                <Col>Price</Col>
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
