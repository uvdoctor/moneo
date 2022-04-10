import { Row, Col } from "antd";
import React from "react";
import Purchase from "./Purchase";

interface PurchaseViewProps {
  record: any;
  instruments: Array<any>;
  setInstruments: Function;
  isHolding?: boolean;
}

export default function PurchaseView({
  record,
  instruments,
  setInstruments,
  isHolding,
}: PurchaseViewProps) {
  const onChange = (data: any) => {
    let index = isHolding
      ? record.key
      : instruments.findIndex((item: any) => item.id === record.id);
    if (index > -1) {
      let purchase: any = [];
      data.map((item: any) => {
        const { qty, amt, date } = item;
        const newDate = new Date(date);
        purchase.push({
          qty,
          amt,
          month: newDate.getMonth() + 1,
          year: newDate.getFullYear(),
          day: newDate.getDate(),
        });
      });
      instruments[index].pur = purchase;
      setInstruments([...instruments]);
    }
  };

  return (
    <Row justify="center">
      <Col span={24}>
        <Purchase
          onSave={(pur: any) => onChange(pur)}
          pur={record.pur ? record.pur : []}
          qty={Number(record.qty)}
        />
      </Col>
    </Row>
  );
}
