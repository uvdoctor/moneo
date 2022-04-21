import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Button, List, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { NWContext, TAB } from "./NWContext";
import Search from "../Search";

export default function HoldingInput(props: any) {
  const { childTab }: any = useContext(NWContext);
  const { STOCK, MF, BOND, GOLDB, ETF, REIT, OIT, CRYPTO } = TAB;
  const [searchType, setSearchType] = useState<string>("");

  const searchtypeList = {
    [STOCK]: "stock",
    [MF]: "fund",
    [BOND]: "bond",
    [GOLDB]: GOLDB,
    [ETF]: "etf",
    [REIT]: REIT,
    [OIT]: OIT,
    [CRYPTO]: CRYPTO,
  };

  const addToHoldings = (resp: any) => {
    const { ISIN, Code, type, subt } = resp;
    props.addToHoldings(
      {
        qty: 0,
        fId: "",
        id: ISIN,
        sid: Code,
        curr: "INR",
        exchg: resp.exchg,
        subt,
        type,
      },
      { [ISIN]: resp }
    );
  };

  useEffect(() => {
    setSearchType(searchtypeList[childTab]);
  }, [childTab]);

  return (
    <Row gutter={[10, 10]}>
      <Col flex={8}>
        <Search
          searchType={searchType}
          renderItem={(resp: any) => {
            return (
              <List.Item>
                <Typography.Link
                  onClick={() => addToHoldings(resp)}
                  style={{ marginRight: 8 }}
                >
                  {resp.Name}{" "}
                  <Button icon={<PlusOutlined />} type="link" shape="circle" />
                </Typography.Link>
              </List.Item>
            );
          }}
        />
      </Col>
    </Row>
  );
}
