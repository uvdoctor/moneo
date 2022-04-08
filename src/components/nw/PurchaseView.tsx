import { Row, Col, InputNumber } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { InstrumentInput } from "../../api/goals";
import LabelWithTooltip from "../form/LabelWithTooltip";
import HSwitch from "../HSwitch";
import { NWContext } from "./NWContext";
import Purchase from "./Purchase";

interface PurchaseViewProps {
  record: InstrumentInput;
}

export default function PurchaseView({ record }: PurchaseViewProps) {
  const { instruments, setInstruments }: any = useContext(NWContext);
  const [isPurchase, setIsPurchase] = useState<number>(1);
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
      <HSwitch
        value={isPurchase}
        setter={setIsPurchase}
        leftText={
          <LabelWithTooltip
            label="Avg.Price"
            info="Average Price will give you approximate results"
          />
        }
        rightText={
          <LabelWithTooltip
            label="Purchase"
            info="Purchase Details will give you accurate results"
          />
        }
      />
      <Col xs={24}>
        {isPurchase ? (
          <Purchase
            onSave={(pur: any) => onChange("pur", pur)}
            pur={record.pur ? record.pur : []}
            qty={Number(record.qty)}
          />
        ) : (
          <Row justify="center" gutter={[0, 8]}>
            <LabelWithTooltip label="Average Price"/>
            <InputNumber
              style={{ width: "150px" }}
              value={avgp}
              onChange={(val) => setAvgp(val)}
            />
          </Row>
        )}
      </Col>
    </Row>
  );
}
