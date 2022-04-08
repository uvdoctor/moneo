import { Row, Col } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { InstrumentInput } from "../../api/goals";
import NumberInput from "../form/numberinput";
import { NWContext } from "./NWContext";
import Purchase from "./Purchase";

interface PurchaseViewProps {
  record: InstrumentInput;
  isAvgPriceRecord: boolean;
}

export default function PurchaseView({
  record,
  isAvgPriceRecord,
}: PurchaseViewProps) {
  const { instruments, setInstruments, selectedCurrency }: any =
    useContext(NWContext);
  const [avgp, setAvgp] = useState<number>(record.avgp ? record.avgp : 0);

  const onChange = (type: string, data: any) => {
    const index = instruments.findIndex((item: any) => item.id === record.id);
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
        instruments[index].avgp = purchase.length ? 0 : avgp;
      } else if (type === "avgp") {
        instruments[index].avgp = data;
      }
      setInstruments([...instruments]);
    }
  };

  useEffect(() => {
    if (record?.pur?.length) {
      record.avgp = 0;
    } else {
      record.avgp = avgp;
      onChange("avgp", avgp);
    }
  }, [avgp]);

  return (
    <Row justify="center" gutter={[0, 8]}>
      <Col xs={24}>
        {!isAvgPriceRecord ? (
          <Purchase
            onSave={(pur: any) => onChange("pur", pur)}
            pur={record.pur ? record.pur : []}
            qty={Number(record.qty)}
          />
        ) : (
          <Row justify="center">
            <NumberInput
              pre="Average Price"
              value={avgp}
              changeHandler={setAvgp}
              currency={selectedCurrency}
            />
          </Row>
        )}
      </Col>
    </Row>
  );
}
