import { Row, Col } from "antd";
import React, { useContext } from "react";
import NumberInput from "../form/numberinput";
import { NWContext } from "./NWContext";
import Purchase from "./Purchase";

interface PurchaseViewProps {
  record: any;
  isAvgPriceRecord: boolean;
  instruments: Array<any>;
  setInstruments: Function;
  isHolding?: boolean;
}

export default function PurchaseView({
  record,
  isAvgPriceRecord,
  instruments,
  setInstruments,
  isHolding,
}: PurchaseViewProps) {
  const { selectedCurrency }: any = useContext(NWContext);

  const onChange = (type: string, data: any) => {
    let index = isHolding
      ? record.key
      : instruments.findIndex((item: any) => item.id === record.id);
    if (index > -1) {
      let purchase: any = [];
      if (type === "pur") {
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
        instruments[index].avgp = purchase.length ? 0 : record.avgp;
      } else if (type === "avgp") {
        instruments[index].avgp = data;
      }
      setInstruments([...instruments]);
    }
  };

  return (
    <Row justify="center">
      <Col span={24}>
        {!isAvgPriceRecord ? (
          <Purchase
            onSave={(pur: any) => onChange("pur", pur)}
            pur={record.pur ? record.pur : []}
            qty={Number(record.qty)}
          />
        ) : (
          <Row justify="center">
            <Col>
              <NumberInput
              autoFocus
                pre="Average Price"
                value={record.avgp ? record.avgp : 0}
                changeHandler={(val: any)=>{
                  if (record?.pur?.length) {
                    record.avgp = 0;
                  } else {
                    record.avgp = val;
                    onChange("avgp", val);
                  }
                }}
                currency={selectedCurrency}
              />
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}
