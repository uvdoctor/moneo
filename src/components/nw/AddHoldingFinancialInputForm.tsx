import React, { useContext, useEffect, useState } from "react";
import { Row, Col } from "antd";
import { NWContext } from "./NWContext";
import Search from "../Search";

export default function HoldingInput(props: any) {
  const { childTab }: any = useContext(NWContext);
  const [searchType, setSearchType] = useState<string>("");

  const addToHoldings = (resp: any) => {
    const { id, sid, type, subt, exchg } = resp;
    props.addToHoldings(
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
    <Row gutter={[10, 10]}>
      <Col flex={8}>
        <Search
          width="300px"
          searchType={searchType}
          onClick={(resp: any) => {
            addToHoldings(resp);
          }}
        />
      </Col>
    </Row>
  );
}
